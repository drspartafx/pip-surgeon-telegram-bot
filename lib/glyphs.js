// Normalized glyph primitives for the composable icon system.
//
// WHY THIS EXISTS: hand-drawing one bespoke icon per topic doesn't scale — at ~50
// topics the quality was already uneven, and 150 hand-drawn icons would be worse.
// Instead, every glyph here is drawn carefully ONCE, centred on (120,120) in a
// 240x240 box, and lib/composedIcons.js combines a main glyph with a small corner
// badge. ~35 glyphs x ~14 badges gives ~490 distinct combinations, all of which look
// deliberate because every part was drawn properly.
//
// CONVENTION: every glyph must be visually centred on (120,120) and fit inside a
// radius of roughly 80 units, so composition scaling behaves predictably.

const GOLD = "#e8c15a";
const DIM = "#c9a227";
const BG = "#0a0a0a";

/* ---------------------------------- OBJECTS --------------------------------- */

export const ship = () => `
  <path d="M 45 145 L 195 145 L 172 180 L 68 180 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <line x1="120" y1="145" x2="120" y2="62" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 128 70 L 176 102 L 128 122 Z" fill="${GOLD}"/>`;

export const train = () => `
  <rect x="58" y="98" width="86" height="52" rx="8" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <path d="M 144 116 L 178 116 L 178 150 L 144 150" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="80" cy="166" r="14" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <circle cx="128" cy="166" r="14" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <path d="M 96 94 Q 90 68 106 56" fill="none" stroke="${DIM}" stroke-width="5" stroke-linecap="round"/>`;

export const rocket = () => `
  <path d="M 120 48 C 148 78 152 122 148 152 L 92 152 C 88 122 92 78 120 48 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="120" cy="100" r="13" fill="${GOLD}"/>
  <path d="M 92 128 L 66 160 L 92 152 Z" fill="${GOLD}"/>
  <path d="M 148 128 L 174 160 L 148 152 Z" fill="${GOLD}"/>
  <path d="M 108 160 L 120 192 L 132 160" fill="none" stroke="${DIM}" stroke-width="6" stroke-linecap="round"/>`;

export const coin = () => `
  <circle cx="120" cy="120" r="66" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <circle cx="120" cy="120" r="48" fill="none" stroke="${DIM}" stroke-width="3"/>
  <text x="120" y="138" font-family="Georgia, serif" font-size="52" font-weight="700" fill="${GOLD}" text-anchor="middle">$</text>`;

export const banknote = () => `
  <rect x="45" y="80" width="150" height="82" rx="8" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <circle cx="120" cy="121" r="24" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <line x1="63" y1="98" x2="63" y2="144" stroke="${DIM}" stroke-width="5" stroke-linecap="round"/>
  <line x1="177" y1="98" x2="177" y2="144" stroke="${DIM}" stroke-width="5" stroke-linecap="round"/>`;

export const vault = () => `
  <rect x="52" y="60" width="136" height="122" rx="10" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <circle cx="120" cy="121" r="38" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <line x1="120" y1="83" x2="120" y2="159" stroke="${DIM}" stroke-width="5"/>
  <line x1="82" y1="121" x2="158" y2="121" stroke="${DIM}" stroke-width="5"/>`;

export const scale = () => `
  <line x1="120" y1="56" x2="120" y2="180" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="52" y1="80" x2="188" y2="80" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 52 80 L 34 126 A 20 20 0 0 0 70 126 Z" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <path d="M 188 80 L 170 126 A 20 20 0 0 0 206 126 Z" fill="none" stroke="${GOLD}" stroke-width="6"/>
  <line x1="92" y1="180" x2="148" y2="180" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const gavel = () => `
  <rect x="58" y="70" width="70" height="40" rx="7" fill="${GOLD}" transform="rotate(-35 93 90)"/>
  <line x1="112" y1="108" x2="168" y2="164" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/>
  <line x1="62" y1="188" x2="150" y2="188" stroke="${DIM}" stroke-width="8" stroke-linecap="round"/>`;

export const clock = () => `
  <circle cx="120" cy="120" r="68" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <line x1="120" y1="120" x2="120" y2="76" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="120" y1="120" x2="156" y2="140" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="120" cy="120" r="7" fill="${GOLD}"/>`;

export const hourglass = () => `
  <path d="M 70 52 L 170 52 L 122 120 L 170 188 L 70 188 L 118 120 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M 84 168 L 156 168 L 126 132 L 114 132 Z" fill="${GOLD}"/>
  <line x1="62" y1="48" x2="178" y2="48" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="62" y1="192" x2="178" y2="192" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const calendar = () => `
  <rect x="50" y="66" width="140" height="124" rx="10" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <line x1="50" y1="102" x2="190" y2="102" stroke="${GOLD}" stroke-width="7"/>
  <line x1="86" y1="48" x2="86" y2="80" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="154" y1="48" x2="154" y2="80" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="95" cy="134" r="9" fill="${GOLD}"/>
  <circle cx="145" cy="164" r="9" fill="${DIM}"/>`;

