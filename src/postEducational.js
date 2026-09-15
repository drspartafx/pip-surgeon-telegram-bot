import { sendTelegramPhotoBuffer, sendTelegramPoll } from "../lib/telegram.js";
import { generateText, generateQuizQuestion } from "../lib/gemini.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { pickNextTopic } from "../lib/topicRotation.js";

// Reliable, no-AI image system. 150+ topics spanning historical crashes/bubbles, trading
// psychology, terminology origins, and market mechanics — a genuinely large pool, not a
// small fixed set. Icons are reused thematically across topics here (e.g. multiple crash
// topics share a spike/crash icon) — that's fine, since topics are separated by a full
// rotation cycle before any repeat (see lib/topicRotation.js) and won't appear close
// together. Reused icons must still never collide with the icons reserved for recurring
// SYSTEM posts (see lib/iconAssignments.js) — scripts/auditIcons.js enforces that.
const TOPICS = [
  { topic: "the 1971 collapse of Bretton Woods and the birth of free-floating currencies", title: "BRETTON WOODS 1971", icon: "brokenChainGold" },
  { topic: "why gold's ticker is XAU and where that currency-code convention comes from", title: "WHY GOLD IS 'XAU'", icon: "goldBar" },
  { topic: "the origin of the term 'pip' in forex trading", title: "THE ORIGIN OF A PIP", icon: "pipMarker" },
  { topic: "the 1987 Black Monday crash and what actually triggered it", title: "BLACK MONDAY 1987", icon: "shatteringFloor" },
  { topic: "how the 1985 Plaza Accord was a deliberate, coordinated devaluation of the US dollar", title: "THE PLAZA ACCORD", icon: "candlestickChannel" },
  { topic: "the 2015 Swiss Franc shock and what it taught traders about black-swan risk", title: "THE SWISS FRANC SHOCK", icon: "crackedCross" },
  { topic: "why Non-Farm Payrolls (NFP) became the single most-watched economic release", title: "WHY NFP MOVES MARKETS", icon: "magnifierCalendar" },
  { topic: "the history of the Nasdaq 100 and the dot-com bubble", title: "NASDAQ & THE DOT-COM BUBBLE", icon: "rocketChart" },
  { topic: "how central bank interest rate decisions actually move currency pairs", title: "RATES & CURRENCY MOVES", icon: "gavelScale" },
  { topic: "the difference between fundamental and technical analysis, and why serious traders use both", title: "FUNDAMENTALS VS TECHNICALS", icon: "stethoscopeChart" },
  { topic: "the disposition effect: the psychological bias behind why most retail traders cut winners early and let losers run", title: "THE DISPOSITION EFFECT", icon: "tiltedScaleBalloon" },
  { topic: "how leverage amplifies both gains and account-ending losses", title: "LEVERAGE: BOTH EDGES", icon: "seesawBoulder" },
  { topic: "the 2008 financial crisis and how it reshaped gold as a safe-haven asset", title: "GOLD IN THE 2008 CRISIS", icon: "debrisGoldBar" },
  { topic: "what a 'flash crash' is and a real historical example", title: "WHAT IS A FLASH CRASH?", icon: "spikeChart" },
  { topic: "why the US dollar is the world's reserve currency and what that means for every pair you trade", title: "THE DOLLAR'S RESERVE STATUS", icon: "globeDollar" },
  { topic: "the 1992 'Black Wednesday' event, when a single trader's massive short position forced the UK out of the European exchange rate mechanism, and what it revealed about the limits of central bank intervention", title: "BLACK WEDNESDAY 1992", icon: "crackingArrowFacade" },
  { topic: "Dutch tulip mania of 1637, widely cited as the first recorded speculative bubble in history", title: "TULIP MANIA, 1637", icon: "tulip" },
  { topic: "the South Sea Bubble of 1720 and how it wiped out even Isaac Newton's fortune", title: "THE SOUTH SEA BUBBLE", icon: "shipBubble" },
  { topic: "the 1929 Wall Street Crash and the start of the Great Depression", title: "THE CRASH OF 1929", icon: "tickerRibbon" },
  { topic: "the 1998 collapse of Long-Term Capital Management, a hedge fund run by Nobel Prize-winning economists that nearly broke the financial system through excessive leverage", title: "LTCM: WHEN GENIUS FAILED", icon: "crackedCap" },
  { topic: "the 2001 Enron collapse and the danger of concentrating capital in a single position you don't fully understand", title: "THE ENRON COLLAPSE", icon: "crackedColumn" },
  { topic: "the 2021 GameStop short squeeze and what it revealed about retail traders versus institutional positioning", title: "THE GAMESTOP SQUEEZE", icon: "squeezeVice" },
  { topic: "Bitcoin's origin and the boom-bust cycle of its first major bull run", title: "BITCOIN'S FIRST BOOM-BUST", icon: "coinPeak" },
  { topic: "the August 2024 yen carry trade unwind and how a single rate decision triggered a global market shock", title: "THE YEN CARRY TRADE UNWIND", icon: "snappingRope" },
  { topic: "what slippage is and why it happens most during high-impact news releases", title: "WHAT IS SLIPPAGE?", icon: "targetSlip" },
  { topic: "what a stop hunt or liquidity grab is, and why price often wicks through obvious levels before reversing", title: "THE STOP HUNT", icon: "liquidityHook" },
  { topic: "the origin of the terms 'bull market' and 'bear market'", title: "BULL VS BEAR: THE ORIGIN", icon: "bullBear" },
  { topic: "what spread is, why it widens during news events, and what that means for entries", title: "WHY SPREAD WIDENS ON NEWS", icon: "wideningGap" },
  { topic: "what a margin call is and the mechanics of how a broker forces a position closed", title: "THE MARGIN CALL", icon: "marginBell" },
  { topic: "risk of ruin: the mathematical concept of how a string of losses can mathematically end a trading account regardless of win rate", title: "RISK OF RUIN", icon: "dieCrack" },
  { topic: "the Kelly Criterion, a mathematical formula originally developed for gambling that traders adapted for position sizing", title: "THE KELLY CRITERION", icon: "kellyGauge" },
  { topic: "confirmation bias and how it makes traders only notice the evidence that supports the position they already hold", title: "CONFIRMATION BIAS", icon: "blinderEye" },
  { topic: "overconfidence bias and the illusion of control after a winning streak", title: "OVERCONFIDENCE AFTER A WIN STREAK", icon: "tinyPedestalCrown" },
  { topic: "loss aversion, the behavioral finance concept from Kahneman and Tversky's prospect theory showing losses are felt roughly twice as intensely as equivalent gains", title: "LOSS AVERSION", icon: "fistOpenHand" },
  { topic: "anchoring bias and how a trader's first price reference point distorts every decision that follows", title: "ANCHORING BIAS", icon: "anchorGround" },
  { topic: "revenge trading: the psychological pattern of increasing risk immediately after a loss to 'get it back'", title: "REVENGE TRADING", icon: "fistPunchArrow" },
  { topic: "FOMO in trading and the mechanism by which it pulls traders into a move after most of it has already happened", title: "THE MECHANICS OF FOMO", icon: "reachingChase" },
  { topic: "the origin of candlestick charting, credited to 18th-century Japanese rice trader Munehisa Homma", title: "THE ORIGIN OF CANDLESTICKS", icon: "riceCandle" },
  { topic: "what the VIX, known as the market's 'fear index', actually measures and why it spikes during uncertainty", title: "THE VIX: WALL STREET'S FEAR GAUGE", icon: "fearGauge" },
  { topic: "the difference between correlation and causation, and why two markets moving together doesn't mean one is causing the other", title: "CORRELATION VS CAUSATION", icon: "vennQuestion" },
  { topic: "quantitative easing and how a central bank injecting liquidity into an economy affects its currency's value", title: "WHAT QUANTITATIVE EASING DOES", icon: "faucetPool" },
  { topic: "the petrodollar system and the historical link between oil trade and US dollar demand", title: "THE PETRODOLLAR SYSTEM", icon: "oilDollar" },
  { topic: "Nassim Taleb's 'black swan' concept: a rare, unpredictable event with severe consequences that seems obvious only in hindsight", title: "THE BLACK SWAN CONCEPT", icon: "blackSwan" },
  { topic: "the 1997 Asian Financial Crisis and how currency pegs collapsed across an entire region", title: "THE 1997 ASIAN FINANCIAL CRISIS", icon: "dominoes" },
  { topic: "the Panic of 1873, a lesser-known but severe financial crisis triggered by railroad speculation and overexpansion", title: "THE PANIC OF 1873", icon: "steamTrain" },
  { topic: "what arbitrage is, explained through a simple historical example of exploiting a price difference between two markets", title: "WHAT IS ARBITRAGE?", icon: "priceTagsArbitrage" },
  { topic: "the origin of point-and-figure charting, one of the oldest technical analysis methods, predating candlestick charts in Western markets", title: "POINT-AND-FIGURE: THE OLDEST CHART", icon: "pointFigureGrid" },
  { topic: "what 'smart money' means in trading slang and where the term actually comes from", title: "WHAT IS 'SMART MONEY'?", icon: "bulbDollar" },
  { topic: "the Efficient Market Hypothesis versus behavioral finance, and the decades-long academic debate over whether markets are truly rational", title: "EFFICIENT MARKETS VS BEHAVIORAL FINANCE", icon: "robotBrain" },

  // --- Composable-icon topics (see lib/composeIcon.js) ---
  { topic: "the Mississippi Bubble of 1720, John Law's French scheme that collapsed alongside the South Sea Bubble in the same year", title: "THE MISSISSIPPI BUBBLE", icon: { glyph: "ship", badge: "bBurst" } },
  { topic: "the Panic of 1907, when a private banker personally organised a rescue of the US financial system, leading directly to the creation of the Federal Reserve", title: "THE PANIC OF 1907", icon: { glyph: "vault", badge: "bCrack" } },
  { topic: "the Volcker Shock of the early 1980s, when the Fed raised rates above 19% to break runaway inflation", title: "THE VOLCKER SHOCK", icon: { glyph: "gavel", badge: "bUp" } },
  { topic: "Japan's 1989 asset bubble and the lost decade that followed, a reminder that a market can take decades to recover a high", title: "JAPAN'S LOST DECADE", icon: { glyph: "tower", badge: "bDown" } },
  { topic: "the 1994 Mexican peso crisis, known as the Tequila Crisis, and how a sudden devaluation cascaded across emerging markets", title: "THE TEQUILA CRISIS", icon: { glyph: "banknote", badge: "bDown" } },
  { topic: "the 1998 Russian financial crisis and sovereign default, and the contagion it spread through global markets", title: "RUSSIA DEFAULTS, 1998", icon: { glyph: "flag", badge: "bCross" } },
  { topic: "the 2001 Argentine economic crisis and the collapse of its dollar peg", title: "ARGENTINA'S PEG COLLAPSE", icon: { glyph: "banknote", badge: "bCross" } },
  { topic: "the May 2010 Flash Crash, when US markets lost roughly a trillion dollars in minutes and largely recovered the same day", title: "THE 2010 FLASH CRASH", icon: { glyph: "spikeMark", badge: "bBolt" } },
  { topic: "the 2016 Brexit referendum and the overnight collapse in the British pound", title: "BREXIT AND THE POUND", icon: { glyph: "flag", badge: "bCrack" } },
  { topic: "the March 2020 COVID crash, one of the fastest bear markets in history, and the equally fast recovery that followed", title: "THE COVID CRASH", icon: { glyph: "trendDown", badge: "bBolt" } },
  { topic: "the April 2020 event when WTI crude oil futures traded at a negative price for the first time in history", title: "WHEN OIL WENT NEGATIVE", icon: { glyph: "oilDrop", badge: "bMinus" } },
  { topic: "the 2021 Archegos Capital collapse and how hidden leverage through swaps cost banks billions", title: "THE ARCHEGOS COLLAPSE", icon: { glyph: "tower", badge: "bCrack" } },
  { topic: "the 2022 UK gilt crisis, when pension fund leverage strategies forced an emergency Bank of England intervention", title: "THE 2022 GILT CRISIS", icon: { glyph: "shield", badge: "bCrack" } },
  { topic: "the 2023 Silicon Valley Bank collapse and how a modern bank run unfolded at digital speed", title: "THE SVB COLLAPSE", icon: { glyph: "vault", badge: "bFlame" } },
  { topic: "the 2023 collapse and forced takeover of Credit Suisse, ending a 167-year-old institution", title: "CREDIT SUISSE FALLS", icon: { glyph: "pillar", badge: "bCross" } },
  { topic: "Weimar Germany's hyperinflation of 1923 and what it demonstrates about currency confidence", title: "WEIMAR HYPERINFLATION", icon: { glyph: "banknote", badge: "bFlame" } },
  { topic: "Zimbabwe's hyperinflation and the one hundred trillion dollar banknote", title: "ZIMBABWE'S TRILLION NOTE", icon: { glyph: "banknote", badge: "bBurst" } },
  { topic: "the 2012 Knight Capital incident, when a faulty software deployment lost roughly $440 million in 45 minutes", title: "THE KNIGHT CAPITAL GLITCH", icon: { glyph: "robot", badge: "bCross" } },
  { topic: "the 1995 collapse of Barings Bank, brought down by a single rogue trader hiding losses in an error account", title: "BARINGS BANK, 1995", icon: { glyph: "pillar", badge: "bCrack" } },
  { topic: "the 2008 Societe Generale trading loss and what it revealed about internal risk controls", title: "THE SOCGEN TRADING LOSS", icon: { glyph: "vault", badge: "bExclaim" } },
  { topic: "the Hunt brothers' attempt to corner the silver market in 1980 and the rule change that destroyed them", title: "CORNERING SILVER, 1980", icon: { glyph: "coin", badge: "bFlame" } },
  { topic: "the 1996 Sumitomo copper scandal, a decade-long rogue trading loss in a single commodity", title: "THE SUMITOMO COPPER LOSS", icon: { glyph: "coin", badge: "bCross" } },
  { topic: "the Bre-X gold fraud of 1997, one of the largest mining stock scandals in history", title: "THE BRE-X GOLD FRAUD", icon: { glyph: "mountain", badge: "bCross" } },
  { topic: "the 2020 Wirecard scandal, where nearly two billion euros were found to not exist", title: "THE WIRECARD SCANDAL", icon: { glyph: "book", badge: "bCross" } },
  { topic: "the 2022 FTX collapse and the speed at which a major crypto exchange unwound", title: "THE FTX COLLAPSE", icon: { glyph: "coin", badge: "bCrack" } },
  { topic: "the 2022 Terra and Luna collapse and the mechanics of how an algorithmic stablecoin lost its peg", title: "THE LUNA COLLAPSE", icon: { glyph: "coin", badge: "bDown" } },
  { topic: "the Mt. Gox exchange collapse and the early lesson it taught about custody risk", title: "THE MT. GOX COLLAPSE", icon: { glyph: "lock", badge: "bCross" } },
  { topic: "the 2008 Lehman Brothers bankruptcy, the largest in US history, and the moment the financial crisis became global", title: "LEHMAN BROTHERS, 2008", icon: { glyph: "pillar", badge: "bDown" } },
  { topic: "the 2007 Northern Rock bank run, the first on a British bank in over a century", title: "THE NORTHERN ROCK RUN", icon: { glyph: "vault", badge: "bDown" } },
  { topic: "the Greek debt crisis and the years of austerity and bailouts that followed", title: "THE GREEK DEBT CRISIS", icon: { glyph: "pillar", badge: "bExclaim" } },
  { topic: "Jesse Livermore, the early 20th-century speculator whose trading principles are still quoted today, and the discipline problems that ultimately undid him", title: "JESSE LIVERMORE", icon: { glyph: "book", badge: "bStar" } },
  { topic: "the Turtle Traders experiment, where a commodities trader taught a mechanical system to complete beginners to prove trading could be learned", title: "THE TURTLE TRADERS", icon: { glyph: "book", badge: "bCheck" } },
  { topic: "how one trader famously anticipated and profited enormously from the 1987 crash, and what preparation rather than prediction actually looked like", title: "PREPARING FOR 1987", icon: { glyph: "trendDown", badge: "bStar" } },
  { topic: "the radical transparency and systemised decision-making philosophy behind one of the world's largest hedge funds", title: "SYSTEMISING DECISIONS", icon: { glyph: "book", badge: "bRing" } },
  { topic: "Benjamin Graham and the birth of value investing, and the concept of margin of safety", title: "THE MARGIN OF SAFETY", icon: { glyph: "book", badge: "bPlus" } },
  { topic: "the long-term compounding philosophy that made one investor famous, and why time in the market beat timing it", title: "COMPOUNDING OVER DECADES", icon: { glyph: "coin", badge: "bClock" } },
  { topic: "trend following as a systematic discipline, and why its practitioners accept many small losses for a few large wins", title: "THE TREND FOLLOWER'S EDGE", icon: { glyph: "trendUp", badge: "bCheck" } },
  { topic: "the concept of concentrated conviction bets in macro trading, and the risk management that has to sit underneath them", title: "CONVICTION AND POSITION SIZE", icon: { glyph: "trendUp", badge: "bStar" } },
  { topic: "how a handful of investors identified the subprime mortgage collapse before 2008 and the years of drawdown they endured while being early", title: "BEING RIGHT TOO EARLY", icon: { glyph: "magnifier", badge: "bDown" } },
  { topic: "Dow Theory, the foundational framework of technical analysis built from 19th-century market editorials", title: "DOW THEORY", icon: { glyph: "grid", badge: "bRing" } },
  { topic: "the Wyckoff method and its framework of accumulation and distribution phases", title: "THE WYCKOFF METHOD", icon: { glyph: "rangeBox", badge: "bRing" } },
  { topic: "Elliott Wave Theory and the idea that market psychology moves in repeating wave structures", title: "ELLIOTT WAVE THEORY", icon: { glyph: "wave", badge: "bRing" } },
  { topic: "what the order book is and how depth of market reveals where liquidity actually sits", title: "READING THE ORDER BOOK", icon: { glyph: "ladder", badge: "bRing" } },
  { topic: "what market makers do, how they profit from the spread, and why they are not simply hunting your stops", title: "WHAT MARKET MAKERS DO", icon: { glyph: "scale", badge: "bRing" } },
  { topic: "the practical difference between limit orders and market orders, and when each one costs you money", title: "LIMIT VS MARKET ORDERS", icon: { glyph: "arrowsDiverge", badge: "bQuestion" } },
  { topic: "how a trailing stop loss works mechanically, and the tradeoff between locking profit and being stopped out early", title: "THE TRAILING STOP", icon: { glyph: "anchor", badge: "bUp" } },
  { topic: "what swap and rollover fees actually are, and why holding a position overnight has a real cost", title: "SWAP AND ROLLOVER", icon: { glyph: "clock", badge: "bDrop" } },
  { topic: "contango and backwardation in futures markets, explained simply", title: "CONTANGO VS BACKWARDATION", icon: { glyph: "arrowsDiverge", badge: "bClock" } },
  { topic: "the mechanics of a carry trade, borrowing in a low-yield currency to buy a high-yield one, and why it unwinds violently", title: "THE CARRY TRADE", icon: { glyph: "bridge", badge: "bPlus" } },
  { topic: "what a currency peg is, why countries use them, and what happens when one breaks", title: "HOW CURRENCY PEGS BREAK", icon: { glyph: "chain", badge: "bRing" } },
  { topic: "how and why central banks directly intervene in currency markets", title: "CENTRAL BANK INTERVENTION", icon: { glyph: "gavel", badge: "bBolt" } },
  { topic: "interest rate parity and the theoretical relationship between rates and forward exchange rates", title: "INTEREST RATE PARITY", icon: { glyph: "scale", badge: "bPlus" } },
  { topic: "purchasing power parity and why identical goods should theoretically cost the same across currencies", title: "PURCHASING POWER PARITY", icon: { glyph: "globe", badge: "bPlus" } },
  { topic: "the Big Mac Index, The Economist's informal measure of whether currencies are over or undervalued", title: "THE BIG MAC INDEX", icon: { glyph: "globe", badge: "bStar" } },
  { topic: "what a yield curve inversion is and why it has historically preceded recessions", title: "YIELD CURVE INVERSION", icon: { glyph: "wave", badge: "bExclaim" } },
  { topic: "safe haven flows, and why capital moves toward gold, the dollar, and the yen during uncertainty", title: "SAFE HAVEN FLOWS", icon: { glyph: "shield", badge: "bDrop" } },
  { topic: "risk-on versus risk-off market regimes and how to recognise which one you are trading in", title: "RISK-ON VS RISK-OFF", icon: { glyph: "arrowsDiverge", badge: "bBolt" } },
  { topic: "the relationship between gold and real yields, and why gold often struggles when real rates rise", title: "GOLD AND REAL YIELDS", icon: { glyph: "coin", badge: "bMinus" } },
  { topic: "the dollar smile theory, explaining why the US dollar can strengthen in both booms and crises", title: "THE DOLLAR SMILE", icon: { glyph: "globe", badge: "bCheck" } },
  { topic: "the Asian, London, and New York trading sessions, and why the overlaps carry the most volume", title: "SESSION OVERLAPS", icon: { glyph: "clock", badge: "bBolt" } },
  { topic: "weekend gaps, why price can open away from Friday's close, and the risk of holding through", title: "THE WEEKEND GAP", icon: { glyph: "calendar", badge: "bCrack" } },
  { topic: "why spreads widen around the daily rollover and what that means for scalpers", title: "SPREADS AT ROLLOVER", icon: { glyph: "clock", badge: "bMinus" } },
  { topic: "the difference between core and headline inflation, and why central banks focus on core", title: "CORE VS HEADLINE INFLATION", icon: { glyph: "gauge", badge: "bQuestion" } },
  { topic: "what the PMI measures and why a reading above or below 50 matters", title: "READING THE PMI", icon: { glyph: "gauge", badge: "bCheck" } },
  { topic: "the FOMC dot plot and what it reveals about where policymakers expect rates to go", title: "THE FOMC DOT PLOT", icon: { glyph: "grid", badge: "bStar" } },
  { topic: "forward guidance, and how central banks move markets with words before they move rates", title: "FORWARD GUIDANCE", icon: { glyph: "magnifier", badge: "bClock" } },
  { topic: "what hawkish and dovish actually mean, and how to read central bank tone", title: "HAWKISH VS DOVISH", icon: { glyph: "scale", badge: "bQuestion" } },
  { topic: "the 2013 Taper Tantrum, when merely signalling reduced stimulus caused a global bond selloff", title: "THE TAPER TANTRUM", icon: { glyph: "spikeMark", badge: "bExclaim" } },
  { topic: "the repo market, the overnight plumbing of the financial system most traders never see", title: "THE REPO MARKET", icon: { glyph: "chain", badge: "bBolt" } },
  { topic: "the Eurodollar system: dollars held outside the US, and why it matters for global liquidity", title: "THE EURODOLLAR SYSTEM", icon: { glyph: "globe", badge: "bRing" } },
  { topic: "the origins of the Fibonacci sequence and how traders came to apply it to retracements", title: "FIBONACCI'S ORIGINS", icon: { glyph: "grid", badge: "bPlus" } },
  { topic: "the history of moving averages and why the simple average remains one of the most used tools in trading", title: "THE MOVING AVERAGE", icon: { glyph: "wave", badge: "bCheck" } },
  { topic: "the origin of the Relative Strength Index, developed by Welles Wilder in 1978", title: "THE BIRTH OF RSI", icon: { glyph: "gauge", badge: "bRing" } },
  { topic: "what MACD actually measures and the common mistake of treating every crossover as a signal", title: "WHAT MACD MEASURES", icon: { glyph: "wave", badge: "bBolt" } },
  { topic: "the origin of Bollinger Bands and what standard deviation bands actually tell you about volatility", title: "BOLLINGER BANDS", icon: { glyph: "rangeBox", badge: "bPlus" } },
  { topic: "the origins of Ichimoku Kinko Hyo, developed by a Japanese journalist over three decades", title: "ICHIMOKU'S ORIGINS", icon: { glyph: "grid", badge: "bClock" } },
  { topic: "volume profile and why where volume traded matters more than how much traded", title: "VOLUME PROFILE", icon: { glyph: "pyramid", badge: "bRing" } },
  { topic: "the psychology behind why support and resistance levels work at all", title: "WHY S/R ACTUALLY WORKS", icon: { glyph: "pillar", badge: "bRing" } },
  { topic: "round number psychology and why price reacts at levels ending in round figures", title: "ROUND NUMBER PSYCHOLOGY", icon: { glyph: "coin", badge: "bRing" } },
  { topic: "the head and shoulders pattern, its structure, and the statistical caution it deserves", title: "HEAD AND SHOULDERS", icon: { glyph: "mountain", badge: "bRing" } },
  { topic: "double tops and double bottoms, and why the confirmation matters more than the shape", title: "DOUBLE TOPS AND BOTTOMS", icon: { glyph: "mountain", badge: "bPlus" } },
  { topic: "gap trading: why price gaps form and the difference between gaps that fill and gaps that run", title: "WHY GAPS FORM", icon: { glyph: "stairsDown", badge: "bUp" } },
  { topic: "recency bias and why your last three trades distort your judgment far more than they should", title: "RECENCY BIAS", icon: { glyph: "clock", badge: "bQuestion" } },
  { topic: "survivorship bias in trading, and why you only ever hear from the accounts that survived", title: "SURVIVORSHIP BIAS", icon: { glyph: "crown", badge: "bQuestion" } },
  { topic: "hindsight bias and the illusion that a past move was obvious all along", title: "HINDSIGHT BIAS", icon: { glyph: "eye", badge: "bClock" } },
  { topic: "the gambler's fallacy and why a losing streak does not make the next trade more likely to win", title: "THE GAMBLER'S FALLACY", icon: { glyph: "dice", badge: "bQuestion" } },
  { topic: "the sunk cost fallacy and why the money already lost should never justify holding a broken trade", title: "THE SUNK COST FALLACY", icon: { glyph: "anchor", badge: "bMinus" } },
  { topic: "the Dunning-Kruger effect in trading, and why confidence often peaks before competence does", title: "DUNNING-KRUGER IN TRADING", icon: { glyph: "mountain", badge: "bQuestion" } },
  { topic: "analysis paralysis, and how adding more indicators can make decisions harder rather than clearer", title: "ANALYSIS PARALYSIS", icon: { glyph: "brain", badge: "bClock" } },
  { topic: "tilt, a concept borrowed from poker, and how emotional compromise after a loss destroys good decision-making", title: "TILT: BORROWED FROM POKER", icon: { glyph: "dice", badge: "bFlame" } },
  { topic: "decision fatigue and why the quality of trading decisions degrades over a long session", title: "DECISION FATIGUE", icon: { glyph: "brain", badge: "bMinus" } },
  { topic: "herding behaviour in markets and why crowds cluster at exactly the wrong moments", title: "HERDING BEHAVIOUR", icon: { glyph: "bull", badge: "bPlus" } },
  { topic: "the narrative fallacy and how a convincing story about a chart can override the actual evidence", title: "THE NARRATIVE FALLACY", icon: { glyph: "book", badge: "bQuestion" } },
  { topic: "the illusion of control, and the difference between what a trader controls and what the market decides", title: "THE ILLUSION OF CONTROL", icon: { glyph: "openHand", badge: "bQuestion" } },
  { topic: "outcome bias versus process: why a profitable trade can still be a bad decision", title: "OUTCOME VS PROCESS", icon: { glyph: "arrowsDiverge", badge: "bCheck" } },
  { topic: "variance versus edge, and why a small real edge can still produce long losing stretches", title: "VARIANCE VS EDGE", icon: { glyph: "dice", badge: "bPlus" } },
  { topic: "the expectancy formula and how to calculate whether a strategy is actually profitable over time", title: "THE EXPECTANCY FORMULA", icon: { glyph: "scale", badge: "bCheck" } },
  { topic: "sample size and statistical significance, and why twenty trades tells you almost nothing about a system", title: "SAMPLE SIZE MATTERS", icon: { glyph: "grid", badge: "bQuestion" } },
  { topic: "the martingale strategy of doubling after every loss, and the mathematical certainty of eventual ruin", title: "MARTINGALE: THE TRAP", icon: { glyph: "dice", badge: "bCross" } },
  { topic: "the anti-martingale approach of increasing size only after wins, and its tradeoffs", title: "THE ANTI-MARTINGALE", icon: { glyph: "dice", badge: "bUp" } },
  { topic: "maximum drawdown as a risk measure, and why it matters more than total return", title: "MAXIMUM DRAWDOWN", icon: { glyph: "stairsDown", badge: "bDown" } },
  { topic: "the Sharpe ratio and what risk-adjusted return actually means", title: "THE SHARPE RATIO", icon: { glyph: "gauge", badge: "bPlus" } },
  { topic: "R-multiples as a way to measure every trade in units of risk rather than currency", title: "THINKING IN R-MULTIPLES", icon: { glyph: "scale", badge: "bStar" } },
  { topic: "the mathematical tradeoff between win rate and risk-to-reward ratio", title: "WIN RATE VS RISK-REWARD", icon: { glyph: "scale", badge: "bMinus" } },
  { topic: "overnight and weekend gap risk, and why a stop loss does not always protect you", title: "WHEN STOPS DON'T PROTECT", icon: { glyph: "calendar", badge: "bBolt" } },
  { topic: "how trailing drawdown works on funded accounts and why it is stricter than it first appears", title: "TRAILING DRAWDOWN EXPLAINED", icon: { glyph: "stairsDown", badge: "bExclaim" } },
  { topic: "the difference between A-book and B-book broker models and what each means for your fills", title: "A-BOOK VS B-BOOK", icon: { glyph: "arrowsDiverge", badge: "bRing" } },
  { topic: "why prop firms impose consistency rules and what behaviour they are actually designed to prevent", title: "WHY CONSISTENCY RULES EXIST", icon: { glyph: "grid", badge: "bCheck" } },
];

