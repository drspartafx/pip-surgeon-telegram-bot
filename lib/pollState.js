import fs from "fs";

// Remembers which Telegram poll message belongs to which upcoming event, so that
// after the data actually releases we can reopen that specific poll, read the final
// vote counts, and tell the community whether the crowd called it right.
// Persisted the same way as the other state files — committed back by the workflow.

const STATE_PATH = "state/pending-polls.json";

export function loadPendingPolls() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return [];
  }
}

export function savePendingPolls(polls) {
  fs.mkdirSync("state", { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(polls, null, 2) + "\n");
}

// Drop entries older than a couple of days — if a verdict never fired (e.g. the
// release was cancelled), the entry shouldn't linger forever.
export function prunePendingPolls(polls, maxAgeDays = 3) {
  const cutoff = Date.now() - maxAgeDays * 86400000;
  return polls.filter((p) => {
    const ts = new Date(p.eventDate).getTime();
    return Number.isNaN(ts) || ts >= cutoff;
  });
}