export const magnifier = () => `
  <circle cx="108" cy="106" r="52" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <line x1="146" y1="146" x2="188" y2="188" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/>`;

export const anchor = () => `
  <circle cx="120" cy="60" r="16" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <line x1="120" y1="76" x2="120" y2="176" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="84" y1="102" x2="156" y2="102" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 120 176 Q 82 176 74 140" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <path d="M 120 176 Q 158 176 166 140" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>`;

export const chain = () => `
  <ellipse cx="82" cy="120" rx="34" ry="24" fill="none" stroke="${GOLD}" stroke-width="8" transform="rotate(-25 82 120)"/>
  <ellipse cx="158" cy="120" rx="34" ry="24" fill="none" stroke="${GOLD}" stroke-width="8" transform="rotate(-25 158 120)"/>`;

export const globe = () => `
  <circle cx="120" cy="120" r="70" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <ellipse cx="120" cy="120" rx="30" ry="70" fill="none" stroke="${GOLD}" stroke-width="5"/>
  <line x1="50" y1="120" x2="190" y2="120" stroke="${GOLD}" stroke-width="5"/>
  <line x1="62" y1="82" x2="178" y2="82" stroke="${DIM}" stroke-width="4"/>
  <line x1="62" y1="158" x2="178" y2="158" stroke="${DIM}" stroke-width="4"/>`;

export const flag = () => `
  <line x1="72" y1="52" x2="72" y2="190" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <path d="M 72 62 L 176 62 L 156 96 L 176 130 L 72 130 Z" fill="${GOLD}"/>`;

export const swan = () => `
  <path d="M 52 158 Q 62 106 112 100 Q 106 78 132 66 Q 122 88 142 100 Q 188 110 198 158 Q 152 136 120 142 Q 86 142 52 158 Z" fill="${GOLD}"/>
  <circle cx="137" cy="86" r="5" fill="${BG}"/>`;

export const bull = () => `
  <path d="M 58 92 Q 44 62 74 58 Q 92 60 98 82" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
  <path d="M 182 92 Q 196 62 166 58 Q 148 60 142 82" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
  <path d="M 84 88 Q 120 70 156 88 Q 168 128 146 160 Q 120 176 94 160 Q 72 128 84 88 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="103" cy="115" r="6" fill="${GOLD}"/>
  <circle cx="137" cy="115" r="6" fill="${GOLD}"/>
  <ellipse cx="120" cy="150" rx="18" ry="12" fill="none" stroke="${DIM}" stroke-width="5"/>`;

export const bear = () => `
  <circle cx="74" cy="72" r="20" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <circle cx="166" cy="72" r="20" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <path d="M 66 106 Q 120 78 174 106 Q 186 146 154 172 Q 120 188 86 172 Q 54 146 66 106 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="100" cy="128" r="6" fill="${GOLD}"/>
  <circle cx="140" cy="128" r="6" fill="${GOLD}"/>
  <ellipse cx="120" cy="158" rx="16" ry="11" fill="${DIM}"/>`;

export const dice = () => `
  <rect x="60" y="60" width="120" height="120" rx="18" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <circle cx="92" cy="92" r="9" fill="${GOLD}"/>
  <circle cx="148" cy="92" r="9" fill="${GOLD}"/>
  <circle cx="120" cy="120" r="9" fill="${GOLD}"/>
  <circle cx="92" cy="148" r="9" fill="${GOLD}"/>
  <circle cx="148" cy="148" r="9" fill="${GOLD}"/>`;

export const gauge = () => `
  <path d="M 46 152 A 74 74 0 0 1 194 152" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
  <line x1="120" y1="152" x2="172" y2="100" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="120" cy="152" r="12" fill="${GOLD}"/>`;

export const bell = () => `
  <path d="M 120 56 C 88 56 78 94 78 120 L 66 158 L 174 158 L 162 120 C 162 94 152 56 120 56 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <line x1="120" y1="42" x2="120" y2="56" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 104 170 Q 120 186 136 170" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const bulb = () => `
  <circle cx="120" cy="104" r="50" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <line x1="120" y1="154" x2="120" y2="168" stroke="${GOLD}" stroke-width="7"/>
  <line x1="100" y1="172" x2="140" y2="172" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="106" y1="186" x2="134" y2="186" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 106 122 L 106 92 M 134 122 L 134 92" stroke="${DIM}" stroke-width="5" stroke-linecap="round"/>`;

