/**
 * ALMEER BOT — Plugin: menu.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 */
import fetch from 'node-fetch';

// Cypher-X inspired menu
export default {
  name: 'menu',
  aliases: ['help', 'commands', 'list'],
  category: 'general',
  description: 'show all commands',
  async run({ sock, m, chat, reply, settings, ownerJid, uptimeStr, webServerStarted, PORT, LOGO_PATH, commandsByCategory }) {
    const cats = commandsByCategory();
    const prefix = settings.prefix || '.';
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const date = now.toDateString();
    const totalCmds = Object.values(cats).reduce((a, b) => a + b.length, 0);

    let body =
      '╭━━〔 *⚡ ALMEER MINI ⚡* 〕━━┈⊷\n' +
      '┃▸╭───────────────────\n' +
      `┃▸┃ ✦ Owner   : ${ownerJid?.split('@')[0] || '—'}\n` +
      `┃▸┃ ✦ Mode    : ${(settings.mode || 'private').toUpperCase()}\n` +
      `┃▸┃ ✦ Prefix  : [ ${prefix} ]\n` +
      `┃▸┃ ✦ Uptime  : ${uptimeStr()}\n` +
      `┃▸┃ ✦ Plugins : ${totalCmds}\n` +
      `┃▸┃ ✦ Time    : ${time}\n` +
      `┃▸┃ ✦ Date    : ${date}\n` +
      `┃▸┃ ✦ Web     : ${webServerStarted ? `:${PORT}` : 'CLI'}\n` +
      '┃▸╰───────────────────\n' +
      '╰━━━━━━━━━━━━━━━━━━━┈⊷\n';

    for (const cat of Object.keys(cats).sort()) {
      body += `\n╭━━━〔 *${cat.toUpperCase()}* 〕━━━┈⊷\n`;
      body += '┃╭────────────────\n';
      for (const c of cats[cat]) {
        body += `┃│ ✦ ${prefix}${c.name}\n`;
      }
      body += '┃╰────────────────\n';
      body += '╰━━━━━━━━━━━━━━━━━┈⊷\n';
    }

    body += '\n> ⚡ _Powered by Almeer Mini_';

    // Use URL logo — no local file needed, keeps repo lean
    try {
      const isUrl = typeof LOGO_PATH === 'string' && LOGO_PATH.startsWith('http');
      if (isUrl) {
        return sock.sendMessage(chat, { image: { url: LOGO_PATH }, caption: body }, { quoted: m });
      }
    } catch {}
    return reply(body);
  },
};
