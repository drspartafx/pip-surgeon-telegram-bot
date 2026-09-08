// Icon collision audit. Run with: node scripts/auditIcons.js
//
// Catches three classes of problem before they ever reach the channel:
//   1. A system post using an icon that's also in the educational topic pool
//   2. Two educational topics sharing the same icon
//   3. Any assignment pointing at an icon that doesn't actually exist in lib/icons.js
//
// Exits with code 1 on any problem, so it can be wired into CI later if wanted.

import { readFileSync } from "fs";
import { ICONS } from "../lib/icons.js";
import { SYSTEM_ICONS, RESERVED_ICON_NAMES } from "../lib/iconAssignments.js";

const problems = [];
const availableIcons = Object.keys(ICONS);

// Pull the educational topic icons straight out of the source file, so the audit
// reflects what's actually committed rather than a copy that can drift.
const eduSource = readFileSync(new URL("../src/postEducational.js", import.meta.url), "utf8");
const eduIconMatches = [...eduSource.matchAll(/title:\s*"([^"]+)",\s*icon:\s*"([^"]+)"/g)];
const eduAssignments = eduIconMatches.map((m) => ({ title: m[1], icon: m[2] }));

if (eduAssignments.length === 0) {
  problems.push("Could not parse any educational icon assignments — has the format of postEducational.js changed?");
}

// 1. System icons must not appear in the educational pool.
for (const { title, icon } of eduAssignments) {
  if (RESERVED_ICON_NAMES.includes(icon)) {
    problems.push(`RESERVED ICON REUSED: educational topic "${title}" uses "${icon}", which is reserved for a system post.`);
  }
}

// 2. No two educational topics may share an icon.
const seen = new Map();
for (const { title, icon } of eduAssignments) {
  if (seen.has(icon)) {
    problems.push(`DUPLICATE: "${icon}" used by both "${seen.get(icon)}" and "${title}".`);
  } else {
    seen.set(icon, title);
  }
}

// 3. No two system posts may share an icon.
const systemSeen = new Map();
for (const [postType, icon] of Object.entries(SYSTEM_ICONS)) {
  if (systemSeen.has(icon)) {
    problems.push(`DUPLICATE: system icon "${icon}" used by both "${systemSeen.get(icon)}" and "${postType}".`);
  } else {
    systemSeen.set(icon, postType);
  }
}

// 4. Every assignment must point at a real icon.
const allAssigned = [...eduAssignments.map((a) => a.icon), ...RESERVED_ICON_NAMES];
for (const icon of allAssigned) {
  if (!availableIcons.includes(icon)) {
    problems.push(`MISSING ICON: "${icon}" is assigned but not defined in lib/icons.js.`);
  }
}

// Report
console.log(`Icons defined:            ${availableIcons.length}`);
console.log(`Educational assignments:  ${eduAssignments.length}`);
console.log(`System assignments:       ${Object.keys(SYSTEM_ICONS).length}`);

const unused = availableIcons.filter((i) => !allAssigned.includes(i));
if (unused.length) {
  console.log(`Unused icons (fine, just informational): ${unused.join(", ")}`);
}

if (problems.length) {
  console.error(`\n❌ ${problems.length} problem(s) found:\n`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}

console.log("\n✅ No icon collisions. Every post type has its own icon.");
