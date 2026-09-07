// Morning calendar preview — always fires once a day, regardless of whether
// there's anything high-impact scheduled. Different job from postNewsRelease.js,
// which fires when an event's actual number gets released.
import { sendTelegramMessage } from "../lib/telegram.js";
import { SIGNATURE } from "../lib/brand.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

async function getTodaysHighImpactUSD() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  const today = new Date().toISOString().slice(0, 10);

  return events.filter((e) => {
    const eventDate = (e.date || "").slice(0, 10);
    const isToday = eventDate === today;
    const isUSD = e.country === "USD";
    const isHighImpactOrHoliday = e.impact === "High" || e.impact === "Holiday";
    return isToday && isUSD && isHighImpactOrHoliday;
  });
}

async function main() {
  const events = await getTodaysHighImpactUSD();

  let body;
  if (events.length === 0) {
    body = "No high-impact USD events or holidays scheduled today. Quiet calendar day — normal conditions expected.";
  } else {
    const lines = events
      .map((e) => {
        const time = (e.date || "").slice(11, 16) || "TBD";
        const tag = e.impact === "Holiday" ? "🔴 HOLIDAY" : "🔴 HIGH IMPACT";
        return `${tag} — ${time} UTC — *${e.title}*${e.forecast ? ` (forecast: ${e.forecast})` : ""}`;
      })
      .join("\n");
    body = `Here's what's on deck for USD today:\n\n${lines}\n\nExpect volatility around these times on Gold, USDJPY, US30, and Nasdaq. Manage size accordingly.`;
  }

  const message = `📅 *TODAY'S USD CALENDAR*\n\n${body}${SIGNATURE}`;

  await sendTelegramMessage(message);
  console.log(`Calendar preview sent. ${events.length} high-impact/holiday event(s) today.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
