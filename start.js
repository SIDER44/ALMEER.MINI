/**
 * ALMEER MINI — start.js
 * Self-updating launcher wrapper.
 *
 * HOW IT WORKS:
 *   1. This script is what Pterodactyl / Railway / pm2 actually runs.
 *   2. It spawns index.js as a child process.
 *   3. When index.js exits with code 2 (restart signal), this wrapper:
 *        a. Runs `git pull` to grab latest code from GitHub
 *        b. Runs `npm install` in case dependencies changed
 *        c. Re-spawns index.js  →  bot is back online within seconds
 *   4. Any other exit code (crash) → it just relaunches after a short delay.
 *   5. Ctrl-C / SIGTERM cleanly kills everything.
 *
 * CHANGE YOUR PANEL START COMMAND TO:
 *   node start.js
 */

import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── config ────────────────────────────────────────────────────────────────────
const BOT_SCRIPT   = path.join(__dirname, 'index.js');
const RESTART_CODE = 2;          // exit code the bot sends when .restart is used
const CRASH_DELAY  = 4_000;      // ms to wait before restarting after a crash
const UPDATE_TIMEOUT = 60_000;   // max ms to wait for git pull / npm install

// ── logger ────────────────────────────────────────────────────────────────────
const ts  = () => chalk.gray(new Date().toLocaleTimeString('en-US', { hour12: false }));
const log = {
  info: (...a) => console.log(ts(), chalk.cyan.bold('[ WRAP  ]'), chalk.cyan(...a)),
  ok:   (...a) => console.log(ts(), chalk.green.bold('[  OK   ]'), chalk.green(...a)),
  warn: (...a) => console.log(ts(), chalk.yellow.bold('[ WARN  ]'), chalk.yellow(...a)),
  err:  (...a) => console.log(ts(), chalk.red.bold('[ ERROR ]'), chalk.red(...a)),
};

// ── run a shell command, stream its output, resolve when done ─────────────────
function run(cmd, args, label) {
  return new Promise((resolve) => {
    log.info(`${label} → ${cmd} ${args.join(' ')}`);
    const p = spawn(cmd, args, { cwd: __dirname, stdio: 'inherit', shell: false });
    const timer = setTimeout(() => {
      log.warn(`${label} timed out — skipping`);
      try { p.kill(); } catch {}
      resolve(false);
    }, UPDATE_TIMEOUT);
    p.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) { log.ok(`${label} done`); resolve(true); }
      else            { log.warn(`${label} exited ${code}`); resolve(false); }
    });
    p.on('error', (e) => { clearTimeout(timer); log.warn(`${label} error: ${e.message}`); resolve(false); });
  });
}

// ── pull latest code from GitHub ──────────────────────────────────────────────
async function pullUpdates() {
  log.info('pulling latest code from GitHub...');
  const pulled = await run('git', ['pull', '--ff-only'], 'git pull');
  if (pulled) {
    // Install any new/changed packages
    await run('npm', ['install', '--omit=dev', '--no-audit', '--no-fund'], 'npm install');
  }
}

// ── main loop ─────────────────────────────────────────────────────────────────
let child  = null;
let running = true;

async function launch() {
  if (!running) return;

  log.info('starting bot...');

  child = spawn('node', [BOT_SCRIPT], {
    cwd:   __dirname,
    stdio: 'inherit',
    env:   process.env,
  });

  child.on('error', (e) => log.err('spawn error:', e.message));

  child.on('close', async (code, signal) => {
    child = null;
    if (!running) return;

    if (signal === 'SIGTERM' || signal === 'SIGKILL') {
      log.warn(`bot killed by signal ${signal} — relaunching in ${CRASH_DELAY / 1000}s...`);
      setTimeout(launch, CRASH_DELAY);
      return;
    }

    if (code === RESTART_CODE) {
      // ── INTENTIONAL RESTART: pull updates first ──────────────────────────
      console.log('');
      console.log(chalk.magenta('━'.repeat(52)));
      console.log(chalk.cyan.bold('  🔄  RESTART SIGNAL RECEIVED — PULLING UPDATES'));
      console.log(chalk.magenta('━'.repeat(52)));
      await pullUpdates();
      console.log(chalk.magenta('━'.repeat(52)));
      console.log(chalk.green.bold('  ✅  RELAUNCHING BOT...'));
      console.log(chalk.magenta('━'.repeat(52) + '\n'));
      launch();
    } else {
      // ── CRASH / unexpected exit ──────────────────────────────────────────
      log.warn(`bot exited with code ${code ?? '?'} — restarting in ${CRASH_DELAY / 1000}s...`);
      setTimeout(launch, CRASH_DELAY);
    }
  });
}

// ── clean shutdown ────────────────────────────────────────────────────────────
function shutdown(sig) {
  log.warn(`${sig} received — shutting down`);
  running = false;
  if (child) { try { child.kill('SIGTERM'); } catch {} }
  setTimeout(() => process.exit(0), 2000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', (e) => log.err('wrapper uncaught:', e?.message));

// ── banner + start ────────────────────────────────────────────────────────────
console.log('');
console.log(chalk.magenta('━'.repeat(52)));
console.log(chalk.cyan.bold('  ⚡  ALMEER MINI — SELF-UPDATING WRAPPER'));
console.log(chalk.magenta('━'.repeat(52)));
console.log(chalk.white('  Restart signal : exit code 2'));
console.log(chalk.white('  Auto-update    : git pull + npm install on restart'));
console.log(chalk.magenta('━'.repeat(52) + '\n'));

launch();
  
