// Edge / Google Free Hindi Voice - NO npm package needed!
// hi-IN-Swara style - Google TTS hi voice, cute + free
export async function speakEdge(text) {
  const q = encodeURIComponent(text);
  // Google TTS - free, hi voice
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=hi&q=${q}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://translate.google.com/" }
  });
  if (!res.ok) throw new Error("Google TTS failed " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error("TTS empty");
  return buf;
}
