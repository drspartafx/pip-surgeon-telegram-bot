// Project integrity audit. Run with: node scripts/auditProject.js
//
// WHY THIS EXISTS: a refactor once silently deleted `sendTelegramPoll` from
// lib/telegram.js while three scripts still imported it. Everything still *parsed*
// fine — the failure only appeared at runtime, which for a weekly post could mean
// weeks of silence before anyone noticed. This script catches that class of bug
// statically.
//
// Checks:
//   1. Every named import in src/ and lib/ resolves to a real export in the target file
//   2. Every relative import path points at a file that exists
//   3. Every mode offered in the workflow dropdown is wired in the case statement
//   4. Every script the workflow invokes exists on disk
//   5. Every script in src/ is actually reachable from the workflow
//
// Exits 1 on any problem.

import { readFileSync, readdirSync, existsSync } from "fs";
import { dirname, resolve, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];

function read(p) {
  return readFileSync(resolve(ROOT, p), "utf8");
}

function listJs(dir) {
  const full = resolve(ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full).filter((f) => f.endsWith(".js")).map((f) => `${dir}/${f}`);
}

const sourceFiles = [...listJs("src"), ...listJs("lib"), ...listJs("scripts")];

// Collect exported names per file.
const exportsByFile = new Map();
for (const f of sourceFiles) {
  const src = read(f);
  const names = new Set();
  for (const m of src.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+const\s+(\w+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+\{([^}]+)\}/g)) {
    m[1].split(",").forEach((n) => names.add(n.trim().split(/\s+as\s+/).pop().trim()));
  }
  exportsByFile.set(f, names);
}

// 1 & 2. Verify every named import resolves.
for (const f of sourceFiles) {
  const src = read(f);
  const dir = dirname(resolve(ROOT, f));

  for (const m of src.matchAll(/import\s+\{([^}]+)\}\s+from\s+"(\.[^"]+)"/g)) {
    const names = m[1].split(",").map((n) => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const targetAbs = resolve(dir, m[2]);
    const targetRel = relative(ROOT, targetAbs).replace(/\\/g, "/");

    if (!existsSync(targetAbs)) {
      problems.push(`BROKEN IMPORT PATH: ${f} imports "${m[2]}" which does not exist.`);
      continue;
    }
    const available = exportsByFile.get(targetRel);
    if (!available) continue; // outside scanned dirs — skip rather than false-alarm
    for (const n of names) {
      if (!available.has(n)) {
        problems.push(`MISSING EXPORT: ${f} imports { ${n} } from "${m[2]}", but that file does not export it.`);
      }
    }
  }

  // Default/namespace imports only need the path to exist.
  for (const m of src.matchAll(/import\s+(?:\w+|\*\s+as\s+\w+)\s+from\s+"(\.[^"]+)"/g)) {
    if (!existsSync(resolve(dir, m[1]))) {
      problems.push(`BROKEN IMPORT PATH: ${f} imports "${m[1]}" which does not exist.`);
    }
  }
}

// 3, 4, 5. Workflow wiring.
const wfPath = ".github/workflows/telegram-automation.yml";
if (!existsSync(resolve(ROOT, wfPath))) {
  problems.push(`MISSING WORKFLOW: ${wfPath} not found.`);
} else {
  const wf = read(wfPath);

  const optionsBlock = wf.match(/options:\s*((?:\s*-\s*\w+\s*)+)/);
  const dropdownModes = optionsBlock
    ? [...optionsBlock[1].matchAll(/-\s*(\w+)/g)].map((m) => m[1])
    : [];

  const caseBlock = wf.match(/case\s+"[^"]*"\s+in([\s\S]*?)esac/);
  const caseBody = caseBlock ? caseBlock[1] : "";
  const wiredModes = [...caseBody.matchAll(/^\s*(\w+)\)/gm)].map((m) => m[1]);

  for (const mode of dropdownModes) {
    if (!wiredModes.includes(mode)) {
      problems.push(`UNWIRED MODE: "${mode}" is offered in the workflow dropdown but has no case branch.`);
    }
  }
  for (const mode of wiredModes) {
    if (mode !== "*" && !dropdownModes.includes(mode)) {
      problems.push(`HIDDEN MODE: "${mode}" has a case branch but isn't in the dropdown (can't be run manually).`);
    }
  }

  const invoked = [...caseBody.matchAll(/node\s+(src\/[\w.]+\.js)/g)].map((m) => m[1]);
  for (const s of new Set(invoked)) {
    if (!existsSync(resolve(ROOT, s))) {
      problems.push(`MISSING SCRIPT: workflow invokes "${s}" which does not exist.`);
    }
  }
  for (const s of listJs("src")) {
    if (!invoked.includes(s)) {
      problems.push(`ORPHANED SCRIPT: "${s}" exists but is never invoked by the workflow.`);
    }
  }

  console.log(`Workflow modes:           ${dropdownModes.length} offered, ${wiredModes.filter((m) => m !== "*").length} wired`);
}

console.log(`Source files scanned:     ${sourceFiles.length}`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problem(s) found:\n`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("\n✅ Project integrity OK: all imports resolve, all workflow modes wired, no orphaned scripts.");
