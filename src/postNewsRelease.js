import { sendTelegramPhotoBuffer, sendTelegramMessage } from "../lib/telegram.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { SIGNATURE } from "../lib/brand.js";
import { SYSTEM_ICONS } from "../lib/iconAssignments.js";
import { loadNotifiedEvents, saveNotifiedEvents, pruneOld, eventKey, formatLocalTime } from "../lib/eventState.js";

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
    return eventTime <= now && now - eventTime <= lookbackMs;
  });
}

function classifyResult(actual, forecast) {
  const a = parseFloat(actual);
  const f = parseFloat(forecast);
  if (Number.isNaN(a) || Number.isNaN(f)) return { tag: "", icon: SYSTEM_ICONS.releaseInline };
  if (a > f) return { tag: " 📈 beat forecast", icon: SYSTEM_ICONS.releaseBeat };
  if (a < f) return { tag: " 📉 missed forecast", icon: SYSTEM_ICONS.releaseMiss };
  return { tag: " — in line with forecast", icon: SYSTEM_ICONS.releaseInline };
}

function groupByReleaseTime(events) {
  const map = new Map();
  for (const e of events) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date).push(e);
  }
  return [...map.values()];
}

// One combined alert per release time — CPI day is one post, not four.
async function main() {
  const events = await getJustReleasedHighImpactUSD();
  let notified = loadNotifiedEvents();
  let changed = false;

  if (events.length === 0) {
    console.log("No newly released high-impact USD events this run. Skipping — expected most runs.");
    return;
  }

  for (const group of groupByReleaseTime(events)) {
    const fresh = group.filter((e) => !notified.includes(eventKey("release", e)));
    if (fresh.length === 0) {
      console.log("Already posted this release time, skipping duplicate:", group[0].title);
      continue;
    }

    const localTime = formatLocalTime(fresh[0].date);
    const results = fresh.map((e) => ({ e, ...classifyResult(e.actual, e.forecast) }));
    const lead = results[0];

    const blocks = results.map(
      ({ e, tag }) =>
        `*${e.title}*\nActual: *${e.actual}*${tag}\nForecast: ${e.forecast || "n/a"} · Previous: ${e.previous || "n/a"}`
    );
    const caption =
      `🚨 *JUST RELEASED — USD*\n\n${blocks.join("\n\n")}\n\nReleased: ${localTime}${SIGNATURE}`;

    const posterTitle = fresh.length === 1 ? fresh[0].title : `${fresh[0].title} +${fresh.length - 1}`;
    try {
      const svg = buildPosterSVG(posterTitle, lead.icon);
      const pngBuffer = await renderSVGToPNGBuffer(svg);
      await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
    } catch (err) {
      console.error("Image build failed entirely, sending text-only:", err.message);
      await sendTelegramMessage(caption);
    }
    console.log("Release alert sent:", fresh.map((e) => e.title).join(" | "));
    fresh.forEach((e) => notified.push(eventKey("release", e)));
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
