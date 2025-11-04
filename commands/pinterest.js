import config from '../config.js';

export default {
  name: 'pinterest',
  aliases: ['pin', 'pindl'],
  description: 'Download Pinterest videos & images! 📌',
  usage: '.pinterest <url>',
  category: 'Download',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📌 *PINTEREST DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing Pinterest URL!*

📝 *Usage:* 
   ${config.bot.preffix}pinterest <url>

💡 *Example:* 
   ${config.bot.preffix}pin https://pin.it/...

🎨 Download in multiple qualities!`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📌 *PINTEREST MAGIC* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Downloading from Pinterest...*
🔍 Finding best quality...
✨ Processing media...

_Hang tight!_ 🎨`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const result = data.result;
        
        // Find the best quality video (720p)
        const video720p = result.media.find(m => m.type === '720p (4.14 MB)' || m.type.includes('720p'));
        const bestVideo = video720p || result.media.find(m => m.format === 'MP4');
        
        if (bestVideo) {
          const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  📌 *PINTEREST VIDEO* 
┗━━━━━━━━━━━━━━━━━━┛

📝 *Title:* ${result.title}
🎯 *Quality:* ${bestVideo.type}
📊 *Format:* ${bestVideo.format}

━━━━━━━━━━━━━━━━━━
_Downloaded via ${config.bot.name}_ 🤖`;

          await sock.sendMessage(sender, {
            video: { url: bestVideo.download_url },
            caption: caption
          }, { quoted: message });
        } else {
          // If no video, send image
          const image = result.media.find(m => m.format === 'JPG');
          if (image) {
            await sock.sendMessage(sender, {
              image: { url: image.download_url },
              caption: `📌 *${result.title}*\n\n_Via ${config.bot.name}_ 🤖`
            }, { quoted: message });
          }
        }
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Download Failed!*\n\nCheck if the URL is valid.`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Pinterest download error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};