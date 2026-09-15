// Full icon + topic audit. Run with: node scripts/auditIcons.js
//
// Validates BOTH icon systems in use:
//   - legacy named icons  -> icon: "goldBar"            (lib/icons.js)
//   - composed icons      -> icon: { glyph, badge }     (lib/glyphs.js + composeIcon.js)
//
// Checks (all hard-fail): reserved-icon leaks, duplicate system icons, missing icon/
// glyph/badge references, duplicate educational icons, duplicate compositions,
// duplicate titles, duplicate topic bodies, and a parse-count cross-check so a
// malformed topic can't silently hide from the audit.

import { readFileSync } from "fs";
import { ICONS } from "../lib/icons.js";
import { GLYPHS, BADGES } from "../lib/glyphs.js";
import { SYSTEM_ICONS, RESERVED_ICON_NAMES, SYSTEM_COMPOSITIONS, RESERVED_COMPOSITION_KEYS } from "../lib/iconAssignments.js";

const problems = [];
const availableIcons = Object.keys(ICONS);
const availableGlyphs = Object.keys(GLYPHS);
const availableBadges = Object.keys(BADGES);

const eduSource = readFileSync(new URL("../src/postEducational.js", import.meta.url), "utf8");

const legacy = [...eduSource.matchAll(/topic:\s*"((?:[^"\\]|\\.)*)",\s*title:\s*"([^"]+)",\s*icon:\s*"([^"]+)"/g)]
  .map((m) => ({ body: m[1], title: m[2], icon: m[3] }));

const composed = [...eduSource.matchAll(/topic:\s*"((?:[^"\\]|\\.)*)",\s*title:\s*"([^"]+)",\s*icon:\s*\{\s*glyph:\s*"([^"]+)",\s*badge:\s*"([^"]+)"\s*\}/g)]
  .map((m) => ({ body: m[1], title: m[2], glyph: m[3], badge: m[4] }));

const total = legacy.length + composed.length;
if (total === 0) problems.push("Parsed zero topics — has the format of postEducational.js changed?");

const rawTitleCount = (eduSource.match(/title:\s*"/g) || []).length;
if (rawTitleCount !== total) {
  problems.push(`PARSE MISMATCH: found ${rawTitleCount} "title:" entries but parsed ${total}. A topic is malformed.`);
}

for (const { title, icon } of legacy) {
  if (RESERVED_ICON_NAMES.includes(icon)) {
    problems.push(`RESERVED ICON REUSED: educational topic "${title}" uses "${icon}", reserved for a system post.`);
  }
}

const sysSeen = new Map();
for (const [postType, icon] of Object.entries(SYSTEM_ICONS)) {
  if (sysSeen.has(icon)) problems.push(`DUPLICATE SYSTEM ICON: "${icon}" used by "${sysSeen.get(icon)}" and "${postType}".`);
  else sysSeen.set(icon, postType);
}

for (const { title, icon } of legacy) {
  if (!availableIcons.includes(icon)) problems.push(`MISSING ICON: "${icon}" (topic "${title}") not defined in lib/icons.js.`);
}
for (const icon of RESERVED_ICON_NAMES) {
  if (!availableIcons.includes(icon)) problems.push(`MISSING SYSTEM ICON: "${icon}" not defined in lib/icons.js.`);
}

for (const { title, glyph, badge } of composed) {
  if (!availableGlyphs.includes(glyph)) problems.push(`MISSING GLYPH: "${glyph}" (topic "${title}") not in lib/glyphs.js.`);
  if (!availableBadges.includes(badge)) problems.push(`MISSING BADGE: "${badge}" (topic "${title}") not in lib/glyphs.js.`);
}

const legacySeen = new Map();
for (const { title, icon } of legacy) {
  if (legacySeen.has(icon)) problems.push(`DUPLICATE ICON: "${icon}" used by "${legacySeen.get(icon)}" and "${title}".`);
  else legacySeen.set(icon, title);
}

const compSeen = new Map();
for (const { title, glyph, badge } of composed) {
  const key = `${glyph}+${badge}`;
  if (compSeen.has(key)) problems.push(`DUPLICATE COMPOSITION: "${key}" used by "${compSeen.get(key)}" and "${title}".`);
  else compSeen.set(key, title);
}

const titleSeen = new Set();
for (const t of [...legacy, ...composed].map((x) => x.title)) {
  if (titleSeen.has(t)) problems.push(`DUPLICATE TITLE: "${t}" appears more than once.`);
  titleSeen.add(t);
}

const bodySeen = new Set();
for (const b of [...legacy, ...composed].map((x) => x.body)) {
  if (bodySeen.has(b)) problems.push(`DUPLICATE TOPIC BODY: "${b.slice(0, 60)}..." appears twice.`);
  bodySeen.add(b);
}

// System compositions must be valid, unique among themselves, and must not be
// reused by any educational topic.
const sysCompSeen = new Map();
for (const [postType, comp] of Object.entries(SYSTEM_COMPOSITIONS)) {
  if (!availableGlyphs.includes(comp.glyph)) {
    problems.push(`MISSING GLYPH: system post "${postType}" uses glyph "${comp.glyph}", not in lib/glyphs.js.`);
  }
  if (!availableBadges.includes(comp.badge)) {
    problems.push(`MISSING BADGE: system post "${postType}" uses badge "${comp.badge}", not in lib/glyphs.js.`);
  }
  const key = `${comp.glyph}+${comp.badge}`;
  if (sysCompSeen.has(key)) {
    problems.push(`DUPLICATE SYSTEM COMPOSITION: "${key}" used by "${sysCompSeen.get(key)}" and "${postType}".`);
  } else sysCompSeen.set(key, postType);
}
for (const { title, glyph, badge } of composed) {
  const key = `${glyph}+${badge}`;
  if (RESERVED_COMPOSITION_KEYS.includes(key)) {
    problems.push(`RESERVED COMPOSITION REUSED: educational topic "${title}" uses "${key}", reserved for a system post.`);
  }
}

console.log(`Named icons defined:      ${availableIcons.length}`);
console.log(`Glyphs defined:           ${availableGlyphs.length}`);
console.log(`Badges defined:           ${availableBadges.length}`);
console.log(`Possible compositions:    ${availableGlyphs.length * availableBadges.length}`);
console.log(`Educational topics:       ${total}  (${legacy.length} named-icon, ${composed.length} composed)`);
console.log(`System posts:             ${Object.keys(SYSTEM_ICONS).length} named + ${Object.keys(SYSTEM_COMPOSITIONS).length} composed`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problem(s) found:\n`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("\n✅ All checks passed: unique icons, valid references, no duplicate topics.");
