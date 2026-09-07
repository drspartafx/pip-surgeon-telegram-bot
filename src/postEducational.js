import { sendTelegramPhoto, sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText, generateImage } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE, imagePrompt } from "../lib/brand.js";

const TOPICS = [
  "the 1971 collapse of Bretton Woods and the birth of free-floating currencies",
  "why gold's ticker is XAU and where that currency-code convention comes from",
  "the origin of the term 'pip' in forex trading",
  "the 1987 Black Monday crash and what actually triggered it",
  "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar",
  "the 2015 Swiss Franc shock and what it taught traders about black-swan risk",
  "why Non-Farm Payrolls (NFP) became the single most-watched economic release",
  "the history of the Nasdaq 100 and the dot-com bubble",
  "how central bank interest rate decisions actually move currency pairs",
  "the difference between fundamental and technical analysis, and why serious traders use both",
  "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run",
  "how leverage amplifies both gains and account-ending losses",
  "the 2008 financial crisis and how it reshaped gold as a safe-haven asset",
  "what a 'flash crash' is and a real historical example",
  "why the US dollar is the world's reserve currency and what that means for every pair you trade",
];

function pickTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  const topic = pickTopic();

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;
  const imgPrompt = imagePrompt(topic);

  try {
    // Primary: Gemini's own image model — free tier, better quality, same API key as text.
    const { base64, mimeType } = await generateImage(imgPrompt);
    await sendTelegramPhotoBuffer(base64, mimeType, caption);
    console.log("Educational post sent (Gemini image). Topic:", topic);
  } catch (err) {
    // Fallback: Pollinations — free, no key, no uptime SLA, but keeps the channel from going silent.
    console.error("Gemini image generation failed, falling back to Pollinations:", err.message);
    const encodedPrompt = encodeURIComponent(imgPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
    await sendTelegramPhoto(imageUrl, caption);
    console.log("Educational post sent (Pollinations fallback). Topic:", topic);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
