/**
 * ALMEER BOT - Code Protection Build Script
 * © 2026 ALMEER / SIDER44. All rights reserved.
 * 
 * Run: node build-protected.js
 * Output: ./dist/ (deploy this folder, NOT the source)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── config ──────────────────────────────────────────────────────
const SRC_DIR  = path.resolve(__dirname);
const DIST_DIR = path.resolve(__dirname, 'dist');

// Files/dirs to skip (not obfuscated, just copied)
const COPY_AS_IS = [
  'node_modules', 'dist', 'auth_info', '.env',
  'package.json', 'package-lock.json', 'railway.json',
  '.gitignore', '.env.example', 'README.md',
];

// Obfuscation settings — high protection, still runs on Node 20
const OBFUSCATOR_OPTIONS = [
  '--compact true',
  '--control-flow-flattening true',
  '--control-flow-flattening-threshold 0.75',
  '--dead-code-injection true',
  '--dead-code-injection-threshold 0.4',
  '--identifier-names-generator hexadecimal',
  '--rename-globals false',           // keep ESM exports working
  '--self-defending true',            // breaks if code is reformatted
  '--string-array true',
  '--string-array-encoding rc4',
  '--string-array-threshold 0.75',
  '--unicode-escape-sequence false',
  '--target node',
].join(' ');
// ────────────────────────────────────────────────────────────────

function walkJS(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (COPY_AS_IS.includes(entry.name)) continue;
    if (entry.isDirectory()) out.push(...walkJS(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// ── clean dist ───────────────────────────────────────────────────
if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true });
ensureDir(DIST_DIR);

// ── copy non-JS assets ───────────────────────────────────────────
const COPY_ITEMS = [
  'package.json', 'package-lock.json', 'railway.json',
  '.gitignore', '.env.example', 'public', 'lib/timeparser.js',
];
// We'll obfuscate lib/*.js ourselves, so only copy the static assets
function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
for (const item of COPY_ITEMS) {
  const src = path.join(SRC_DIR, item);
  const dest = path.join(DIST_DIR, item);
  if (!fs.existsSync(src)) continue;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) copyDir(src, dest);
  else { ensureDir(path.dirname(dest)); fs.copyFileSync(src, dest); }
}

// ── add LICENSE to dist ──────────────────────────────────────────
fs.copyFileSync(path.join(SRC_DIR, 'LICENSE'), path.join(DIST_DIR, 'LICENSE'));

// ── obfuscate JS files ───────────────────────────────────────────
const jsFiles = walkJS(SRC_DIR);
let obfCount = 0;

for (const file of jsFiles) {
  const rel  = path.relative(SRC_DIR, file);
  const dest = path.join(DIST_DIR, rel);
  ensureDir(path.dirname(dest));

  try {
    execSync(
      `npx javascript-obfuscator "${file}" --output "${dest}" ${OBFUSCATOR_OPTIONS}`,
      { stdio: 'pipe' }
    );
    console.log(`✔  obfuscated  ${rel}`);
    obfCount++;
  } catch (e) {
    // fallback: just copy if obfuscator fails on a file
    fs.copyFileSync(file, dest);
    console.warn(`⚠  copy-only   ${rel}  (obfuscator failed)`);
  }
}

console.log(`\n✅  Build complete → ${DIST_DIR}`);
console.log(`   Obfuscated: ${obfCount} / ${jsFiles.length} JS files`);
console.log(`\n   Deploy the  dist/  folder to Railway.`);
console.log(`   Never publish the  src/  folder publicly.\n`);
