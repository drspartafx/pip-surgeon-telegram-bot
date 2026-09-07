import { sendTelegramPoll } from "../lib/telegram.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

// Only these two — matches the user's explicit ask, not every high-impact event.
const TARGET_KEYWORDS = ["non-farm", "nonfarm", "payroll", "cpi", "consumer price index"];

// Fires once per event: window (20-35 min ahead) is wider than the 15-min poll
// interval, so under normal conditions each event is caught on exactly one tick.
const WINDOW_START_MIN = 20;
const WINDOW_END_MIN = 35;

function isPopulated(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function isTargetEvent(title) {
  const lower = title.toLowerCase();
  return TARGET_KEYWORDS.some((kw) => lower.includes(kw));
}

async function getUpcomingTargetEvents() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  const now = Date.now();

  return events.filter((e) => {
    if (e.country !== "USD" || e.impact !== "High") return false;
    if (isPopulated(e.actual)) return false; // already released — not upcoming
    if (!isTargetEvent(e.title || "")) return false;

    const eventTime = new Date(e.date).getTime();
    if (Number.isNaN(eventTime)) return false;

    const minutesAway = (eventTime - now) / 60000;
    return minutesAway >= WINDOW_START_MIN && minutesAway <= WINDOW_END_MIN;
  });
}

async function main() {
  const events = await getUpcomingTargetEvents();

  if (events.length === 0) {
    console.log("No upcoming NFP/CPI release in the poll window this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const time = (e.date || "").slice(11, 16) || "soon";
    await sendTelegramPoll(
      `${e.title} drops at ${time} UTC — your call?`,
      ["Beats forecast 📈", "Misses forecast 📉", "In line with forecast ➡️"],
      { isAnonymous: false }
    );
    console.log("Pre-event poll sent:", e.title);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