export const brain = () => `
  <path d="M 116 60 C 92 56 74 74 80 94 C 58 102 58 134 78 142 C 74 166 98 180 116 170 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M 124 60 C 148 56 166 74 160 94 C 182 102 182 134 162 142 C 166 166 142 180 124 170 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <line x1="120" y1="58" x2="120" y2="172" stroke="${DIM}" stroke-width="5"/>`;

export const robot = () => `
  <rect x="62" y="82" width="116" height="96" rx="16" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <circle cx="96" cy="120" r="11" fill="${GOLD}"/>
  <circle cx="144" cy="120" r="11" fill="${GOLD}"/>
  <line x1="98" y1="152" x2="142" y2="152" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>
  <line x1="120" y1="82" x2="120" y2="58" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="120" cy="50" r="9" fill="${GOLD}"/>`;

export const eye = () => `
  <path d="M 42 120 Q 120 62 198 120 Q 120 178 42 120 Z" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <circle cx="120" cy="120" r="26" fill="${GOLD}"/>
  <circle cx="120" cy="120" r="10" fill="${BG}"/>`;

export const fist = () => `
  <rect x="58" y="94" width="94" height="66" rx="24" fill="${GOLD}"/>
  <rect x="148" y="108" width="24" height="40" rx="10" fill="${GOLD}"/>
  <line x1="80" y1="94" x2="80" y2="74" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="104" y1="94" x2="104" y2="68" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="128" y1="94" x2="128" y2="74" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const openHand = () => `
  <path d="M 72 158 Q 66 106 82 104 Q 96 104 96 130" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="98" y1="130" x2="98" y2="72" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="122" y1="130" x2="122" y2="62" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="146" y1="130" x2="146" y2="72" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 72 158 Q 120 196 166 158 Q 172 128 166 110" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const domino = () => `
  <rect x="60" y="92" width="26" height="72" fill="${GOLD}" transform="rotate(-16 73 128)"/>
  <rect x="106" y="86" width="26" height="78" fill="${GOLD}" transform="rotate(-6 119 125)"/>
  <rect x="152" y="80" width="26" height="84" fill="${DIM}"/>`;

export const pillar = () => `
  <line x1="66" y1="62" x2="174" y2="62" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
  <line x1="60" y1="184" x2="180" y2="184" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
  <line x1="88" y1="66" x2="88" y2="180" stroke="${GOLD}" stroke-width="8"/>
  <line x1="120" y1="66" x2="120" y2="180" stroke="${GOLD}" stroke-width="8"/>
  <line x1="152" y1="66" x2="152" y2="180" stroke="${GOLD}" stroke-width="8"/>`;

export const crown = () => `
  <path d="M 52 160 L 66 74 L 102 116 L 120 62 L 138 116 L 174 74 L 188 160 Z" fill="${GOLD}"/>
  <rect x="52" y="164" width="136" height="16" fill="${DIM}"/>`;

export const shield = () => `
  <path d="M 120 48 L 186 76 L 186 124 Q 186 166 120 192 Q 54 166 54 124 L 54 76 Z" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linejoin="round"/>`;

export const key = () => `
  <circle cx="82" cy="110" r="34" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <line x1="106" y1="134" x2="180" y2="182" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="152" y1="152" x2="138" y2="172" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="168" y1="164" x2="154" y2="184" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const lock = () => `
  <rect x="62" y="112" width="116" height="80" rx="12" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <path d="M 86 112 L 86 82 A 34 34 0 0 1 154 82 L 154 112" fill="none" stroke="${GOLD}" stroke-width="8"/>
  <circle cx="120" cy="148" r="11" fill="${GOLD}"/>`;

export const ladder = () => `
  <line x1="82" y1="48" x2="82" y2="192" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="158" y1="48" x2="158" y2="192" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="82" y1="82" x2="158" y2="82" stroke="${GOLD}" stroke-width="7"/>
  <line x1="82" y1="120" x2="158" y2="120" stroke="${GOLD}" stroke-width="7"/>
  <line x1="82" y1="158" x2="158" y2="158" stroke="${GOLD}" stroke-width="7"/>`;

export const mountain = () => `
  <path d="M 34 178 L 94 78 L 130 134 L 154 100 L 206 178 Z" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M 94 78 L 74 110 L 114 110 Z" fill="${GOLD}"/>`;

