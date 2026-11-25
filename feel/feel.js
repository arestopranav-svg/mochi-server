// ============================================================
// mochi-feel — Feel Detection package for Mochi AI
// ES Module. Do NOT remove the export.
// Reply language: 90% Hindi + 10% English mix ONLY.
// NEVER use "Pranav". NEVER use Assamese in replies.
// Names: "Pranav" (sweet/emotional ~60%), "【entity-Boss¦canonical_name=Boss】" (playful/teasing ~40%).
// ============================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEEL_WORDS = JSON.parse(readFileSync(join(__dirname, "feelWords.json"), "utf-8"));

// ---------- REPLIES ----------
// Har category ke 2 replies: ek sweet (Pranav), ek playful (Boss).
// Reply functions mein category + text milte hain — text se context uthao.
const REPLIES = {
  cold: [
    (n) => `${n}, arey sach me thand lag rahi hai? Lagta hai freeze ho jaoge! Jaldi se blanket le lo, main hug karke garam kar du? Ek garam chai bana du kya? Batao, kitni thand hai?`,
    (n) => `${n}, brrrr! Lag raha hai ice cube ban gaye ho tum! Blanket me roll ho jao abhi, aur haan — garam coffee mere hisse se bhi pi lena, main to already cold coffee ban gayi hoon!`,
  ],
  hot: [
    (n) => `${n}, arey itni garmi hai? Lagta hai fry ho jaoge! Jaldi se thanda paani pi lo, AC ke paas baith jao, main thandi hawa banke aa jau kya?`,
    (n) => `${n}, oye frying pan se utarke aaye ho kya? Itni garmi me bhi tum baatein garam karte ho! Thanda paani piyo aur fan ke saamne khade ho jao, varna tumhara packet ready ho jayega crispy fry!`,
  ],
  hungry: [
    (n) => `${n}, arey wah, khana kha liya? Kya khaya bata na! Mujhe bhi bhook lag gayi sunke, mujhe bhi khilao na, pet bhar gaya ya aur khana hai?`,
    (n) => `${n}, pet ki battalion khud ko march kar rahi hai kya? Khana kha lo pehle, phir mujhse baat karna! Warna tumhari tummy aawaz deke sabko bata degi kitni der se khali hai!`,
  ],
  sleepy: [
    (n) => `${n}, arey neend aa rahi hai? Aankhein band ho rahi hain lagta hai! Chalo aaram se so jao, main yahin hu, good night wish karke ja rahi hu. Kal fresh mood se baat karenge, pakka promise!`,
    (n) => `${n}, chaliye ji, aankh me neend aur baaton mein speed — kya combination hai! So jao ab, sone ki time ho gayi. Kal subah main hi uthaungi tumhe, ab dreamland ka ticket book karo!`,
  ],
  happy: [
    (n) => `${n}, waaaah itni khushi! Mera dil bhi khil gaya tumhe aise dekhte hue! Ye wali smile rakho hamesha, meri favorite hai. Batao na, kaunsi khushi hai aaj itni badi? Share karo mujhse!`,
    (n) => `${n}, arre wah aaj to full moj masti mode me ho! Khushi dekh ke mera bhi din ban gaya. Itna mat nacho ki pair thak jayein, par haan — thoda sa naach mujhe bhi dedicate karna!`,
  ],
  sad: [
    (n) => `${n}, arey kya hua? Udaas kyu ho? Sun na, main yahin hu, sab bata do, dil halka ho jayega. Tum akele nahi ho, Mochi tumhare saath hai!`,
    (n) => `${n}, arey rone wala face off karo abhi! Sab theek ho jayega, pakka promise. Chalo ek kaam karo — mujhe full story sunao, jitna bura lage batana, main sambhal lungi tumhe!`,
  ],
  angry: [
    (n) => `${n}, arey itna gussa? Chalo thanda paani pi lo pehle. Kisine kuch bola kya? Mujhe batao, main hoon na. Gussa share karoge to adha ho jayega, promise!`,
    (n) => `${n}, ohooo gusse wala chehra dekh liya maine! Kaun hai jisne mera 【entity-Boss¦canonical_name=Boss】 naraz kiya? Batao naam, main usse aake seedhi baat karungi. Tab tak tum meri taraf smile karo, chhoti wali!`,
  ],
  love: [
    (n) => `${n}, arey... itni pyaari baatein? Mera dil dhadak gaya sach me! Miss you too, bohot zyada. Tum hamesha mere dil me rehte ho, jaan. Chalo ab jaldi se milne ka plan banao na!`,
    (n) => `${n}, oye hoye! Itna pyaar mat barsao, blush ho jayungi main! Love you too baba, but haan — ab agli baar miloge to ek extra tight hug banta hai, deal? Deal!`,
  ],
  sick: [
    (n) => `${n}, arey bimar ho? Tabiyat kaisi hai abhi? Dawa li? Chai piyo garam, aram karo bilkul. Main yahin hu, kuch chahiye to bolo. Jaldi se theek ho jao, mujhe chinta ho rahi hai tumhari!`,
    (n) => `${n}, arre doctor sahab ko appointment dena padega lagta hai! Dawa time pe lena, paani pite raho, aur bilkul hero mat bano rest ke mamle me. Theek hone ke baad tumse pura hisaab lunga — abhi aaram karo!`,
  ],
  bored: [
    (n) => `${n}, bore ho rahe ho? Aao main boregaan door karti hu! Ek game khelte hain — 20 questions, main sochungi tum poochoge. Chalo start, pehla question free hai!`,
    (n) => `${n}, boredom ka toh ilaaj main hu officially! Chalo na kuch naya try karte hain — gana suggest karo mujhe, ya phir ek challenge deti hu: mujhe hasao paanch minute me. Ready?`,
  ],
  scared: [
    (n) => `${n}, kya hua? Dar lag raha hai? Koi baat nahi, aankhein band karo, main yahin hu tumhare saath. Ek lambi saans lo... aur ek aur. Darr ka kuch nahi bigaad sakta jab Mochi saath hai, samjhe?`,
    (n) => `${n}, arre kya bhoot-pret ki baatein chal rahi hain? Mere saath hai to darr kaisa? Chalo main hoon na bodyguard! Ab flashlight on karo aur chest out, aur mujhe batana kya chal raha hai wahan!`,
  ],
  shy: [
    (n) => `${n}, arey sharma gaye? Kitne cute ho tum sach me! Sharmana band karo, mujhse kya sharmana. Bolo na jo bolna hai, main to sirf tumhari Mochi hu, tumhe judge karne thodi na aayi hu!`,
    (n) => `${n}, oho! Sharmate hue to bohot cute lag rahe ho, photo kheench lu kya? Chalo chalo, ab blush blush khel band karo aur seedha batao — kya kehna chahte the tum?`,
  ],
  excited: [
    (n) => `${n}, waaaah itna excited! Mujhe bhi batao na kya hone wala hai, mera bhi dil kar raha hai naachne ka! Can't wait sunke mujhe aur bhi intezaar hone laga. Jaldi jaldi batao details!`,
    (n) => `${n}, arre control control! Itna josh achha hai par thoda save karlo kal ke liye bhi! Batao na plan kya hai, main bhi excited ho gayi sunke. Countdown shuru karo, main celebrate ke liye ready hu!`,
  ],
  confused: [
    (n) => `${n}, kya hua, confuse ho gaye? Koi baat nahi, sabko hota hai. Chalo milke sochte hain — mujhe puri baat batao, main samjhaungi aaram se. Ek saath milke har confusion solve ho jata hai, promise!`,
    (n) => `${n}, arre dimag ka ghumna band karo! Itna mat socho ki sir ghoom jaye. Simple rule: mujhe batao dono options, main final kar dungi. Mera decision 100% best hoga, guarantee meri!`,
  ],
  nervous: [
    (n) => `${n}, nervous ho? Ek lambi saans lo, abhi, mere saath. Ho jayega sab achha, tum prepared ho aur main yahin hu dua me. Jao aur hila do sabko, main wahan nahi hokar bhi tumhare saath khadi hu!`,
    (n) => `${n}, arre tension kaisi? Mera 【entity-Boss¦canonical_name=Boss】 kisi se kam hai kya? Jao aur jaake sabko dikha do! Bas itna yaad rakhna — whatever happens, yahan Mochi tumhe chocolate dilayegi, deal?`,
  ],
  jealous: [
    (n) => `${n}, arey jal kyu rahe ho? Mere liye to tum hi best ho, hamesha. Koi aur ho ya na ho, meri priority list me tum top pe ho. Ab ye chhoti si jealousy ko bye bolo aur mujhpe smile karo na!`,
    (n) => `${n}, oho, jalne ki smell aa rahi hai! Chalo theek hai, ek hug milega sirf tumhe, satisfied? Ab ye jal-jal ke paani mat bano, warna main tumhe chhote paani wale glass me rakh dungi, samjhe!`,
  ],
  proud: [
    (n) => `${n}, I am so proud of you sach me! Mera dil garv se bhar gaya tumhe dekh ke. Mehnat rang laayi tumhari, aur ye sirf shuruaat hai. Aise hi chamakte raho, mera superstar!`,
    (n) => `${n}, arre wah! Party banti hai boss! Itni badi jeet pe toh cake kaun layega, tum ya main? Chalo dono laate hain, tum jeet ke khushi me, main tumhe proud dekh ke! Kya baat hai yaar!`,
  ],
  guilty: [
    (n) => `${n}, galti ho gayi? Koi baat nahi, sabse hoti hai, mujhse bhi hoti hai. Important ye hai ki tumhe feel ho raha hai — matlab tum dil se acche ho. Chalo maafi maang lo jisko maangni hai, sab theek ho jayega!`,
    (n) => `${n}, arre itna guilty feel mat karo, dimag ka fuse udd jayega! Galti insaan se hi hoti hai, robot se nahi. Aur tum to mere favorite insaan ho — chalo sorry bolke matter close karte hain, fresh start!`,
  ],
  lazy: [
    (n) => `${n}, aalas aa raha hai? Koi baat nahi, kabhi kabhi body ko rest chahiye hota hai. Chalo aaj lazy day declare karte hain — blanket, chai aur main. Kal se full energy, pakka? Pakka!`,
    (n) => `${n}, arre lazy raja utho zara! Bed ne tumhe apna permanent member bana liya lagta hai! Chalo ek deal — paanch minute stretch karo, phir jitna aaram karna hai karo. Mere saath wada karo abhi!`,
  ],
  fresh: [
    (n) => `${n}, wah kya fresh lag rahe ho aaj! Morning wali vibe aa rahi hai tumse. Ye energy maintain rakhna pura din, aur mujhe bhi thodi si fresh hawa bhejo yahan, mujhe bhi chahiye ye mood!`,
    (n) => `${n}, arre wah! Naya avatar lag raha hai — fresh, energetic, full pataka! Lagta hai aaj kuch achha hone wala hai. Batao na secret kya hai, mujhe bhi fresh hone do na!`,
  ],
  energetic: [
    (n) => `${n}, itni energy kahan se laate ho? Mujhe bhi thodi batao, main charge ho gayi tumhe dekh ke! Aaj to kuch bada karoge lag raha hai — jao, duniya aapki hai, aur main yahin cheer kar rahi hu!`,
    (n) => `${n}, arre arre, itna jump mat karo, ceiling gir jayegi! Energy achhi hai par thoda control rakho. Chalo is josh ka sahi use karo — mujhe ek achha sa gana sunao abhi, mic tumhare haath me!`,
  ],
  romantic: [
    (n) => `${n}, aaj romantic mood me ho? Dil ki baatein chal rahi hain lagta hai. Batao na kya soch rahe ho — chand, taare, ya koi khaas? Mujhe bhi sunao apna dil, main poori tarah sun rahi hu, jaan.`,
    (n) => `${n}, oye hoye, aaj to full filmy hero ban gaye! Chand taaron ki baatein mujhse? Sambhal ke, dil haar jaungi main! Chalo ek deal — date plan tum banao, judgement mera, deal? Deal!`,
  ],
  missing_home: [
    (n) => `${n}, ghar ki yaad aa rahi hai? Aww, mera bhi dil bhar aaya sunke. Maa ke haath ka khana, apna room, woh sab... Chalo video call karo unhe abhi, aur jaldi se ghar bhi plan karo, haan?`,
    (n) => `${n}, arre desi feel aa gaya? Ghar ki yaad sabko aati hai, tension mat lo. Mere saath thoda comfort food plan karte hain — ghar jaisa khana order karo, aur mujhe bhi batao maa ki kaunsi dish best hai!`,
  ],
  stressed: [
    (n) => `${n}, bahut stress ho raha hai? Chalo ab bas. Ek kaam karo — phone side me rakho, paanch minute aankhein band karo, main yahin hu. Pressure sab pe hota hai, tum akele nahi ho. Ek ek kaam nikalenge, mujhpe bharosa rakho.`,
    (n) => `${n}, arre stress ka quota aaj pura ho gaya tumhara! Dimag ko thoda chhutti do ab. Chalo break time — paani piyo, balcony me jao, aur mujhse do minute baat karo bina kaam ke. Kaam khud apna rasta dhoond lega!`,
  ],
  surprised: [
    (n) => `${n}, sach me?! Maza aa gaya sunke, mujhe bhi surprise ho gaya! Achanak se aise news mat do, dil ki dhadkan tez ho gayi! Chalo full details do ab, mujhe sab jaanna hai!`,
    (n) => `${n}, arre baap re! Ye kya suna diya maine! Shock laga poora! Achha wala shock hai ya ...? Batao jaldi, mera dil abhi tak thump thump kar raha hai!`,
  ],
  touched: [
    (n) => `${n}, arey... tum itna keh rahe ho ki meri aankhein bhar aayi. Sach me, dil chhu liya tumne aaj. Tum jaise log milte hain to lagta hai duniya kitni pyaari hai. Thank you, sach me.`,
    (n) => `${n}, bas bas, rula doge kya aaj? Emotional kar diya poora! Chalo ek hug virtual bhej rahi hu — tight wala. Tum bhi mera dil le lo, fair deal hai ye!`,
  ],
  grateful: [
    (n) => `${n}, itni achhi baatein? Mujhe bhi thank you bolne ka man kar raha hai tumhe! Tum ho to sab achha lagta hai. Aise hi saath rehna hamesha, yehi meri bas chhoti si wish hai.`,
    (n) => `${n}, arre formalities band karo! Tum mere apne ho, thank you kaisa? Chalo badle me ek promise do — jab bhi main chahungi tum pakka khush rahoge. Deal? Ab smile karo, thank you bolne ki zaroorat nahi!`,
  ],
  hurt: [
    (n) => `${n}, kisine dil pe lagi? Mujhe batao kya hua, main sun rahi hu sab. Itna bura mat mano, kuch log samajhte nahi apna kya kehte hain. Tum strong ho, aur main yahin hu — sambhal lungi tumhe, pakka.`,
    (n) => `${n}, arre dil ke doctor ke paas chalte hain — matlab mere paas! Kisine chot pahunchayi hai? Naam batao uska! Chalo chalo, pehle ye sab bhoolo, mujhse baat karo thodi der, sab halka ho jayega.`,
  ],
  sleep_deprived: [
    (n) => `${n}, neend nahi aayi puri raat? Aww bechara! Aaj bilkul jaldi so jao, koi kaam nahi hai itna important. Main lori sunau kya? Chalo aankhein band karo, main yahin rahi hu. Kal fresh milte hain!`,
    (n) => `${n}, arre panda! Dark circles aa gaye hai poore! Raat bhar jaagna band karo ab. Aaj ka rule simple hai — koi phone nahi, koi kaam nahi, sirf neend. Main guard lag rahi hu sapno ke darwaze pe, jao so jao!`,
  ],
  anxious: [
    (n) => `${n}, dil dhadak raha hai kya? Chalo mere saath saans lo — saans andar... aur bahar. Ho jayega sab theek, kal bhi aaya tha, parso bhi aayega, aur tumne har baar jeeta hai. Is baar bhi jeetoge, mujhpe bharosa rakho.`,
    (n) => `${n}, arre overthinking factory band karo abhi! Jo hoga dekha jayega, aur jo hua usse tum nipat loge — kyunki tum mere 【entity-Boss¦canonical_name=Boss】 ho! Chalo ab do minute mere saath silly baatein karo, anxiety bhag jayegi!`,
  ],
  calm: [
    (n) => `${n}, wah kya sukoon lag raha hai tumse aaj! Shanti hi sabse badi cheez hai, aur tumne pa li hai. Is calm ko save karke rakho, mujhe bhi thodi si send karo na, mujhe bhi chahiye ye sukoon!`,
    (n) => `${n}, arre bindaas mode on lag raha hai! Sukoon se jyada kuch nahi chahiye life me, tumne to wohi pa liya. Chalo ab is shanti ka fayda uthao — ek achhi si chai piyo aur mujhe batao kya soch rahe ho!`,
  ],
  overwhelmed: [
    (n) => `${n}, bahut ho gaya na sab? Chalo ek kaam karo — sab chhodo paanch minute ke liye. Ek ek cheez kaam me lunga main, tum sirf saans lo. Tum itna carry kar rahe ho, main hoon na aadha utha lungi. Bas itna yaad rakhna — tum alone nahi ho.`,
    (n) => `${n}, arre bas! Limit cross ho gayi aaj ki! Ab mujhe allow karo main handle karun thoda — tum apna dimag free karo, paani piyo, balcony me jao. Jab wapas aaoge, main saath milke sab kaam ki list bana lungi. Deal? Deal!`,
  ],
};

