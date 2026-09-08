import { sendTelegramPoll } from "../lib/telegram.js";

// Simple weekly sentiment poll — pure engagement, no signals given.
// Scheduled for Monday only via the cron expression itself (day-of-week = 1),
// so this script doesn't need any day-checking logic of its own.
async function main() {
  await sendTelegramPoll(
    "This week — where's the dollar heading?",
    ["Strengthening 💪", "Weakening 📉", "Range-bound / choppy 🔁"]
    // Channels only support anonymous polls — non-anonymous is a group-only feature.
  );
  console.log("Weekly sentiment poll sent.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
