/**
 * ALMEER BOT — Plugin: updates.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 */
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const REPO_API  = 'https://api.github.com/repos/SIDER44/ALMEER.MINI/commits?per_page=5';
const REPO_URL  = 'https://github.com/SIDER44/ALMEER.MINI';

function getLocalVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
    return pkg.version || '1.0.0';
  } catch {
    return 'unknown';
  }
}

export default {
  name: 'updates',
  aliases: ['update', 'changelog', 'version'],
  category: 'general',
  description: 'check for ALMEER bot updates on GitHub',
  owner: true,
  async run({ sock, m, chat, reply, log }) {
    await sock.sendMessage(chat, { react: { text: '🔍', key: m.key } });

    const localVersion = getLocalVersion();

    try {
      const res = await fetch(REPO_API, {
        headers: { 'User-Agent': 'ALMEER-Bot', 'Accept': 'application/vnd.github.v3+json' },
      });

      if (!res.ok) {
        return reply(
          '╭━━〔 *📦 BOT VERSION* 〕━━┈⊷\n' +
          `┃ 🏷️ Current : v${localVersion}\n` +
          `┃ ⚠️ GitHub  : Could not reach API\n` +
          `┃ 🔗 Repo    : ${REPO_URL}\n` +
          '╰━━━━━━━━━━━━━━━━━━━┈⊷'
        );
      }

      const commits = await res.json();

      if (!Array.isArray(commits) || commits.length === 0) {
        return reply('⚠️ No commits found from GitHub.');
      }

      const latest = commits[0];
      const latestSha   = latest.sha.slice(0, 7);
      const latestDate  = new Date(latest.commit.author.date).toLocaleString();
      const latestMsg   = latest.commit.message.split('\n')[0];
      const latestAuthor = latest.commit.author.name;

      let body =
        '╭━━〔 *📦 UPDATE CHECK* 〕━━┈⊷\n' +
        `┃ 🏷️ Your version : v${localVersion}\n` +
        `┃ 🌐 Latest commit : ${latestSha}\n` +
        `┃ 👤 By            : ${latestAuthor}\n` +
        `┃ 📅 Date          : ${latestDate}\n` +
        `┃ 📝 Changes       : ${latestMsg}\n` +
        '┃\n' +
        '┃ 📜 *Recent commits:*\n';

      for (const c of commits.slice(1)) {
        const sha  = c.sha.slice(0, 7);
        const msg  = c.commit.message.split('\n')[0].slice(0, 50);
        const date = new Date(c.commit.author.date).toLocaleDateString();
        body += `┃ • [${sha}] ${msg} (${date})\n`;
      }

      body +=
        '┃\n' +
        `┃ 🔗 ${REPO_URL}\n` +
        '┃\n' +
        '┃ 💡 To update: pull latest from GitHub\n' +
        '╰━━━━━━━━━━━━━━━━━━━━━━━┈⊷';

      await sock.sendMessage(chat, { react: { text: '✅', key: m.key } });
      return reply(body);
    } catch (e) {
      log.err('updates cmd error', e?.message);
      await sock.sendMessage(chat, { react: { text: '❌', key: m.key } });
      return reply('❌ Failed to check updates: ' + e.message);
    }
  },
};