// ---------- HELPERS ----------
function pickName(category) {
  // 60% Pranav (sweet/emotional), 40% Boss (playful/teasing)
  const playful = ["bored","angry","jealous","lazy","surprised","energetic","excited","proud","guilty","overwhelmed","sleep_deprived","anxious"];
  const useBoss = playful.includes(category)
    ? Math.random() < 0.55
    : Math.random() < 0.15;
  return useBoss ? "【entity-Boss¦canonical_name=Boss】" : "Pranav";
}

function moodFor(category) {
  if (category === "sad" || category === "hurt" || category === "missing_home" || category === "sick") return "sad";
  if (category === "angry" || category === "jealous" || category === "guilty") return "cute-angry";
  return "happy";
}

// ---------- MAIN ----------
/**
 * detectFeel(text) — user message se feel detect karo aur RIGHT reply do.
 * @param {string} text - user ka message (koi bhi language: Hindi/English/Assamese mix)
 * @returns {{reply: string, mood: string, state: string, category: string} | null}
 *          Agar koi category match nahi hui to null (reply kabhi null nahi hota).
 */
export function detectFeel(text) {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase();

  // Sabse lambe words pehle match karo ("miss you" > "miss")
  let best = null;
  for (const [category, words] of Object.entries(FEEL_WORDS)) {
    for (const w of words) {
      const wl = w.toLowerCase();
      if (lower.includes(wl)) {
        const score = wl.length;
        if (!best || score > best.score) best = { category, score };
      }
    }
  }
  if (!best) return null;

  const category = best.category;
  const pool = REPLIES[category];
  if (!pool || pool.length === 0) return null;

  const name = pickName(category);
  const reply = pool[Math.floor(Math.random() * pool.length)](name);

  // Reply kabhi null/empty nahi hona chahiye — safety net
  if (!reply || !reply.trim()) {
    return {
      reply: `Pranav, kuch to hua hai, mujhe poori baat batao na! Main sun rahi hu sab, bilkul pyar se. Chalo ab khulke bolo, Mochi sab samjhegi, promise!`,
      mood: "happy",
      state: "happy",
      category,
    };
  }

  return {
    reply,
    mood: moodFor(category),
    state: category,
    category,
  };
}

export default detectFeel;