export const oilDrop = () => `
  <path d="M 120 48 C 120 48 64 118 64 152 A 56 56 0 0 0 176 152 C 176 118 120 48 120 48 Z" fill="${GOLD}"/>`;

export const tulipFlower = () => `
  <path d="M 90 96 C 90 60 150 60 150 96 C 150 122 120 134 120 156" fill="${GOLD}"/>
  <path d="M 80 108 C 60 94 60 70 80 58" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M 160 108 C 180 94 180 70 160 58" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
  <line x1="120" y1="150" x2="120" y2="196" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;

export const book = () => `
  <path d="M 120 76 Q 82 56 48 66 L 48 172 Q 82 162 120 182 Q 158 162 192 172 L 192 66 Q 158 56 120 76 Z" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linejoin="round"/>
  <line x1="120" y1="76" x2="120" y2="182" stroke="${DIM}" stroke-width="6"/>`;

/* ------------------------------ CHART / MARKET ------------------------------ */

export const candleUp = () => `
  <rect x="98" y="82" width="44" height="86" fill="${GOLD}"/>
  <line x1="120" y1="50" x2="120" y2="82" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="168" x2="120" y2="196" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>`;

export const candleDown = () => `
  <rect x="98" y="82" width="44" height="86" fill="none" stroke="${DIM}" stroke-width="8"/>
  <line x1="120" y1="50" x2="120" y2="82" stroke="${DIM}" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="168" x2="120" y2="196" stroke="${DIM}" stroke-width="8" stroke-linecap="round"/>`;

export const trendUp = () => `
  <polyline points="42,178 88,140 118,158 156,92 196,66" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="196,66 168,70 186,90" fill="${GOLD}"/>`;

export const trendDown = () => `
  <polyline points="42,66 88,104 118,86 156,152 196,178" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="196,178 168,174 186,154" fill="${GOLD}"/>`;

export const spikeMark = () => `
  <polyline points="34,140 84,140 108,52 132,196 156,140 206,140" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;

export const rangeBox = () => `
  <rect x="50" y="82" width="140" height="76" fill="none" stroke="${DIM}" stroke-width="6" stroke-dasharray="10 8"/>
  <polyline points="56,140 86,98 116,142 146,100 184,138" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;

export const wave = () => `
  <path d="M 34 120 Q 62 62 90 120 T 146 120 T 202 120" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>`;

export const pulseLine = () => `
  <polyline points="34,120 78,120 96,78 116,162 140,120 206,120" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;

export const grid = () => `
  <g stroke="${DIM}" stroke-width="4" opacity="0.85">
    <line x1="56" y1="60" x2="56" y2="180"/><line x1="96" y1="60" x2="96" y2="180"/>
    <line x1="136" y1="60" x2="136" y2="180"/><line x1="176" y1="60" x2="176" y2="180"/>
    <line x1="48" y1="76" x2="188" y2="76"/><line x1="48" y1="116" x2="188" y2="116"/>
    <line x1="48" y1="156" x2="188" y2="156"/>
  </g>
  <polyline points="56,160 96,120 136,136 176,76" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;

export const pyramid = () => `
  <path d="M 120 52 L 200 184 L 40 184 Z" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linejoin="round"/>
  <line x1="70" y1="142" x2="170" y2="142" stroke="${DIM}" stroke-width="5"/>
  <line x1="94" y1="100" x2="146" y2="100" stroke="${DIM}" stroke-width="5"/>`;

export const tower = () => `
  <rect x="88" y="52" width="64" height="140" fill="none" stroke="${GOLD}" stroke-width="7"/>
  <line x1="88" y1="92" x2="152" y2="92" stroke="${DIM}" stroke-width="5"/>
  <line x1="88" y1="128" x2="152" y2="128" stroke="${DIM}" stroke-width="5"/>
  <line x1="88" y1="164" x2="152" y2="164" stroke="${DIM}" stroke-width="5"/>
  <line x1="72" y1="192" x2="168" y2="192" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>`;

export const bridge = () => `
  <path d="M 34 156 Q 120 74 206 156" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <line x1="34" y1="156" x2="206" y2="156" stroke="${GOLD}" stroke-width="7"/>
  <g stroke="${DIM}" stroke-width="5">
    <line x1="74" y1="118" x2="74" y2="156"/><line x1="120" y1="96" x2="120" y2="156"/>
    <line x1="166" y1="118" x2="166" y2="156"/>
  </g>`;

export const stairsDown = () => `
  <polyline points="40,64 88,64 88,104 136,104 136,146 184,146 184,188 206,188"
            fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;

