/**
 * ALMEER BOT — Plugin: tiktokaudio.js
 * © 2026 ALMEER / SIDER44 (github.com/SIDER44). All rights reserved.
 * Unauthorized redistribution or rebranding is prohibited. See LICENSE.
 */
import fetch from 'node-fetch';

export default {
  name: 'tiktokaudio',
  aliases: ['ttaudio', 'ttmp3', 'ttsound'],
  category: 'downloads',
  description: 'download tiktok audio/sound only',
  async run({ sock, m, chat, argText, reply }) {
    const url = argText.match(/https?:\/\/\S+/)?.[0];
    if (!url) return reply('usage: .tiktokaudio <tiktok url>');

    await sock.sendMessage(chat, { react: { text: '⏳', key: m.key } });

    try {
      const r = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
      const j = await r.json();

      if (!j?.data) return reply('❌ TikTok API error — check the URL and try again.');

      const audioUrl = j.data.music || j.data.play;
      if (!audioUrl) return reply('❌ No audio found for this TikTok.');

      const title   = j.data.title || 'TikTok Audio';
      const author  = j.data.author?.unique_id || 'unknown';
      const music   = j.data.music_info?.title || 'Original Sound';
      const artist  = j.data.music_info?.author || author;

      const caption =
        `🎵 *${title}*\n` +
        `👤 Creator: @${author}\n` +
        `🎶 Sound  : ${music} — ${artist}`;

      await sock.sendMessage(chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${author}_audio.mp3`,
      }, { quoted: m });

      await sock.sendMessage(chat, { text: caption }, { quoted: m });
      await sock.sendMessage(chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
      await sock.sendMessage(chat, { react: { text: '❌', key: m.key } });
      reply('❌ Error: ' + e.message);
    }
  },
};
