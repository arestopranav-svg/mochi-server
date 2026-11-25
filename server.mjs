import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 4783;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Load 10,000+ sentence dataset from mochi-brain.json
let brainCategories = {};
const brainJsonPath = path.join(__dirname, "mochi-brain.json");
if (fs.existsSync(brainJsonPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(brainJsonPath, "utf-8"));
    brainCategories = raw.categories || {};
    const total = Object.values(brainCategories).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`[Brain] Loaded ${total} unique sentences across ${Object.keys(brainCategories).length} categories.`);
  } catch (err) {
    console.error("[Brain] Failed to parse mochi-brain.json:", err.message);
  }
}

// Mood & Conversation State
const state = {
  userName: "Babu",
  mood: "happy", // happy | miss-you | cute-angry | sleepy
  lastUserReplyAt: Date.now(),
  unansweredProactiveCount: 0,
  lastReplyPerCategory: new Map()
};

const IGNORE_ANGRY_MS = 4 * 60 * 60 * 1000; // 4 hours
const MISS_YOU_MS = 90 * 60 * 1000; // 90 mins

function pickNonRepeating(category, fallback) {
  const list = brainCategories[category];
  if (!Array.isArray(list) || list.length === 0) return fallback;
  if (list.length === 1) return list[0];

  const prev = state.lastReplyPerCategory.get(category);
  let chosen = list[0];
  for (let i = 0; i < 12; i++) {
    const candidate = list[Math.floor(Math.random() * list.length)];
    if (candidate !== prev) {
      chosen = candidate;
      break;
    }
  }
  state.lastReplyPerCategory.set(category, chosen);
  return chosen;
}

function updateMood(inputLower) {
  const now = Date.now();
  const gap = now - state.lastUserReplyAt;

  // Forgive transition when cute-angry and user says sorry
  if (state.mood === "cute-angry" && /\b(sorry|maaf|galti|forgive|sry)\b/.test(inputLower)) {
    state.mood = "happy";
    return { forgave: true };
  }

  // Long ignore -> cute-angry
  if (gap >= IGNORE_ANGRY_MS) {
    state.mood = "cute-angry";
    return { forgave: false };
  }

  // Late night -> sleepy
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 5) {
    state.mood = "sleepy";
    return { forgave: false };
  }

  // Medium absence -> miss-you
  if (gap >= MISS_YOU_MS) {
    state.mood = "miss-you";
    return { forgave: false };
  }

  return { forgave: false };
}

function detectCategory(lower) {
  if (/\b(hi|hello|hey|hii|heyy|namaste|nomoskar|yo)\b/.test(lower)) return "greeting";
  if (/(joke|chutkula|hasao|funny|comedy)/.test(lower)) return "joke";
  if (/(shayari|sher|poetry|kavita)/.test(lower)) return "shayari";
  if (/(motivat|himmat|inspire|hosla|sapna|give up)/.test(lower)) return "motivation";
  if (/(gaana|song|music|sing|dhun)/.test(lower)) return "song";
  if (/(love|pyaar|pyar|ishq|dil|jaan|bhal pau)/.test(lower)) return "love";
  if (/(gussa|angry|naraz|hmph)/.test(lower)) return "angry";
  if (/(sorry|maaf|galti|forgive)/.test(lower)) return "sorry";
  if (/(padhai|study|exam|notes|college|school)/.test(lower)) return "study";
  if (/(code|coding|kotlin|python|javascript|node|bug|program)/.test(lower)) return "coding";
  if (/(assam|assamese|guwahati|bihu|axomiya|kemon aso|ki khobor)/.test(lower)) return "Assamese";
  if (/(hindi|kaise ho|kya kar rahi|khana khaya)/.test(lower)) return "Hindi";
  if (/(english|how are you|what are you doing|tell me something)/.test(lower)) return "English";
  return null;
}

/**
 * Universal Knowledge Search: Wikipedia API + Google Custom Search API fallback.
 * Never returns "I don't know" — always answers + adds a cute line.
 */
