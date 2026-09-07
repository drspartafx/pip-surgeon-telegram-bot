# Pip Surgeon Telegram Automation

Fully automated, $0-cost Telegram content bot for the Dr. Sparta FX / Pip Surgeon channel.

Posting schedule (all times EAT / UTC+3):
1. **8:00 AM — Calendar Preview.** Always fires. Today's high-impact USD events/holidays, or "quiet day" if none.
2. **11:00 AM — Educational.** "Did You Know" trading/market history fact, with a black-and-gold AI image from Pollinations.ai (free, no key — the only image source used, deliberately, since Gemini's image models turned out to be paid-only, no free tier).
3. **3:00 PM — Market Pulse.** Grounded in today's real USD/JPY calendar AND live prices (gold, USD/JPY, Nasdaq, Dow as a US30 proxy).
4. **Every 15 minutes, all day — Release Monitor.** Fires only when a high-impact USD event's actual number just appeared in the feed — actual vs. forecast, posted within ~15 min of release. Silent the other 95%+ of runs.

Total cost: **$0** — but see the "Keeping this free" note below, since #4 changes the math on GitHub Actions minutes.

## ⚠️ Keeping this free: make the repo public
Running a check every 15 minutes is roughly 3,000 workflow runs/month. **Private repos only get 2,000 free GitHub Actions minutes/month** — at this frequency you could bump into that limit and start getting billed. **Public repos get unlimited free Actions minutes.** Your secrets (bot token, API keys) stay encrypted in GitHub Secrets either way — making the repo public does not expose them, only the code is visible. Set the repo to public when you create it, or flip it in Settings → General → Danger Zone if it's already private.

## 1. Create your Telegram bot
1. Open Telegram, message **@BotFather**
2. Send `/newbot`, follow the prompts, name it whatever you want (e.g. `PipSurgeonBot`)
3. BotFather gives you a **bot token** — save it
4. Add the bot to your channel as an **admin** with "Post Messages" permission

## 2. Get your channel's chat ID
1. Post any message in your channel
2. Forward that message to **@userinfobot** (or **@JsonDumpBot**)
3. It'll show you the channel's chat ID — looks like `-1001234567890`

## 3. Get a free Gemini API key
1. Go to https://aistudio.google.com/apikey
2. Sign in with any Google account, click "Create API key" — no card required
3. This single key powers both the text posts and the educational post's AI image

## 4. Get a free Twelve Data API key (for live prices in the Market Pulse post)
1. Go to https://twelvedata.com, sign up (free) — no card required
2. Free tier: 800 requests/day. This bot uses about 4/day, nowhere close to the limit

## 5. Put this project on GitHub
1. Create a new repo (private is fine — free minutes cover this easily)
2. Upload/push all these files, keeping the folder structure intact

## 6. Add your secrets
In your repo: **Settings → Secrets and variables → Actions → New repository secret**. Add:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `GEMINI_API_KEY`
- `TWELVEDATA_API_KEY`

## 7. That's it
GitHub Actions runs automatically on the schedule in `.github/workflows/telegram-automation.yml`.
To test immediately instead of waiting: **Actions tab → select the workflow → Run workflow → pick a mode** (`educational`, `marketbrief`, or `newsalert`).

## Adjusting posting times
Cron runs in **UTC**. Kenya (EAT) is UTC+3. Edit the `cron:` lines in the workflow file to shift times — e.g. `0 6 * * *` (06:00 UTC) = 09:00 EAT.

## Customizing the brand voice
Lives in `lib/brand.js` — edit `BRAND_VOICE` for tone, `imagePrompt()` for the visual style.

## Known limitations (worth knowing, not hidden)
- **Index prices are proxies, not exact CFD prices.** Free data gives you the Nasdaq 100 and Dow Jones cash index levels, which track NDX100/US30 CFDs closely but not tick-for-tick. Fine for a daily context brief; not for trading decisions.
- **Twelve Data's exact symbols for Nasdaq/Dow (`NDX`, `DJI` in `lib/marketData.js`) haven't been live-tested against your key.** If a price comes back "unavailable" in a post, check Twelve Data's symbol search (https://api.twelvedata.com/symbol_search?symbol=nasdaq) and adjust the symbol string — the brief still generates fine even if one price fails, it just skips that line.
- **Gemini's image models are deliberately not used.** Turned out they're paid-only with no free tier — using them would risk real charges, which conflicts with the $0 requirement. Pollinations.ai is the sole image source instead.
- **Pollinations.ai (the image fallback) has no uptime SLA.** Rare, but if both image sources fail in the same run, the post still goes out as text-only rather than failing silently.
- **The economic calendar feed is unofficial** (a long-standing public feed used widely in the MT4/MT5 community, not an official ForexFactory API). Reliable in practice, but could change format without notice.
