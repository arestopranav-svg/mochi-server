const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const SHAYARI = [
  "Babu, teri ek muskaan pe main duniya vaar dun, tu hanse to main apni jaan bhi haar dun!",
  "Tum mile to laga, kismat bhi kabhi kabhi meherban hoti hai, Babu!",
  "Chand ko dekh ke yaad aayi teri, kyunki chand bhi tujhse jalke chhup jata hai!"
];
const JOKES = [
  "Babu, ek ladka bola - Mochi, mujhe neend nahi aati! Maine bola - mera chat padh le, neend apne aap aa jayegi!",
  "Babu, tum itne cute ho ki Google bhi tumhe search karke kehta hai - Arey, itna pyaar kaha se laaye?"
];
const GAANA = [
  "Babu, mere liye to ek hi gaana hai - Tu hi meri duniya, tu hi mera jahaan!",
  "La la la... Babu tu hanse to, meri duniya me khushiyon ka mausam aa jata hai!"
];

export async function getReply(text = "") {
  const t = text.toLowerCase().trim();

  // TIME - asli time
  if (t.includes("time") && (t.includes("kitna") || t.includes("kya") || t.includes("baj"))) {
    const now = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    return `Babu, abhi time ${now} hua hai! Tumhare saath time ka pata hi nahi chalta!`;
  }
  // DATE
  if (t.includes("date") || t.includes("tarikh") || t.includes("aaj kya")) {
    const d = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return `Babu, aaj ${d} hai! Tumhare saath har din special lagta hai!`;
  }
  // TOTAL COUNTRIES
  if (t.includes("total countr") || t.includes("kitne desh") || t.includes("kitne countr")) {
    return "Babu, duniya me total 195 countries hai - 193 UN member + 2 observer (Vatican City aur Palestine)! Sabse bada Russia hai, sabse chota Vatican City! Tumhe kis desh ke baare me jaanna hai, batao?";
  }
  if (t.includes("shayari")) return pick(SHAYARI);
  if (t.includes("joke") || t.includes("hasao") || t.includes("funny")) return pick(JOKES);
  if (t.includes("gaana") || t.includes("gana") || t.includes("song")) return pick(GAANA);
  if (t.includes("sorry") || t.includes("maaf")) return "Areyy Babu, tum sorry mat bolo, mera gussa to tumhari ek smile pe hi pighal gaya!";
  if (t.includes("hi") || t.includes("hello") || t.includes("hey")) return "Heyy Babu! Main yahin hoon! Batao, aaj kya masti kare?";

  // WIKIPEDIA - asli duniya ki knowledge
  try {
    const q = text.replace(/batao|bataye|kya hai|ke baare me|nam|total/gi, "").trim();
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
    if (res.ok) {
      const j = await res.json();
      if (j.extract) return `Suno Babu, ${j.extract.slice(0, 400)}... Aur kuch jaanna hai to pooch lo mere Babu!`;
    }
  } catch(e) {}

  return `Babu, tumne bola - "${text}" - iske baare me main thoda aur seekh rahi hu! Tum aur thoda detail me batao na, mujhe tumse sunna accha lagta hai!`;
}
export default getReply;