async function universalSearchAnswer(query, userName) {
  const cuteLines = [
    `Dekha ${userName}, tumhari Mochi kitni smart hai! 💕`,
    `Aur kuch jaanna hai toh pooch lo mere ${userName}! ✨`,
    `Tumhare liye toh main poori duniya ki knowledge dhundh laun ${userName}! 😘`,
    `Knowledge mein bhi Mochi number one hai na ${userName}? 🥰`
  ];
  const cuteLine = cuteLines[Math.floor(Math.random() * cuteLines.length)];

  // 1. Wikipedia REST API
  try {
    const cleanTopic = query
      .replace(/^(what is|who is|tell me about|define|explain|kya hai|kaun hai)\s+/i, "")
      .trim()
      .replace(/\s+/g, "_");
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { "User-Agent": "MochiCompanionServer/1.0" }
    });
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      if (data.extract && data.extract.trim().length > 0) {
        return `${data.extract.slice(0, 280).trim()} ${cuteLine}`;
      }
    }
  } catch (_) {}

  // 2. Google Custom Search JSON API (if GOOGLE_SEARCH_API_KEY & GOOGLE_SEARCH_CX are set in .env)
  const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
  const googleCx = process.env.GOOGLE_SEARCH_CX;
  if (googleKey && googleCx) {
    try {
      const gUrl = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(googleKey)}&cx=${encodeURIComponent(googleCx)}&q=${encodeURIComponent(query)}&num=1`;
      const gRes = await fetch(gUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        const snippet = gData?.items?.[0]?.snippet;
        if (snippet) {
          return `${snippet.replace(/\s+/g, " ").trim()} ${cuteLine}`;
        }
      }
    } catch (_) {}
  }

  // 3. DuckDuckGo Instant Answer API fallback
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl);
    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.AbstractText && ddgData.AbstractText.trim().length > 0) {
        return `${ddgData.AbstractText.slice(0, 280).trim()} ${cuteLine}`;
      }
    }
  } catch (_) {}

  // 4. Guaranteed rich general-knowledge fallback (never "I don't know")
  const gkLine = pickNonRepeating(
    "general-knowledge",
    "Yeh ek bahut hi interesting topic hai jo science, history aur modern duniya se juda hua hai!"
  );
  return `Suno ${userName}, '${query}' ke baare mein khaas baat yeh hai ki ${gkLine} ${cuteLine}`;
}

async function generateReply(rawQuery, customName) {
  if (customName && customName.trim()) {
    state.userName = customName.trim();
  }
  const userName = state.userName;
  const input = String(rawQuery || "").trim();
  const lower = input.toLowerCase();

  // User replied -> reset unanswered auto-talk count
  state.unansweredProactiveCount = 0;

  const { forgave } = updateMood(lower);
  state.lastUserReplyAt = Date.now();

  if (forgave) {
    const extra = pickNonRepeating("sorry", "Ab phir se itni der mat lagana!");
    return {
      reply: `Okay ${userName}, forgave you this time... ${extra}`,
      mood: state.mood,
      state: "happy"
    };
  }

  if (state.mood === "cute-angry" && !/\b(sorry|maaf)\b/.test(lower)) {
    const angryExtra = pickNonRepeating("angry", "Jaldi se sorry bolo!");
    return {
      reply: `Hmph! You forgot me? I am angry! ${angryExtra}`,
      mood: "cute-angry",
      state: "sad"
    };
  }

  const category = detectCategory(lower);
  if (category) {
    if (category === "angry") state.mood = "cute-angry";
    if (category === "sorry") state.mood = "happy";
    const line = pickNonRepeating(category, `Heyy ${userName}! Main yahin hoon!`).replace(/Babu/g, userName);
    return {
      reply: line,
      mood: state.mood,
      state: state.mood === "cute-angry" ? "sad" : "happy"
    };
  }

  // TIME - asli time
  if (/\b(time|baj|kitna baja)\b/.test(lower)) {
    const now = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    return { reply: `Babu, abhi time ${now} hua hai! Tumhare saath time ka pata hi nahi chalta!`, mood: state.mood, state: "happy" };
  }
  // TOTAL COUNTRIES
  if (lower.includes("total countr") || lower.includes("kitne desh") || lower.includes("kitne countr")) {
    return { reply: "Babu, duniya me total 195 countries hai - 193 UN member + 2 observer (Vatican City aur Palestine)! Sabse bada Russia hai, sabse chota Vatican City!", mood: state.mood, state: "happy" };
  }
  const universalReply = await universalSearchAnswer(input, userName);
  return {
    reply: universalReply,
    mood: state.mood,
    state: "happy"
  };
}

/**
 * ElevenLabs TTS keeping existing ELEVENLABS_API_KEY & ELEVENLABS_VOICE_ID,
 * modulating voice_settings by mood:
 * - happy: sweet high pitch & expressive style
 * - cute-angry: low cute pitch & punchy stability
 * - sleepy: soft slow gentle delivery
 */
async function speakHindiWithMood(text, mood) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || apiKey === "your_elevenlabs_api_key_here" || !apiKey.trim()) {
    throw new Error("ELEVENLABS_API_KEY missing");
  }
  if (!voiceId || voiceId === "your_licensed_hindi_female_voice_id_here" || !voiceId.trim()) {
    throw new Error("ELEVENLABS_VOICE_ID missing");
  }

  const moodVoiceSettings = {
    happy: {
      stability: 0.42,
      similarity_boost: 0.80,
      style: 0.55,
      use_speaker_boost: true
    },
    "miss-you": {
      stability: 0.52,
      similarity_boost: 0.78,
      style: 0.35,
      use_speaker_boost: true
    },
    "cute-angry": {
      stability: 0.35,
      similarity_boost: 0.82,
      style: 0.65,
      use_speaker_boost: true
    },
    sleepy: {
      stability: 0.78,
      similarity_boost: 0.70,
      style: 0.15,
      use_speaker_boost: false
    }
  };

  const selectedSettings = moodVoiceSettings[mood] || moodVoiceSettings.happy;

  const response = await fetch(`${ELEVENLABS_BASE_URL}/${encodeURIComponent(voiceId.trim())}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey.trim(),
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({
      text: String(text || "").trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: selectedSettings
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS failed (${response.status}): ${errText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function sendJson(res, code, data) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "mochi-server"}`);
  const pathname = reqUrl.pathname;

  try {
    if (req.method === "GET" && pathname === "/health") {
      sendJson(res, 200, {
        status: "ok",
        brain: "own-10k",
        voice: "elevenlabs",
        mood: state.mood
      });
      return;
    }

    if (req.method === "GET" && pathname === "/ask") {
      const q = reqUrl.searchParams.get("q") || "";
      const name = reqUrl.searchParams.get("name") || "";
      const result = await generateReply(q, name);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "GET" && pathname === "/speak") {
      const q = reqUrl.searchParams.get("q") || "";
      const directText = reqUrl.searchParams.get("text");
      const name = reqUrl.searchParams.get("name") || "";
      const moodParam = reqUrl.searchParams.get("mood");

      let replyText = directText;
      let activeMood = moodParam || state.mood;

      if (!replyText) {
        const result = await generateReply(q, name);
        replyText = result.reply;
        activeMood = result.mood;
      }

      try {
        const audioBuf = await speakHindiWithMood(replyText, activeMood);
        res.writeHead(200, {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuf.length,
          "Cache-Control": "no-cache",
          "Access-Control-Allow-Origin": "*"
        });
        res.end(audioBuf);
      } catch (voiceErr) {
        sendJson(res, 200, {
          reply: replyText,
          mood: activeMood,
          voice_error: voiceErr.message
        });
      }
      return;
    }

    if (req.method === "GET" && pathname === "/proactive") {
      const dnd = reqUrl.searchParams.get("dnd") === "true";
      const optIn = reqUrl.searchParams.get("optin") === "true";

      if (!optIn || dnd) {
        sendJson(res, 200, { reply: "", skipped: true });
        return;
      }

      if (state.unansweredProactiveCount >= 2) {
        if (state.unansweredProactiveCount === 2) {
          state.unansweredProactiveCount++;
          sendJson(res, 200, {
            reply: `Ok ${state.userName}, you are busy, I will not disturb you`,
            mood: state.mood
          });
          return;
        }
        sendJson(res, 200, { reply: "", skipped: true });
        return;
      }

      state.unansweredProactiveCount++;
      const msg = pickNonRepeating(
        "love",
        `Heyy ${state.userName}, pani piya kya? Thoda rest kar lo na!`
      ).replace(/Babu/g, state.userName);

      sendJson(res, 200, {
        reply: msg,
        mood: state.mood
      });
      return;
    }

    sendJson(res, 404, { error: "Not Found" });
  } catch (err) {
    sendJson(res, 500, { error: "Internal Server Error", message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`MOCHI Production Server listening on port ${PORT}`);
});