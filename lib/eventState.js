import fs from "fs";

// Tracks which calendar events have already triggered a notification (pre-event poll
// or release alert), so re-runs — scheduled or manual — never post the same thing twice.
// Persisted as a small JSON file committed back to the repo by the workflow itself
// (see the "Persist notification state" step in the workflow file) — no external
// database needed.

const STATE_PATH = "state/notified-events.json";

export function loadNotifiedEvents() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return [];
  }
}

export function saveNotifiedEvents(events) {
  fs.mkdirSync("state", { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(events, null, 2) + "\n");
}

// Drops entries older than a few days so the file never grows unbounded.
export function pruneOld(events, maxAgeDays = 4) {
  const cutoff = Date.now() - maxAgeDays * 86400000;
  return events.filter((key) => {
    const dateStr = key.split("|").pop();
    const ts = new Date(dateStr).getTime();
    return Number.isNaN(ts) || ts >= cutoff; // keep anything unparseable rather than risk losing state
  });
}

// "type" distinguishes a pre-event poll from a post-release alert for the same
// underlying event, so the two notification kinds don't suppress each other.
export function eventKey(type, e) {
  return `${type}|${e.country}|${e.title}|${e.date}`;
}

// Formats a calendar event's ISO timestamp (which includes its own real UTC offset,
// e.g. "-04:00" for US Eastern) into the trader's actual local time — Africa/Nairobi.
// Never re-labels the source's raw literal digits as UTC without converting them.
export function formatLocalTime(isoDateString) {
  const d = new Date(isoDateString);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleTimeString("en-US", {
    timeZone: "Africa/Nairobi",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
