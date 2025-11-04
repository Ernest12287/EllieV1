import config from '../config.js';

export default {
  name: 'mistral',
  aliases: ['mistralai'],
  description: 'Chat with Mistral AI! 🎯',
  usage: '.mistral <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎯 *MISTRAL AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}mistral <question>

💡 *Example:* 
   ${config.bot.preffix}mistral Explain machine learning

🎯 Advanced European AI!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/mistral?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `🎯 *Mistral AI processing...*

💭 ${question}

🔮 Analyzing...`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎯 *MISTRAL AI* 
┗━━━━━━━━━━━━━━━━━━┛

${data.result}

━━━━━━━━━━━━━━━━━━
_Mistral AI Team_ 🎯`
        }, { quoted: message });
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Mistral Error!*`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Mistral error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};