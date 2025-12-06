import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'proxy',
  aliases: ['proxies', 'proxylist'],
  description: 'Get fresh proxy list! 🌐',
  usage: '.proxy',
  category: 'Tools',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    const apiUrl = `https://api.giftedtech.co.ke/api/tools/proxy?apikey=gifted`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `🌐 *Fetching proxies...*

⏳ Getting fresh proxy list...
🔍 Scanning servers worldwide...

_Please wait!_ ⚡`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.results) {
        const proxies = data.results.slice(0, 20); // Get first 20
        
        let proxyText = `┏━━━━━━━━━━━━━━━━━━┓
┃  🌐 *PROXY LIST* 
┗━━━━━━━━━━━━━━━━━━┛

📊 *Total Found:* ${data.results.length}
✅ *Showing:* ${proxies.length}

━━━━━━━━━━━━━━━━━━\n\n`;

        proxies.forEach((proxy, i) => {
          proxyText += `🔹 *Proxy ${i + 1}*\n`;
          proxyText += `   IP: ${proxy.ip}:${proxy.port}\n`;
          proxyText += `   Country: ${proxy.country} (${proxy.code})\n`;
          proxyText += `   Type: ${proxy.anonymity}\n`;
          proxyText += `   HTTPS: ${proxy.https}\n`;
          proxyText += `   Last Check: ${proxy.last}\n\n`;
        });

        proxyText += `━━━━━━━━━━━━━━━━━━\n`;
        proxyText += `_Fresh Proxy List_ 🌐`;

        await sock.sendMessage(jid.chat, { text: proxyText }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *No proxies found!*`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Proxy error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};