export const arrowsDiverge = () => `
  <line x1="120" y1="120" x2="52" y2="66" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
  <polygon points="46,60 74,66 62,86" fill="${GOLD}"/>
  <line x1="120" y1="120" x2="188" y2="174" stroke="${DIM}" stroke-width="8" stroke-linecap="round"/>
  <polygon points="194,180 166,174 178,154" fill="${DIM}"/>`;

/* ---------------------------------- BADGES ---------------------------------- */
/* Small modifiers, composed into the corner. Same 240-box convention. */

export const bCrack = () => `
  <polyline points="70,40 120,96 82,128 150,200" fill="none" stroke="${GOLD}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;

export const bBurst = () => `
  <g stroke="${GOLD}" stroke-width="18" stroke-linecap="round">
    <line x1="120" y1="40" x2="120" y2="200"/><line x1="40" y1="120" x2="200" y2="120"/>
    <line x1="62" y1="62" x2="178" y2="178"/><line x1="178" y1="62" x2="62" y2="178"/>
  </g>`;

export const bUp = () => `
  <line x1="120" y1="192" x2="120" y2="76" stroke="${GOLD}" stroke-width="20" stroke-linecap="round"/>
  <polygon points="120,36 74,96 166,96" fill="${GOLD}"/>`;

export const bDown = () => `
  <line x1="120" y1="48" x2="120" y2="164" stroke="${GOLD}" stroke-width="20" stroke-linecap="round"/>
  <polygon points="120,204 74,144 166,144" fill="${GOLD}"/>`;

export const bQuestion = () => `
  <text x="120" y="176" font-family="Georgia, serif" font-size="180" font-weight="700" fill="${GOLD}" text-anchor="middle">?</text>`;

export const bExclaim = () => `
  <text x="120" y="176" font-family="Georgia, serif" font-size="180" font-weight="700" fill="${GOLD}" text-anchor="middle">!</text>`;

export const bPlus = () => `
  <g stroke="${GOLD}" stroke-width="26" stroke-linecap="round">
    <line x1="120" y1="52" x2="120" y2="188"/><line x1="52" y1="120" x2="188" y2="120"/>
  </g>`;

export const bMinus = () => `
  <line x1="46" y1="120" x2="194" y2="120" stroke="${GOLD}" stroke-width="26" stroke-linecap="round"/>`;

export const bClock = () => `
  <circle cx="120" cy="120" r="82" fill="none" stroke="${GOLD}" stroke-width="18"/>
  <line x1="120" y1="120" x2="120" y2="66" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/>
  <line x1="120" y1="120" x2="162" y2="146" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/>`;

export const bFlame = () => `
  <path d="M 120 34 C 150 84 176 96 176 136 A 56 56 0 0 1 64 136 C 64 104 90 96 92 66 C 108 84 104 104 120 110 C 132 96 126 62 120 34 Z" fill="${GOLD}"/>`;

export const bDrop = () => `
  <path d="M 120 32 C 120 32 62 106 62 142 A 58 58 0 0 0 178 142 C 178 106 120 32 120 32 Z" fill="${GOLD}"/>`;

export const bStar = () => `
  <polygon points="120,32 146,98 216,98 160,140 182,206 120,166 58,206 80,140 24,98 94,98" fill="${GOLD}"/>`;

export const bRing = () => `
  <circle cx="120" cy="120" r="80" fill="none" stroke="${GOLD}" stroke-width="24"/>`;

export const bCross = () => `
  <g stroke="${GOLD}" stroke-width="26" stroke-linecap="round">
    <line x1="62" y1="62" x2="178" y2="178"/><line x1="178" y1="62" x2="62" y2="178"/>
  </g>`;

export const bCheck = () => `
  <polyline points="50,126 100,180 194,62" fill="none" stroke="${GOLD}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`;

export const bBolt = () => `
  <polygon points="134,28 66,132 112,132 96,212 176,102 126,102" fill="${GOLD}"/>`;

export const GLYPHS = {
  ship, train, rocket, coin, banknote, vault, scale, gavel, clock, hourglass,
  calendar, magnifier, anchor, chain, globe, flag, swan, bull, bear, dice,
  gauge, bell, bulb, brain, robot, eye, fist, openHand, domino, pillar,
  crown, shield, key, lock, ladder, mountain, oilDrop, tulipFlower, book,
  candleUp, candleDown, trendUp, trendDown, spikeMark, rangeBox, wave,
  pulseLine, grid, pyramid, tower, bridge, stairsDown, arrowsDiverge,
};

export const BADGES = {
  bCrack, bBurst, bUp, bDown, bQuestion, bExclaim, bPlus, bMinus,
  bClock, bFlame, bDrop, bStar, bRing, bCross, bCheck, bBolt,
};
