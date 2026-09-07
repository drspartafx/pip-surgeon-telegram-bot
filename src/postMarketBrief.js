import { sendTelegramMessage } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { getLivePrices } from "../lib/marketData.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const WATCHED_CURRENCIES = ["USD", "JPY"]; // covers XAUUSD, USDJPY, US30, NDX100 (all USD-driven)

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
  if (value === null || value === undefined) return `- ${label}: unavailable this run`;
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
    ? events
        .map((e) => `- ${e.date} | ${e.country} | ${e.impact} impact | ${e.title} (forecast: ${e.forecast || "n/a"}, previous: ${e.previous || "n/a"})`)
        .join("\n")
    : "No scheduled USD/JPY economic events found for today in the feed.";

  const priceContext = [
    formatPriceLine("Gold (XAU/USD)", prices.gold),
    formatPriceLine("USD/JPY", prices.usdjpy),
    formatPriceLine("Nasdaq 100 (proxy for NDX100)", prices.nasdaq),
    formatPriceLine("Dow Jones (proxy for US30)", prices.us30),
  ].join("\n");

  const prompt = `${BRAND_VOICE}

Write today's "Market Pulse" brief for gold (XAUUSD), USDJPY, US30, and Nasdaq (NDX100) traders.
Use ONLY the real data below as your factual anchor — do not invent prices, levels, or news beyond what's listed.
Note: the index prices are Nasdaq 100 / Dow Jones cash index levels, a close free proxy for the NDX100/US30 CFDs — not identical, mention this only if directly relevant.
Explain briefly what today's calendar and price levels mean for these instruments, and what kind of volatility/behavior to expect.
If prices are marked unavailable, don't mention the outage mechanics — just work with what you have.

TODAY'S CALENDAR (USD/JPY):
${calendarContext}

CURRENT LEVELS:
${priceContext}

4-6 sentences or a tight bullet list. No specific trade signals or price predictions.`;

  const body = await generateText(prompt);
  const message = `🥇 *MARKET PULSE — Today's Watch*\n\n${body}${SIGNATURE}`;

  await sendTelegramMessage(message);
  console.log("Market brief sent.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
