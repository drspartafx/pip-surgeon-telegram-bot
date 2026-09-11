import { sendTelegramPoll } from "../lib/telegram.js";
import { loadNotifiedEvents, saveNotifiedEvents, pruneOld, eventKey, formatLocalTime } from "../lib/eventState.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const TARGET_KEYWORDS = ["non-farm", "nonfarm", "payroll", "cpi", "consumer price index"];
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
    if (isPopulated(e.actual)) return false;
    if (!isTargetEvent(e.title || "")) return false;

    const eventTime = new Date(e.date).getTime();
    if (Number.isNaN(eventTime)) return false;

    const minutesAway = (eventTime - now) / 60000;
    return minutesAway >= WINDOW_START_MIN && minutesAway <= WINDOW_END_MIN;
  });
}

async function main() {
  const events = await getUpcomingTargetEvents();
  let notified = loadNotifiedEvents();
  let changed = false;

  if (events.length === 0) {
    console.log("No upcoming NFP/CPI release in the poll window this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const key = eventKey("preevent", e);
    if (notified.includes(key)) {
      console.log("Already polled for this event, skipping duplicate:", e.title);
      continue;
    }

    const localTime = formatLocalTime(e.date);
    await sendTelegramPoll(
      `${e.title} drops at ${localTime} — your call?`,
      ["Beats forecast 📈", "Misses forecast 📉", "In line with forecast ➡️"]
      // Channels only support anonymous polls — non-anonymous is a group-only feature.
    );
    console.log("Pre-event poll sent:", e.title);
    notified.push(key);
    changed = true;
  }

  if (changed) {
    saveNotifiedEvents(pruneOld(notified));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
