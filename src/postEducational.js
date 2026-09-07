import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { buildBrandedImage } from "../lib/brandedPoster.js";

// "topic" = full description fed to Gemini for the write-up.
// "title" = short punchy poster heading.
// "scene" = concrete AI-image scene — always symbolic/event-based, NEVER a real person's likeness.
// "fallbackIcon" = used only if the AI background fetch fails (see lib/icons.js).
const TOPICS = [
  { topic: "the 1971 collapse of Bretton Woods and the birth of free-floating currencies", title: "BRETTON WOODS 1971", scene: "a gold bar cracking in half as dollar bills break free from wrapped chains around it", fallbackIcon: "goldBar" },
  { topic: "why gold's ticker is XAU and where that currency-code convention comes from", title: "WHY GOLD IS 'XAU'", scene: "a gold bar with the letters Au engraved deep into its surface, an ancient stone tablet resting beside it", fallbackIcon: "goldBar" },
  { topic: "the origin of the term 'pip' in forex trading", title: "THE ORIGIN OF A PIP", scene: "an extreme close-up of a single glowing decimal point on a price chart, magnified beneath an ornate brass loupe", fallbackIcon: "magnifierCalendar" },
  { topic: "the 1987 Black Monday crash and what actually triggered it", title: "BLACK MONDAY 1987", scene: "a single massive red candlestick smashing downward through a trading floor like shattering glass", fallbackIcon: "spikeChart" },
  { topic: "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar", title: "THE PLAZA ACCORD", scene: "five hands reaching from different directions, gripping and pulling down together on one large falling dollar bill", fallbackIcon: "candlestickChannel" },
  { topic: "the 2015 Swiss Franc shock and what it taught traders about black-swan risk", title: "THE SWISS FRANC SHOCK", scene: "a Swiss cross shattering through a currency chart pinned to a wall, cracks radiating outward", fallbackIcon: "spikeChart" },
  { topic: "why Non-Farm Payrolls (NFP) became the single most-watched economic release", title: "WHY NFP MOVES MARKETS", scene: "a giant magnifying glass hovering over a calendar page with one date circled in red, small silhouetted figures gathered below", fallbackIcon: "magnifierCalendar" },
  { topic: "the history of the Nasdaq 100 and the dot-com bubble", title: "NASDAQ & THE DOT-COM BUBBLE", scene: "a candlestick chart shaped like a rocket trail, soaring upward then breaking apart mid-air into falling embers", fallbackIcon: "candlestickChannel" },
  { topic: "how central bank interest rate decisions actually move currency pairs", title: "RATES & CURRENCY MOVES", scene: "a large stone gavel striking a glowing currency symbol, a shockwave rippling outward across a dark surface", fallbackIcon: "gavelScale" },
  { topic: "the difference between fundamental and technical analysis, and why serious traders use both", title: "FUNDAMENTALS VS TECHNICALS", scene: "a stethoscope resting on financial newspaper pages beside a surgical scalpel tracing along a glowing candlestick chart line", fallbackIcon: "stethoscopeChart" },
  { topic: "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run", title: "THE DISPOSITION EFFECT", scene: "a hand releasing a green balloon far too early into the sky, while the same arm stays chained to a sinking red anchor", fallbackIcon: "gavelScale" },
  { topic: "how leverage amplifies both gains and account-ending losses", title: "LEVERAGE: BOTH EDGES", scene: "a small seesaw with a single coin balanced against a massive boulder on the other end, about to crash down", fallbackIcon: "spikeChart" },
  { topic: "the 2008 financial crisis and how it reshaped gold as a safe-haven asset", title: "GOLD IN THE 2008 CRISIS", scene: "a single gold bar standing untouched and glowing at the center of a crumbling glass office tower", fallbackIcon: "goldBar" },
  { topic: "what a 'flash crash' is and a real historical example", title: "WHAT IS A FLASH CRASH?", scene: "a candlestick chart line plunging straight down then snapping back up instantly, like a heartbeat monitor spike", fallbackIcon: "spikeChart" },
  { topic: "why the US dollar is the world's reserve currency and what that means for every pair you trade", title: "THE DOLLAR'S RESERVE STATUS", scene: "a dollar bill folded and creased into the shape of a globe, resting in an open upturned palm", fallbackIcon: "globeDollar" },
  { topic: "the 1992 'Black Wednesday' event, when a single trader's massive short position forced the UK out of the European exchange rate mechanism, and what it revealed about the limits of central bank intervention", title: "BLACK WEDNESDAY 1992", scene: "a grand stone bank facade cracking as a single golden arrow breaks straight through it, pound sterling notes scattering in the wind", fallbackIcon: "spikeChart" },
];

function pickTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  const { topic, title, scene, fallbackIcon } = pickTopic();

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
If this topic references a real named individual, describe their actions/strategy factually but do not fabricate quotes.
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;

  const imageBuffer = await buildBrandedImage({
    title,
    scene,
    badge: "Pip Surgeon · Did You Know",
    fallbackIcon,
  });

  await sendTelegramPhotoBuffer(imageBuffer.toString("base64"), "image/png", caption);
  console.log("Educational post sent. Topic:", topic);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
