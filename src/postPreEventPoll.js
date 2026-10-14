import { sendTelegramPoll } from "../lib/telegram.js";
import { loadNotifiedEvents, saveNotifiedEvents, pruneOld, eventKey, formatLocalTime } from "../lib/eventState.js";
import { loadPendingPolls, savePendingPolls, prunePendingPolls } from "../lib/pollState.js";

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

// Several calendar lines often share one release time (e.g. CPI m/m, CPI y/y, Core CPI m/m,
// Core CPI y/y all land at 08:30 ET). The crowd is predicting ONE release, so we send ONE poll
// per release time, built on the headline line (the verdict resolves against that line).
function pickHeadline(group) {
  const score = (t) => {
    const l = t.toLowerCase();
    let s = 0;
    if (l.includes("core")) s -= 2;
    if (l.includes("y/y")) s -= 1;
    if (l.includes("non-farm") || l.includes("nonfarm")) s += 2;
    if (l.includes("m/m")) s += 1;
    return s;
  };
  return [...group].sort((a, b) => score(b.title || "") - score(a.title || ""))[0];
}

function groupByReleaseTime(events) {
  const map = new Map();
  for (const e of events) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date).push(e);
  }
  return [...map.values()];
}

async function main() {
  const events = await getUpcomingTargetEvents();
  let notified = loadNotifiedEvents();
  let pending = loadPendingPolls();
  let changed = false;

  if (events.length === 0) {
    console.log("No upcoming NFP/CPI release in the poll window this run. Skipping — expected most runs.");
    return;
  }

  for (const group of groupByReleaseTime(events)) {
    const e = pickHeadline(group);
    const keys = group.map((g) => eventKey("preevent", g));
    if (keys.some((k) => notified.includes(k))) {
      console.log("Already polled for this release time, skipping duplicate:", e.title);
      continue;
    }
    const key = eventKey("preevent", e);

    const localTime = formatLocalTime(e.date);
    const sent = await sendTelegramPoll(
      `${e.title} drops at ${localTime} — your call?`,
      ["Beats forecast 📈", "Misses forecast 📉", "In line with forecast ➡️"]
      // Channels only support anonymous polls — non-anonymous is a group-only feature.
    );
    console.log("Pre-event poll sent:", e.title);

    const messageId = sent?.result?.message_id;
    if (messageId) {
      pending.push({
        key,
        messageId,
        eventTitle: e.title,
        eventDate: e.date,
        forecast: e.forecast ?? null,
      });
    } else {
      console.error("Could not read message_id from sendPoll response — verdict will be skipped for this event.");
    }

    notified.push(...keys);
    changed = true;
  }

  if (changed) {
    saveNotifiedEvents(pruneOld(notified));
    savePendingPolls(prunePendingPolls(pending));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
