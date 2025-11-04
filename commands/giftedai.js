import config from '../config.js';

export default {
  name: 'giftedai',
  aliases: ['gai', 'gifted'],
  description: 'Chat with Gifted AI! 💚',
  usage: '.giftedai <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  💚 *GIFTED AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}giftedai <question>

💡 *Example:* 
   ${config.bot.preffix}giftedai Who created you?

💚 Custom AI by Gifted Tech!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/ai?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `💚 *Gifted AI thinking...*

💭 ${question}

✨ Processing...`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  💚 *GIFTED AI* 
┗━━━━━━━━━━━━━━━━━━┛

${data.result}

━━━━━━━━━━━━━━━━━━
_Gifted-Mini Model (2024)_ 💚`
        }, { quoted: message });
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Gifted AI Error!*`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Gifted AI error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};