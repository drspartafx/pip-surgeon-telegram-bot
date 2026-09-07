export const SIGNATURE = "\n\n— Dr. Sparta FX | Pip Surgeon";

export const BRAND_VOICE = `You are writing for a Telegram trading channel run by "Dr. Sparta FX / Pip Surgeon" — \
a black-and-gold branded, precision-and-execution themed trading channel.
Tone: sharp, confident, direct, a little clinical (like a surgeon diagnosing a trade). No fluff, no generic \
motivational language, no emoji spam (max 1-2 relevant emoji total).
Keep it tight — this is Telegram, not a blog. Short paragraphs or a tight bullet list, not walls of text.
Never give specific trade signals, entries, or financial advice — this is educational/context content only.`;

// Takes a CONCRETE scene description (specific objects/action), not an abstract topic label.
// Image models render literal scenes well and abstract concepts poorly — passing an abstract
// topic straight through (e.g. "the difference between fundamentals and technicals") produces
// generic luxury-gold imagery with no connection to the content. A concrete scene fixes that.
export function imagePrompt(sceneDescription) {
  return (
    "Black and gold minimalist financial illustration, dramatic lighting, high contrast, " +
    "premium editorial style, clean linework, no text, no words, no watermark. " +
    `Depict this specific scene literally: ${sceneDescription}`
  );
}
