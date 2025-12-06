import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'facebook',
  aliases: ['fb', 'fbdl'],
  description: 'Download Facebook videos! 📘',
  usage: '.facebook <url>',
  category: 'Download',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📘 *FACEBOOK DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing Facebook URL!*

📝 *Usage:* 
   ${config.bot.preffix}facebook <url>

💡 *Example:* 
   ${config.bot.preffix}fb https://facebook.com/...

🎬 Works with posts, reels, and videos!`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/download/facebook?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📘 *FACEBOOK MAGIC* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Processing Facebook video...*
🔍 Extracting media...
⚡ Preparing HD download...

_Quality content incoming!_ 🎬`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const video = data.result;
        const videoUrl = video.hd_video || video.sd_video;
        
        if (!videoUrl) {
          await sock.sendMessage(jid.chat, { 
            text: `❌ *No video found!*

This post might not contain a video or it's private.`
          }, { quoted: message });
        }

        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  📘 *FACEBOOK VIDEO* 
┗━━━━━━━━━━━━━━━━━━┛

📝 *Title:* ${video.title}
⏱️ *Duration:* ${video.duration}
🎯 *Quality:* ${video.hd_video ? 'HD 720p' : 'SD 360p'}

━━━━━━━━━━━━━━━━━━
_Downloaded via ${config.bot.name}_ 🤖`;

        await sock.sendMessage(jid.chat, {
          video: { url: videoUrl },
          caption: caption,
          contextInfo: {
            externalAdReply: {
              title: '📘 Facebook Video',
              body: video.title,
              thumbnailUrl: video.thumbnail,
              sourceUrl: url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Download Failed!*

Make sure:
• URL is valid
• Video is public
• Link is complete`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Facebook download error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};