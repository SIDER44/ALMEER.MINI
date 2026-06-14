/**
 * ALMEER BOT — Plugin: statusdelay.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 */

export default {
  name: 'statusdelay',
  aliases: ['sdelay', 'statuswait'],
  category: 'general',
  description: 'delay the bot response in seconds (simulate typing pause)',
  owner: true,
  async run({ sock, m, chat, args, reply, log }) {
    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 1 || seconds > 300) {
      return reply(
        '╭━━〔 *⏱️ STATUS DELAY* 〕━━┈⊷\n' +
        '┃ Usage: .statusdelay <seconds>\n' +
        '┃ Min: 1s  ·  Max: 300s\n' +
        '┃\n' +
        '┃ Example:\n' +
        '┃   .statusdelay 5   → wait 5 seconds\n' +
        '┃   .statusdelay 60  → wait 1 minute\n' +
        '╰━━━━━━━━━━━━━━━━━━━┈⊷'
      );
    }

    await reply(`⏳ *Status delay started!*\nWaiting *${seconds} second(s)* before next action...`);

    // Show composing presence during delay
    try { await sock.sendPresenceUpdate('composing', chat); } catch {}

    await new Promise(r => setTimeout(r, seconds * 1000));

    try { await sock.sendPresenceUpdate('paused', chat); } catch {}

    log.ok(`statusdelay: waited ${seconds}s in ${chat}`);
    return reply(
      `✅ *Delay complete!*\n` +
      `┌─────────────────\n` +
      `│ ⏱️ Waited: ${seconds} second(s)\n` +
      `│ 💬 Chat : ${chat.endsWith('@g.us') ? 'group' : 'DM'}\n` +
      `└─────────────────`
    );
  },
};
