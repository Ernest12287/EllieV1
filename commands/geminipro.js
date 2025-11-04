import config from '../config.js';

export default {
  name: 'gemini',
  aliases: ['geminipro', 'bard'],
  description: 'Chat with Google Gemini Pro AI! 🌟',
  usage: '.gemini <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🌟 *GEMINI PRO AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}gemini <question>

💡 *Example:* 
   ${config.bot.preffix}gemini Tell me about space

🌟 Google's most advanced AI!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `🌟 *Gemini Pro thinking...*

💭 ${question}

✨ Processing with Google AI...`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🌟 *GEMINI PRO* 
┗━━━━━━━━━━━━━━━━━━┛

${data.result}

━━━━━━━━━━━━━━━━━━
_Powered by Google AI_ 🌟`
        }, { quoted: message });
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Gemini Error!* Try again.`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Gemini error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};