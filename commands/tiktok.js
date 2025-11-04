// ========================================
// TIKTOK DOWNLOADER - tiktok.js
// ========================================
import config from '../config.js';

export default {
  name: 'tiktok',
  description: 'Download TikTok videos with style! 🎬',
  usage: '.tiktok <url>',
  category: 'Download',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎬 *TIKTOK DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Oops!* You forgot the URL!

📝 *Usage:* 
   ${config.bot.preffix}tiktok <url>

💡 *Example:* 
   ${config.bot.preffix}tiktok https://vm.tiktok.com/ZMrgKWmVd/

🔗 Just paste any TikTok link and watch the magic! ✨`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/download/tiktokdlv4?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      // Send exciting loading message
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎬 *TIKTOK MAGIC* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Processing your TikTok...*
🔍 Fetching video data...
⚡ Preparing download...

_Please wait, this won't take long!_ 💫`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const content = data.result;
        
        // Create stunning caption
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  ✨ *TIKTOK VIDEO* 
┗━━━━━━━━━━━━━━━━━━┛

📝 *Title:*
   ${content.title || 'No title available'}

👤 *Creator:* @${content.username}

━━━━━━━━━━━━━━━━━━

🎵 *Audio Track Available!*
💾 *High Quality Download*

━━━━━━━━━━━━━━━━━━
_Downloaded via ${config.bot.name}_ 🤖`;

        // Send the video with thumbnail
        if (content.videoUrl) {
          await sock.sendMessage(sender, {
            video: { url: content.videoUrl },
            caption: caption,
            contextInfo: {
              externalAdReply: {
                title: '🎬 TikTok Video Downloaded!',
                body: `By @${content.username}`,
                thumbnailUrl: content.thumbnailUrl,
                sourceUrl: url,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: message });

          // Optionally send audio separately
          if (content.audioUrl) {
            await sock.sendMessage(sender, {
              audio: { url: content.audioUrl },
              mimetype: 'audio/mpeg',
              ptt: false,
              contextInfo: {
                externalAdReply: {
                  title: '🎵 Audio Track',
                  body: content.title || 'TikTok Audio',
                  thumbnailUrl: content.thumbnailUrl,
                  sourceUrl: url,
                  mediaType: 1
                }
              }
            });
          }
        } else {
          await sock.sendMessage(sender, { 
            text: `❌ *Download Failed!*

The video URL couldn't be retrieved. 
This might happen if:
• The video is private
• The link has expired
• TikTok blocked the download

🔄 Try again with a different video!`
          }, { quoted: message });
        }
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Oops! Something went wrong!*

Unable to fetch the TikTok video.

✅ *Make sure:*
• The link is valid
• The video is public
• You copied the full URL

💡 *Tip:* Use the share button on TikTok to copy the link!`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('TikTok download error:', error);
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚠️ *ERROR ALERT* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Download Failed!*

🔧 *What happened:*
   ${error.message || 'Unknown error'}

🔄 *Try again:*
   • Check your internet connection
   • Verify the TikTok link
   • Wait a moment and retry

💬 Still having issues? Contact support!`
      }, { quoted: message });
    }
  }
};