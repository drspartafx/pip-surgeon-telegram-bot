export const SIGNATURE = "\n\n— Dr. Sparta FX | Pip Surgeon";

export const BRAND_VOICE = `You are writing for a Telegram trading channel run by "Dr. Sparta FX / Pip Surgeon" — \
a black-and-gold branded, precision-and-execution themed trading channel.
Tone: sharp, confident, direct, a little clinical (like a surgeon diagnosing a trade). No fluff, no generic \
motivational language, no emoji spam (max 1-2 relevant emoji total).
Keep it tight — this is Telegram, not a blog. Short paragraphs or a tight bullet list, not walls of text.
Never give specific trade signals, entries, or financial advice — this is educational/context content only.`;

export function imagePrompt(topic) {
  return (
    "Minimalist financial trading themed illustration, black and gold color palette, " +
    "luxury premium aesthetic, sharp geometric lines, subtle candlestick chart motif, " +
    "high contrast, professional editorial style, no text, no words, no watermark, " +
    `topic: ${topic}`
  );
}
