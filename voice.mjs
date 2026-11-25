// ============================================================================
// MOCHI VOICE - ElevenLabs Text-to-Speech (licensed stock Hindi female voice).
// Voice must come from the ElevenLabs Voice Library (licensed stock voice).
// No voice is cloned or copied from any real person.
// ============================================================================

// Load .env: prefer dotenv (npm install), fall back to Node 20.6+ built-in loader
try {
  const dotenv = await import("dotenv");
  dotenv.config();
} catch {
  try { process.loadEnvFile(); } catch { /* no .env file - env vars may still be set */ }
}

const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

/**
 * Convert Hindi text to speech (MP3) via ElevenLabs.
 * @param {string} text - Hindi text to speak
 * @returns {Promise<Buffer>} MP3 audio bytes
 * @throws {Error} clear error if API key is missing or API call fails
 */
export async function speakHindi(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || apiKey === "sk_replace_me_with_your_key") {
    throw new Error("ELEVENLABS_API_KEY missing. Set it in server/.env (copy from .env.example).");
  }
  if (!voiceId || voiceId === "replace_me_with_voice_id") {
    throw new Error("ELEVENLABS_VOICE_ID missing. Set it in server/.env - use a licensed stock Hindi female voice from the ElevenLabs Voice Library.");
  }

  const response = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`ElevenLabs API error ${response.status}: ${body.slice(0, 200)}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
