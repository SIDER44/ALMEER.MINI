/**
 * ALMEER BOT — Plugin: restart.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 *
 * Exits with code 2 → start.js wrapper catches it, runs git pull + npm install,
 * then relaunches the bot. Bot stays "online" during the update (only ~5–10s gap).
 */

export default {
  name: 'restart',
  aliases: ['reboot', 'rs', 'update'],
  category: 'general',
  description: 'restart bot & pull latest updates from GitHub',
  owner: true,
  async run({ sock, m, chat, reply, log }) {
    log.warn('🔄 Restart + update requested by owner');

    await reply(
      '╭━━〔 *🔄 RESTARTING & UPDATING* 〕━━┈⊷\n' +
      '┃\n' +
      '┃  ✅ Restart signal sent!\n' +
      '┃  📦 Pulling latest updates from GitHub...\n' +
      '┃  📲 Bot will reconnect automatically.\n' +
      '┃  ⏳ Back online in ~10 seconds.\n' +
      '┃\n' +
      '╰━━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷'
    );

    // Give WhatsApp time to deliver the message before we exit
    await new Promise(r => setTimeout(r, 2000));

    log.warn('Exiting with code 2 → wrapper will git pull and relaunch...');

    // Exit code 2 = intentional restart signal for start.js
    // start.js catches this, runs git pull + npm install, then relaunches
    process.exit(2);
  },
};
