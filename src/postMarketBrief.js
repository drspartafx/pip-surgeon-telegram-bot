import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { getLivePrices } from "../lib/marketData.js";
import { buildBrandedImage } from "../lib/brandedPoster.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const WATCHED_CURRENCIES = ["USD", "JPY"];

async function getTodaysRelevantEvents() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  const today = new Date().toISOString().slice(0, 10);
  return events.filter((e) => {
    const eventDate = (e.date || "").slice(0, 10);
    return eventDate === today && WATCHED_CURRENCIES.includes(e.country);
  });
}

function formatPriceLine(label, value) {
  if (value === null || value === undefined) return `- ${label}: feed offline today`;
  return `- ${label}: ${value}`;
}

async function main() {
  let events = [];
  try {
    events = await getTodaysRelevantEvents();
  } catch (err) {
    console.error("Calendar fetch failed, continuing with no calendar context:", err.message);
  }

  const prices = await getLivePrices();

  const calendarContext = events.length
    ? events.map((e) => `- ${e.date} | ${e.country} | ${e.impact} impact | ${e.title} (forecast: ${e.forecast || "n/a"}, previous: ${e.previous || "n/a"})`).join("\n")
    : "No scheduled USD/JPY economic events found for today in the feed.";

  const priceContext = [
    formatPriceLine("Gold (XAU/USD)", prices.gold),
    formatPriceLine("USD/JPY", prices.usdjpy),
    formatPriceLine("Nasdaq 100 (proxy for NDX100)", prices.nasdaq),
    formatPriceLine("Dow Jones (proxy for US30)", prices.us30),
  ].join("\n");

  const prompt = `${BRAND_VOICE}

Write today's Market Pulse brief using the real data below as your only factual anchor — never invent prices, levels, or events beyond what's listed.

Output in EXACTLY this structure and nothing else. Use Telegram Markdown (single asterisks for bold). Do not add your own title, date, or heading. Leave exactly one blank line between sections. Each section is 1-2 sentences max.

📌 *Session Context*
[overall liquidity/macro backdrop for today]

🥇 *Gold (XAUUSD)*
[grounded in the real gold price/data below]

💴 *USD/JPY*
[grounded in the real USDJPY price/data below]

📊 *US30 & Nasdaq*
[grounded in the real index data below — if marked "feed offline", say so plainly in one short clause]

⚔️ *Today's Read*
[one sharp closing line — a discipline/posture note, not a trade call]

TODAY'S CALENDAR (USD/JPY):
${calendarContext}

CURRENT LEVELS:
${priceContext}`;

  const body = await generateText(prompt);
  const caption = `🥇 *MARKET PULSE — Today's Watch*\n\n${body}${SIGNATURE}`;

  const imageBuffer = await buildBrandedImage({
    title: "MARKET PULSE",
    scene: "a glowing world map with pulsing light nodes over major financial capitals, viewed from a dark trading floor, holographic depth",
    badge: "Pip Surgeon · Market Pulse",
    fallbackIcon: "globeDollar",
  });

  await sendTelegramPhotoBuffer(imageBuffer.toString("base64"), "image/png", caption);
  console.log("Market brief sent.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
