import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'tiktok',
  description: 'Download TikTok videos with style! 🎬',
  usage: '.tiktok <url>',
  category: 'Download',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      // ... (Usage message remains the same) ...
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/download/tiktokdlv4?apikey=gifted&url=${encodeURIComponent(url)}`;

    // === 🛠️ START TIMEOUT IMPLEMENTATION ===
    const controller = new AbortController();
    const TIMEOUT_MS = 15000; // Set timeout to 15 seconds
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Send exciting loading message
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎬 *TIKTOK MAGIC* ┗━━━━━━━━━━━━━━━━━━┛

⏳ *Processing your TikTok...*
🔍 Fetching video data...
⚡ Preparing download...

_Please wait, this won't take long!_ 💫`
      }, { quoted: message });

      const response = await fetch(apiUrl, { signal: controller.signal });
      
      // Clear the timeout since the request succeeded
      clearTimeout(timeoutId); 

      const data = await response.json();

      // ... (Success/Failure logic remains the same) ...
      if (data.success && data.result) {
        const content = data.result;
        
        // ... (Send messages for video and optional audio) ...
      } else {
        await sock.sendMessage(jid.chat, { 
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
      // Clear the timeout in case of an error before the 15s mark
      clearTimeout(timeoutId); 
      console.error('TikTok download error:', error);
      
      let errorMessage = error.message || 'Unknown error';

      // Check if the error is due to the timeout
      if (error.name === 'AbortError') {
          errorMessage = `Request timed out after ${TIMEOUT_MS / 1000} seconds. The API took too long to respond.`;
      }
      
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚠️ *ERROR ALERT* ┗━━━━━━━━━━━━━━━━━━┛

❌ *Download Failed!*

🔧 *What happened:*
   ${errorMessage}

🔄 *Try again:*
   • Check your internet connection
   • Verify the TikTok link
   • Wait a moment and retry`
      }, { quoted: message });
    }
  }
};