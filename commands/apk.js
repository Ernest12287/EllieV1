import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'apk',
  description: 'Download Android APK files! 📱',
  usage: '.apk <app name>',
  category: 'Download',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📱 *APK DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing app name!*

📝 *Usage:* 
   ${config.bot.preffix}apk <app name>

💡 *Examples:* 
   ${config.bot.preffix}apk whatsapp
   ${config.bot.preffix}apk minecraft
   ${config.bot.preffix}apk efootball

🔍 Search for any Android app!`
      }, { quoted: message });
    }

    const appName = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/download/apkdl?apikey=gifted&appName=${encodeURIComponent(appName)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📱 *APK SEARCH* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Searching for "${appName}"...*
🔍 Looking through app stores...
📦 Preparing download...

_This might take a moment!_ ⚡`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const app = data.result;
        
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  📱 *APK READY!* 
┗━━━━━━━━━━━━━━━━━━┛

📦 *App Name:*
   ${app.appname}

👨‍💻 *Developer:* ${app.developer}
📊 *Type:* Android APK
💾 *Size:* Downloading...

━━━━━━━━━━━━━━━━━━
⚠️ *Install at your own risk*
✅ Scanned by Aptoide
━━━━━━━━━━━━━━━━━━
_Downloaded via ${config.bot.name}_ 🤖`;

        await sock.sendMessage(jid.chat, {
          document: { url: app.download_url },
          fileName: `${app.appname}.apk`,
          mimetype: app.mimetype,
          caption: caption,
          contextInfo: {
            externalAdReply: {
              title: `📱 ${app.appname}`,
              body: `By ${app.developer}`,
              thumbnailUrl: app.appicon,
              sourceUrl: app.download_url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: message });

        await sock.sendMessage(jid.chat, {
          text: `✅ *APK Sent Successfully!*

📱 File: ${app.appname}.apk
✨ Ready to install!

⚠️ *Security Tips:*
• Check app permissions
• Install from trusted sources only
• Enable "Install from Unknown Sources"

💚 Enjoy your app!`
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *App Not Found!*

Couldn't find "${appName}"

✅ *Try:*
• Check spelling
• Use exact app name
• Try alternative names

💡 Example: "whatsapp" not "WhatsApp Messenger"`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('APK download error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Download Failed!*

Error: ${error.message}

🔄 *Try:*
• Different app name
• Check your connection
• Wait and retry`
      }, { quoted: message });
    }
  }
};