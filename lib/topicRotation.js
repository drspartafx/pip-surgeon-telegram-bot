import fs from "fs";

// Guarantees every topic is shown once before any repeat, instead of pure random
// selection — which, with only 16 topics, produced visible day-to-day repeats by
// chance (a ~6% chance of an immediate repeat on any single day, and much higher
// odds of one within a couple of weeks). Persisted the same way as the other state
// files: committed back to the repo by the workflow's "Persist notification state" step.

const STATE_PATH = "state/educational-rotation.json";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickNextTopic(topics) {
  let state;
  try {
    state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    state = null;
  }

  const topicCount = topics.length;
  const needsReshuffle =
    !state ||
    !Array.isArray(state.order) ||
    state.order.length !== topicCount ||
    state.index >= state.order.length;

  if (needsReshuffle) {
    // Fresh shuffle each time the pool is exhausted — so the order isn't identical
    // cycle to cycle, just guaranteed to cover every topic once per cycle.
    state = { order: shuffle([...Array(topicCount).keys()]), index: 0 };
  }

  const topicIndex = state.order[state.index];
  const chosen = topics[topicIndex];

  state.index += 1;
  fs.mkdirSync("state", { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");

  return chosen;
}
