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

async function main() {
  const events = await getJustReleasedHighImpactUSD();
  let notified = loadNotifiedEvents();
  let changed = false;

  if (events.length === 0) {
    console.log("No newly released high-impact USD events this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const key = eventKey("release", e);
    if (notified.includes(key)) {
      console.log("Already posted this release, skipping duplicate:", e.title);
      continue;
    }

    const localTime = formatLocalTime(e.date);
    const { tag, icon } = classifyResult(e.actual, e.forecast);
    const caption =
      `🚨 *JUST RELEASED — USD*\n\n*${e.title}*\n\n` +
      `Actual: *${e.actual}*${tag}\n` +
      `Forecast: ${e.forecast || "n/a"}\n` +
      `Previous: ${e.previous || "n/a"}\n` +
      `Released: ${localTime}${SIGNATURE}`;

    try {
      const svg = buildPosterSVG(e.title, icon);
      const pngBuffer = await renderSVGToPNGBuffer(svg);
      await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
    } catch (err) {
      console.error("Image build failed entirely, sending text-only:", err.message);
      await sendTelegramMessage(caption);
    }
    console.log("Release alert sent:", e.title);
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
