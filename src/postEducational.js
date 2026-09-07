import { sendTelegramPhotoBuffer, sendTelegramPoll } from "../lib/telegram.js";
import { generateText, generateQuizQuestion } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";

// Reliable, no-AI image system: every topic gets its own hand-built icon.
// 16 topics, 16 distinct icons — zero repetition, zero chance of a nonsensical render,
// since these are drawn shapes, not AI-generated.
const TOPICS = [
  { topic: "the 1971 collapse of Bretton Woods and the birth of free-floating currencies", title: "BRETTON WOODS 1971", icon: "brokenChainGold" },
  { topic: "why gold's ticker is XAU and where that currency-code convention comes from", title: "WHY GOLD IS 'XAU'", icon: "goldBar" },
  { topic: "the origin of the term 'pip' in forex trading", title: "THE ORIGIN OF A PIP", icon: "pipMarker" },
  { topic: "the 1987 Black Monday crash and what actually triggered it", title: "BLACK MONDAY 1987", icon: "shatteringFloor" },
  { topic: "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar", title: "THE PLAZA ACCORD", icon: "candlestickChannel" },
  { topic: "the 2015 Swiss Franc shock and what it taught traders about black-swan risk", title: "THE SWISS FRANC SHOCK", icon: "crackedCross" },
  { topic: "why Non-Farm Payrolls (NFP) became the single most-watched economic release", title: "WHY NFP MOVES MARKETS", icon: "magnifierCalendar" },
  { topic: "the history of the Nasdaq 100 and the dot-com bubble", title: "NASDAQ & THE DOT-COM BUBBLE", icon: "rocketChart" },
  { topic: "how central bank interest rate decisions actually move currency pairs", title: "RATES & CURRENCY MOVES", icon: "gavelScale" },
  { topic: "the difference between fundamental and technical analysis, and why serious traders use both", title: "FUNDAMENTALS VS TECHNICALS", icon: "stethoscopeChart" },
  { topic: "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run", title: "THE DISPOSITION EFFECT", icon: "tiltedScaleBalloon" },
  { topic: "how leverage amplifies both gains and account-ending losses", title: "LEVERAGE: BOTH EDGES", icon: "seesawBoulder" },
  { topic: "the 2008 financial crisis and how it reshaped gold as a safe-haven asset", title: "GOLD IN THE 2008 CRISIS", icon: "debrisGoldBar" },
  { topic: "what a 'flash crash' is and a real historical example", title: "WHAT IS A FLASH CRASH?", icon: "spikeChart" },
  { topic: "why the US dollar is the world's reserve currency and what that means for every pair you trade", title: "THE DOLLAR'S RESERVE STATUS", icon: "globeDollar" },
  { topic: "the 1992 'Black Wednesday' event, when a single trader's massive short position forced the UK out of the European exchange rate mechanism, and what it revealed about the limits of central bank intervention", title: "BLACK WEDNESDAY 1992", icon: "crackingArrowFacade" },
];

function pickTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  const { topic, title, icon } = pickTopic();

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
If this topic references a real named individual, describe their actions/strategy factually but do not fabricate quotes.
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;

  const svg = buildPosterSVG(title, icon);
  const pngBuffer = await renderSVGToPNGBuffer(svg);

  await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
  console.log("Educational post sent. Topic:", topic);

  // Quiz-poll testing the fact just posted. Never breaks the main post if it fails —
  // generateQuizQuestion returns null on any parsing issue instead of throwing.
  const quiz = await generateQuizQuestion(topic, body);
  if (quiz) {
    await sendTelegramPoll(quiz.question, quiz.options, {
      type: "quiz",
      correctOptionId: quiz.correctIndex,
      explanation: quiz.explanation,
      isAnonymous: true,
    });
    console.log("Quiz poll sent.");
  } else {
    console.log("Quiz generation failed — post still succeeded without it.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