async function main() {
  const { topic, title, icon } = pickNextTopic(TOPICS);

  const prompt = `${BRAND_VOICE}

Write a "Did You Know" post about this trading/market history topic: "${topic}".
If this topic references a real named individual, describe their actions/strategy factually but do not fabricate quotes.
2-4 sentences. End with one sharp, practically applicable takeaway for a retail trader today. No hashtags, no title line (a title will be added separately).`;

  const body = await generateText(prompt);
  const caption = `📜 *DID YOU KNOW?*\n\n${body}${SIGNATURE}`;

  const svg = buildPosterSVG(title, icon);
  const pngBuffer = await renderSVGToPNGBuffer(svg);

  await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
  console.log("Educational post sent. Topic:", topic);

  // Quiz-poll testing the fact just posted. Never breaks the main post if it fails —
  // generateQuizQuestion returns null on any parsing issue instead of throwing.
  const quiz = await generateQuizQuestion(topic, body);
  if (quiz) {
    await sendTelegramPoll(quiz.question, quiz.options, {
      type: "quiz",
      correctOptionId: quiz.correctIndex,
      explanation: quiz.explanation,
      isAnonymous: true,
    });
    console.log("Quiz poll sent.");
  } else {
    console.log("Quiz generation failed — post still succeeded without it.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
