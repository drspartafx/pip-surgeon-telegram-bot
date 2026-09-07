// Fires as close to "immediately after release" as a free, cron-based system can get:
// polls every 15 minutes, and posts only for high-impact USD events whose actual number
// just appeared in the feed within the lookback window.
//
// No persistent state needed: the lookback window (20 min) is wider than the poll
// interval (15 min), so each event's release window is caught exactly once under normal
// conditions. Trade-off: if GitHub Actions delays a run significantly, there's a small
// chance of a duplicate post. Acceptable for a free setup — not acceptable for anything
// that needs guaranteed exactly-once delivery.
import { sendTelegramMessage } from "../lib/telegram.js";
import { SIGNATURE } from "../lib/brand.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const LOOKBACK_MINUTES = 20;

function isPopulated(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

async function getJustReleasedHighImpactUSD() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();

  const now = Date.now();
  const lookbackMs = LOOKBACK_MINUTES * 60 * 1000;

  return events.filter((e) => {
    const isUSD = e.country === "USD";
    const isHighImpact = e.impact === "High";
    const hasActual = isPopulated(e.actual);
    if (!isUSD || !isHighImpact || !hasActual) return false;

    const eventTime = new Date(e.date).getTime();
    if (Number.isNaN(eventTime)) return false;

    const justReleased = eventTime <= now && now - eventTime <= lookbackMs;
    return justReleased;
  });
}

function surpriseTag(actual, forecast) {
  const a = parseFloat(actual);
  const f = parseFloat(forecast);
  if (Number.isNaN(a) || Number.isNaN(f)) return "";
  if (a > f) return " 📈 beat forecast";
  if (a < f) return " 📉 missed forecast";
  return " — in line with forecast";
}

async function main() {
  const events = await getJustReleasedHighImpactUSD();

  if (events.length === 0) {
    console.log("No newly released high-impact USD events this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const time = (e.date || "").slice(11, 16) || "TBD";
    const tag = surpriseTag(e.actual, e.forecast);
    const body =
      `*${e.title}*\n\n` +
      `Actual: *${e.actual}*${tag}\n` +
      `Forecast: ${e.forecast || "n/a"}\n` +
      `Previous: ${e.previous || "n/a"}\n` +
      `Released: ${time} UTC`;

    const message = `🚨 *JUST RELEASED — USD*\n\n${body}${SIGNATURE}`;
    await sendTelegramMessage(message);
    console.log("Release alert sent:", e.title);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
