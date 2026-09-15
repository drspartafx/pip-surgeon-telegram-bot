import { sendTelegramPhotoBuffer, stopTelegramPoll } from "../lib/telegram.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { SIGNATURE } from "../lib/brand.js";
import { loadPendingPolls, savePendingPolls, prunePendingPolls } from "../lib/pollState.js";
import { SYSTEM_COMPOSITIONS } from "../lib/iconAssignments.js";

// THE CROWD VERDICT
// Before NFP/CPI, the bot asks the channel to predict: beat, miss, or in line.
// This script runs after the data actually drops, closes that specific poll, reads
// the final vote counts, and posts whether the crowd called it correctly.
//
// Why it's worth having: it closes a loop that was previously left dangling (people
// voted and never found out if they were right), it creates a recurring reason to
// participate, and over time it builds a genuinely interesting running record of how
// often the crowd is wrong — which is itself a trading lesson. It costs nothing: it
// reuses the same calendar feed and the same poll the bot already sent.

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

function isPopulated(v) {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

// Index order must match the options sent in postPreEventPoll.js.
const OPTION_BEAT = 0;
const OPTION_MISS = 1;
const OPTION_INLINE = 2;

function actualOutcomeIndex(actual, forecast) {
  const a = parseFloat(actual);
  const f = parseFloat(forecast);
  if (Number.isNaN(a) || Number.isNaN(f)) return null; // can't judge — skip rather than guess
  if (a > f) return OPTION_BEAT;
  if (a < f) return OPTION_MISS;
  return OPTION_INLINE;
}

const OUTCOME_LABEL = ["a BEAT 📈", "a MISS 📉", "IN LINE ➡️"];

async function getReleasedEvents() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  return events.filter((e) => e.country === "USD" && isPopulated(e.actual));
}

async function main() {
  let pending = loadPendingPolls();
  if (pending.length === 0) {
    console.log("No pending polls awaiting a verdict. Skipping — expected most runs.");
    return;
  }

  const released = await getReleasedEvents();
  const stillPending = [];
  let changed = false;

  for (const poll of pending) {
    const match = released.find((e) => e.title === poll.eventTitle && e.date === poll.eventDate);

    if (!match) {
      stillPending.push(poll); // not released yet — leave it for a later run
      continue;
    }

    const correctIndex = actualOutcomeIndex(match.actual, match.forecast);
    if (correctIndex === null) {
      console.log(`Cannot judge "${poll.eventTitle}" (non-numeric actual/forecast). Dropping.`);
      changed = true;
      continue;
    }

    let result;
    try {
      result = await stopTelegramPoll(poll.messageId);
    } catch (err) {
      // Poll may already be closed or the message deleted — don't retry forever.
      console.error(`Could not stop poll for "${poll.eventTitle}": ${err.message}. Dropping it.`);
      changed = true;
      continue;
    }

    const counts = (result.options || []).map((o) => o.voter_count || 0);
    const totalVotes = counts.reduce((a, b) => a + b, 0);

    if (totalVotes === 0) {
      console.log(`No votes on "${poll.eventTitle}" — skipping verdict post.`);
      changed = true;
      continue;
    }

    const crowdIndex = counts.indexOf(Math.max(...counts));
    const crowdWasRight = crowdIndex === correctIndex;
    const correctPct = Math.round((counts[correctIndex] / totalVotes) * 100);

    const headline = crowdWasRight ? "THE CROWD CALLED IT ✅" : "THE CROWD GOT IT WRONG ❌";
    const lesson = crowdWasRight
      ? "Consensus was right this time. Worth remembering it often isn't — and that being right on direction still isn't the same as being right on timing or size."
      : "Consensus leaned the wrong way. This is exactly why a forecast is context, not a trade plan: the number is only half the story, the reaction is the other half.";

    const caption =
      `🗳️ *CROWD VERDICT — ${poll.eventTitle}*\n\n` +
      `The actual print was *${OUTCOME_LABEL[correctIndex]}* (actual ${match.actual} vs forecast ${match.forecast}).\n\n` +
      `${correctPct}% of ${totalVotes} voter${totalVotes === 1 ? "" : "s"} got it right.\n\n` +
      `*${headline}*\n\n${lesson}${SIGNATURE}`;

    const icon = crowdWasRight ? SYSTEM_COMPOSITIONS.verdictCorrect : SYSTEM_COMPOSITIONS.verdictWrong;
    const svg = buildPosterSVG("CROWD VERDICT", icon);
    const png = await renderSVGToPNGBuffer(svg);
    await sendTelegramPhotoBuffer(png.toString("base64"), "image/png", caption);

    console.log(`Verdict posted for "${poll.eventTitle}" — crowd ${crowdWasRight ? "correct" : "incorrect"}.`);
    changed = true;
  }

  if (changed) savePendingPolls(prunePendingPolls(stillPending));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
