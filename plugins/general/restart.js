/**
 * ALMEER BOT — Plugin: restart.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 */

export default {
  name: 'restart',
  aliases: ['reboot', 'rs'],
  category: 'general',
  description: 'restart the bot process',
  owner: true,
  async run({ sock, m, chat, reply, log }) {
    log.warn('🔄 Restart requested by owner');

    await reply(
      '╭━━〔 *🔄 RESTARTING* 〕━━┈⊷\n' +
      '┃ ✅ Restart initiated...\n' +
      '┃ ⏳ Bot will be back shortly.\n' +
      '┃ 📡 Reconnecting automatically.\n' +
      '╰━━━━━━━━━━━━━━━━━━━━━┈⊷'
    );

    // Wait for the message to send before exiting
    await new Promise(r => setTimeout(r, 1500));

    log.warn('Process exiting for restart...');
    process.exit(0); // process manager (pm2 / pterodactyl) will restart
  },
};
