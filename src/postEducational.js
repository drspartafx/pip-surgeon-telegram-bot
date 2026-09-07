import { sendTelegramPhoto } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE, imagePrompt } from "../lib/brand.js";

// Each entry has a "topic" (what Gemini writes about) and a "visual" (a concrete scene
// for the image — specific objects/action, not a restated abstract concept). Concrete
// scenes are what image models actually render well.
const TOPICS = [
  {
    topic: "the 1971 collapse of Bretton Woods and the birth of free-floating currencies",
    visual: "a gold bar cracking in half as dollar bills break free from wrapped chains around it",
  },
  {
    topic: "why gold's ticker is XAU and where that currency-code convention comes from",
    visual: "a gold bar with the letters 'Au' engraved deep into its surface, ancient stone tablet beside it",
  },
  {
    topic: "the origin of the term 'pip' in forex trading",
    visual: "an extreme close-up of a single glowing decimal point on a price chart, magnified like a fingerprint under a loupe",
  },
  {
    topic: "the 1987 Black Monday crash and what actually triggered it",
    visual: "a single massive red candlestick smashing through a trading floor like breaking glass",
  },
  {
    topic: "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar",
    visual: "five hands from different directions gripping and pulling down on one large falling dollar bill",
  },
  {
    topic: "the 2015 Swiss Franc shock and what it taught traders about black-swan risk",
    visual: "a Swiss cross shattering through a currency chart pinned to a wall, cracks radiating outward",
  },
  {
    topic: "why Non-Farm Payrolls (NFP) became the single most-watched economic release",
    visual: "a giant magnifying glass hovering over a calendar with one date circled in red, tiny figures gathered below watching",
  },
  {
    topic: "the history of the Nasdaq 100 and the dot-com bubble",
    visual: "a candlestick chart shaped like a rocket trail, soaring upward then breaking apart mid-air into falling embers",
  },
  {
    topic: "how central bank interest rate decisions actually move currency pairs",
    visual: "a large stone gavel striking a glowing currency symbol, shockwave rippling outward across a dark surface",
  },
  {
    topic: "the difference between fundamental and technical analysis, and why serious traders use both",
    visual: "a split scene: on the left a stethoscope resting on financial newspaper pages, on the right a scalpel tracing along a candlestick chart line, meeting in the middle",
  },
  {
    topic: "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run",
    visual: "a hand releasing a green balloon far too early into the sky, while the same hand's other arm stays chained to a sinking red anchor",
  },
  {
    topic: "how leverage amplifies both gains and account-ending losses",
    visual: "a small seesaw with a single coin balanced against a massive boulder on the other end, the boulder side about to crash down",
  },
  {
    topic: "the 2008 financial crisis and how it reshaped gold as a safe-haven asset",
    visual: "a single gold bar standing untouched and glowing at the center of a crumbling glass office tower",
  },
  {
    topic: "what a 'flash crash' is and a real historical example",
    visual: "a candlestick chart line plunging straight down then snapping back up instantly, like a heartbeat monitor spike",
  },
  {
    topic: "why the US dollar is the world's reserve currency and what that means for every pair you trade",
    visual: "a dollar bill folded and creased into the shape of a globe, resting in an open upturned palm",
  },
];

function pickTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  const { topic, visual } = pickTopic();

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;

  // Pollinations.ai — free, no key, no billing risk.
  const encodedPrompt = encodeURIComponent(imagePrompt(visual));
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

  await sendTelegramPhoto(imageUrl, caption);
  console.log("Educational post sent. Topic:", topic);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
