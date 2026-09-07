import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText, generateImageScene } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { buildBrandedImage } from "../lib/brandedPoster.js";

// "topic" = full description fed to Gemini for the write-up.
// "title" = short punchy poster heading.
// "fallbackIcon" = used only if the AI background pipeline fails entirely (see lib/icons.js).
// No hardcoded "scene" anymore — Gemini generates that fresh each time from the topic +
// article text, applying the same rules learned from real failures (see lib/gemini.js).
const TOPICS = [
  { topic: "the 1971 collapse of Bretton Woods and the birth of free-floating currencies", title: "BRETTON WOODS 1971", fallbackIcon: "goldBar" },
  { topic: "why gold's ticker is XAU and where that currency-code convention comes from", title: "WHY GOLD IS 'XAU'", fallbackIcon: "goldBar" },
  { topic: "the origin of the term 'pip' in forex trading", title: "THE ORIGIN OF A PIP", fallbackIcon: "magnifierCalendar" },
  { topic: "the 1987 Black Monday crash and what actually triggered it", title: "BLACK MONDAY 1987", fallbackIcon: "spikeChart" },
  { topic: "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar", title: "THE PLAZA ACCORD", fallbackIcon: "candlestickChannel" },
  { topic: "the 2015 Swiss Franc shock and what it taught traders about black-swan risk", title: "THE SWISS FRANC SHOCK", fallbackIcon: "spikeChart" },
  { topic: "why Non-Farm Payrolls (NFP) became the single most-watched economic release", title: "WHY NFP MOVES MARKETS", fallbackIcon: "magnifierCalendar" },
  { topic: "the history of the Nasdaq 100 and the dot-com bubble", title: "NASDAQ & THE DOT-COM BUBBLE", fallbackIcon: "candlestickChannel" },
  { topic: "how central bank interest rate decisions actually move currency pairs", title: "RATES & CURRENCY MOVES", fallbackIcon: "gavelScale" },
  { topic: "the difference between fundamental and technical analysis, and why serious traders use both", title: "FUNDAMENTALS VS TECHNICALS", fallbackIcon: "stethoscopeChart" },
  { topic: "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run", title: "THE DISPOSITION EFFECT", fallbackIcon: "gavelScale" },
  { topic: "how leverage amplifies both gains and account-ending losses", title: "LEVERAGE: BOTH EDGES", fallbackIcon: "spikeChart" },
  { topic: "the 2008 financial crisis and how it reshaped gold as a safe-haven asset", title: "GOLD IN THE 2008 CRISIS", fallbackIcon: "goldBar" },
  { topic: "what a 'flash crash' is and a real historical example", title: "WHAT IS A FLASH CRASH?", fallbackIcon: "spikeChart" },
  { topic: "why the US dollar is the world's reserve currency and what that means for every pair you trade", title: "THE DOLLAR'S RESERVE STATUS", fallbackIcon: "globeDollar" },
  { topic: "the 1992 'Black Wednesday' event, when a single trader's massive short position forced the UK out of the European exchange rate mechanism, and what it revealed about the limits of central bank intervention", title: "BLACK WEDNESDAY 1992", fallbackIcon: "spikeChart" },
];

function pickTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  const { topic, title, fallbackIcon } = pickTopic();

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
If this topic references a real named individual, describe their actions/strategy factually but do not fabricate quotes.
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;

  // Gemini generates the scene fresh from the actual topic + article, instead of a
  // hardcoded description — this is what lets it "think for itself" per post.
  const scene = await generateImageScene(topic, body);

  const imageBuffer = await buildBrandedImage({
    title,
    scene,
    badge: "Pip Surgeon · Did You Know",
    fallbackIcon,
  });

  await sendTelegramPhotoBuffer(imageBuffer.toString("base64"), "image/png", caption);
  console.log("Educational post sent. Topic:", topic, "| Scene used:", scene);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
