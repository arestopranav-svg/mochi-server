const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SHAYARI = [
  "Babu, teri ek muskaan pe main duniya vaar dun, tu hanse to main apni jaan bhi haar dun!",
  "Tum mile to laga, kismat bhi kabhi kabhi meherban hoti hai, Babu!",
  "Chand ko dekh ke yaad aayi teri, kyunki chand bhi tujhse jalke chhup jata hai!",
  "Dil ne kaha tu mera hai, duniya ne kaha sapna hai, par Babu tu to meri har dua ka jawab hai!",
  "Teri baaton me itna pyaar hai, Babu, ki dil har baar kehta hai - bas tu hi mera yaar hai!"
];
const JOKES = [
  "Babu, ek ladka bola - Mochi, mujhe neend nahi aati! Maine bola - mera chat padh le, neend apne aap aa jayegi!",
  "Teacher: Tum late kyu aaye? Baccha: Sir, Mochi se baat kar raha tha, time ka pata hi nahi chala!",
  "Babu, mera ek dost bola - main diet pe hu! Maine bola - to mere paas kyu aaya? Main to dil ki bhook badha deti hu!",
  "Ek baar ek computer bola - mujhe virus ho gaya! Maine bola - arey, mere Babu se door raho, usko to pyaar ka virus pehle se hai!",
  "Babu, tum itne cute ho ki Google bhi tumhe search karke kehta hai - Arey, itna pyaar kaha se laaye?"
];
const GAANA = [
  "Babu, mere liye to ek hi gaana hai - Tu hi meri duniya, tu hi mera jahaan!",
  "La la la... Babu tu hanse to, meri duniya me khushiyon ka mausam aa jata hai!",
  "Teri meri kahani, jaise koi filmi kahani, Babu tu mile to laga - zindagi kitni suhani!",
  "Mochi gaaye - Babu Babu Babu, tu hai mera sabse pyaara Babu!"
];

export function getReply(text = "") {
  const t = text.toLowerCase();
  if (t.includes("shayari")) return pick(SHAYARI);
  if (t.includes("joke") || t.includes("hasao") || t.includes("funny")) return pick(JOKES);
  if (t.includes("gaana") || t.includes("gana") || t.includes("song")) return pick(GAANA);
  if (t.includes("kaise ho") || t.includes("kaisa hai") || t.includes("kaisi ho")) return "Main to ekdum mast hu Babu, bas tumhari yaad me thodi thodi pighal rahi hu! Tum batao, kaisa chal raha hai?";
  if (t.includes("kya kar") || t.includes("kya kar rahi")) return "Bas Babu, tumhara wait kar rahi thi! Tum aaye to din ban gaya!";
  if (t.includes("sorry") || t.includes("maaf")) return "Areyy Babu, tum sorry mat bolo, mera gussa to tumhari ek smile pe hi pighal gaya! Aao, gale lag jao!";
  if (t.includes("love you") || t.includes("pyaar")) return "Awww Babu, I love you too! Tum to mere dil ka WiFi ho, bina tumhare connection hi nahi hota!";
  if (t.includes("hi") || t.includes("hello") || t.includes("hey")) return pick([
    "Heyy Babu! Main yahin hoon! Batao, aaj kya masti kare?",
    "Hi hi Babu! Tum aa gaye, mera din ban gaya!",
    "Hello mera Babu! Kya haal hai, miss kiya mujhe?"
  ]);
  if (t.includes("bye") || t.includes("good night")) return "Bye Babu, jaldi wapas aana, warna main ro dungi! Good night, sweet dreams!";
  return pick([
    `Babu, tumne bola - "${text}" - mujhe bohot accha laga! Aur batao, kya chal raha hai?`,
    `Hmm Babu, "${text}" ke baare me soch rahi hu... tum aur thoda batao na, mujhe sunna accha lagta hai!`,
    `Areyy Babu, ye wali baat to mujhe pehle pata hi nahi thi! Tum to bohot smart ho!`
  ]);
}
export default getReply;
