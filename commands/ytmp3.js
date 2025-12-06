// ========================================
// YOUTUBE DOWNLOADER - ytmp3.js
// ========================================
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "ytmp3",
  description: "Download YouTube audio or video with style! 🎵",
  usage: ".ytmp3 <url> [--audio|--video]",
  category: "media",
  async execute(sock, msg, args) {
    const jid = getChatJid(message);
    const query = args.filter(arg => !arg.startsWith('--')).join(" ");
    
    if (!query) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎵 *YOUTUBE DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing YouTube URL!*

📝 *Usage:* 
   ${config.bot.preffix}ytmp3 <youtube-url>
   ${config.bot.preffix}ytmp3 <url> --audio
   ${config.bot.preffix}ytmp3 <url> --video

💡 *Examples:* 
   ${config.bot.preffix}ytmp3 https://youtu.be/abc123
   ${config.bot.preffix}ytmp3 https://youtu.be/abc123 --audio
   ${config.bot.preffix}ytmp3 https://youtu.be/abc123 --video

🎯 *Options:*
   • No flag = Both audio & video
   • --audio = Audio only (MP3)
   • --video = Video only (MP4)

✨ Paste your YouTube link and let's go!`
      }, { quoted: msg });
    }

    const format = args.includes("--audio") ? "mp3" :
                   args.includes("--video") ? "mp4" : "both";
    
    const base = "https://api.giftedtech.co.ke/api/download";
    const apikey = "gifted";

    try {
      // Send exciting loading message
      const formatEmoji = format === "mp3" ? "🎵" : format === "mp4" ? "🎬" : "🎭";
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ${formatEmoji} *YOUTUBE MAGIC* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Processing your request...*
🔍 Fetching video details...
⚡ Format: ${format.toUpperCase()}
💫 Preparing download...

_Hang tight, quality takes time!_ ✨`
      }, { quoted: msg });

      const downloads = [];
      
      // Fetch MP3
      if (format === "mp3" || format === "both") {
        const res = await axios.get(`${base}/ytmp3?apikey=${apikey}&url=${encodeURIComponent(query)}`);
        if (res.data?.success && res.data.result) {
          downloads.push({ ...res.data.result, type: 'audio' });
        }
      }
      
      // Fetch MP4
      if (format === "mp4" || format === "both") {
        const res = await axios.get(`${base}/ytmp4?apikey=${apikey}&url=${encodeURIComponent(query)}`);
        if (res.data?.success && res.data.result) {
          downloads.push({ ...res.data.result, type: 'video' });
        }
      }
      
      if (!downloads.length) {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Download Failed!*

Unable to fetch the YouTube content.

✅ *Make sure:*
• The link is valid
• The video is available
• You copied the full URL

🔄 Try again with a different video!`
        }, { quoted: msg });
      }

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Process each download
      for (const item of downloads) {
        const isAudio = item.type === 'audio';
        const typeEmoji = isAudio ? '🎵' : '🎬';
        const typeText = isAudio ? 'Audio' : 'Video';
        
        // Create beautiful caption
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  ${typeEmoji} *YOUTUBE ${typeText.toUpperCase()}* 
┗━━━━━━━━━━━━━━━━━━┛

📝 *Title:*
   ${item.title}

🎯 *Quality:* ${item.quality || 'High Quality'}
📊 *Format:* ${isAudio ? 'MP3 (Audio)' : 'MP4 (Video)'}

━━━━━━━━━━━━━━━━━━
_Downloaded via ${config.bot.name}_ 🤖
━━━━━━━━━━━━━━━━━━`;

        // Download file
        const filename = path.join(tempDir, `${Date.now()}_${item.id}.${isAudio ? 'm4a' : 'mp4'}`);
        const writer = fs.createWriteStream(filename);
        const response = await axios.get(item.download_url, { responseType: "stream" });
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        // Send the file
        const fileBuffer = fs.readFileSync(filename);
        
        if (isAudio) {
          await sock.sendMessage(jid.chat, {
            audio: fileBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
              externalAdReply: {
                title: `🎵 ${item.title}`,
                body: `Quality: ${item.quality || '128kbps'}`,
                thumbnailUrl: item.thumbnail,
                sourceUrl: query,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: msg });
        } else {
          await sock.sendMessage(jid.chat, {
            video: fileBuffer,
            caption: caption,
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: '🎬 YouTube Video',
                body: item.title,
                thumbnailUrl: item.thumbnail,
                sourceUrl: query,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: msg });
        }
        
        // Clean up
        fs.unlinkSync(filename);
      }

      // Success message
      await sock.sendMessage(jid.chat, {
        text: `✅ *Download Complete!*

${downloads.length > 1 ? '🎭 Both files sent successfully!' : '✨ File sent successfully!'}

━━━━━━━━━━━━━━━━━━
💚 Enjoy your ${format === 'both' ? 'audio & video' : format.toUpperCase()}!
━━━━━━━━━━━━━━━━━━`
      }, { quoted: msg });

    } catch (err) {
      console.error('YouTube download error:', err);
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚠️ *ERROR ALERT* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Download Failed!*

🔧 *What happened:*
   ${err.message || 'Unknown error'}

🔄 *Possible solutions:*
   • Check if video is available
   • Try a different quality format
   • Verify your internet connection
   • Wait a moment and retry

💬 Still stuck? Contact the bot owner!`
      }, { quoted: msg });
    }
  }
};