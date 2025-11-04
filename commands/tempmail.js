import config from '../config.js';

export default {
  name: 'tempmail',
  aliases: ['genmail', 'fakemail'],
  description: 'Generate temporary email! 📧',
  usage: '.tempmail [generate|inbox|read]',
  category: 'Tools',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    const action = args[0]?.toLowerCase() || 'generate';

    if (action === 'generate' || !args.length) {
      // Generate new temp email
      try {
        const response = await fetch('https://api.giftedtech.co.ke/api/tempmail/generate?apikey=gifted');
        const data = await response.json();

        if (data.success) {
          await sock.sendMessage(sender, { 
            text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📧 *TEMP MAIL GENERATED* 
┗━━━━━━━━━━━━━━━━━━┛

✅ *Your Temporary Email:*

📮 \`${data.result.email}\`

⏰ *Expires in:* 10 minutes

━━━━━━━━━━━━━━━━━━
📋 *How to use:*

1️⃣ Copy this email
2️⃣ Use it for registration
3️⃣ Check inbox:
   ${config.bot.preffix}tempmail inbox ${data.result.email}

━━━━━━━━━━━━━━━━━━
⚠️ *Note:* ${data.result.message}

_Your privacy matters!_ 🔒`
          }, { quoted: message });
        }
      } catch (error) {
        await sock.sendMessage(sender, { 
          text: `❌ *Error!* ${error.message}`
        }, { quoted: message });
      }
    } else if (action === 'inbox') {
      // Check inbox
      const email = args[1];
      if (!email) {
        return await sock.sendMessage(sender, { 
          text: `❌ *Missing email!*\n\n📝 Usage: ${config.bot.preffix}tempmail inbox <email>`
        }, { quoted: message });
      }

      try {
        const response = await fetch(`https://api.giftedtech.co.ke/api/tempmail/inbox?apikey=gifted&email=${email}`);
        const data = await response.json();

        if (data.success && data.result?.length > 0) {
          let inboxText = `┏━━━━━━━━━━━━━━━━━━┓
┃  📬 *INBOX* 
┗━━━━━━━━━━━━━━━━━━┛

📧 *Email:* ${email}
📊 *Messages:* ${data.result.length}

━━━━━━━━━━━━━━━━━━\n\n`;

          data.result.forEach((msg, i) => {
            inboxText += `📨 *Message ${i + 1}*\n`;
            inboxText += `👤 From: ${msg.from}\n`;
            inboxText += `📝 Subject: ${msg.subject}\n`;
            inboxText += `🆔 ID: \`${msg.id}\`\n`;
            inboxText += `⏰ ${msg.date}\n\n`;
          });

          inboxText += `━━━━━━━━━━━━━━━━━━\n`;
          inboxText += `📖 *Read message:*\n`;
          inboxText += `${config.bot.preffix}tempmail read ${email} <id>`;

          await sock.sendMessage(sender, { text: inboxText }, { quoted: message });
        } else {
          await sock.sendMessage(sender, { 
            text: `📭 *Inbox Empty!*\n\nNo messages received yet.\n\n💡 *Tip:* Send a test email to see it appear here!`
          }, { quoted: message });
        }
      } catch (error) {
        await sock.sendMessage(sender, { 
          text: `❌ *Error!* ${error.message}`
        }, { quoted: message });
      }
    } else if (action === 'read') {
      // Read specific message
      const email = args[1];
      const messageId = args[2];
      
      if (!email || !messageId) {
        return await sock.sendMessage(sender, { 
          text: `❌ *Missing parameters!*\n\n📝 Usage: ${config.bot.preffix}tempmail read <email> <messageid>`
        }, { quoted: message });
      }

      try {
        const response = await fetch(`https://api.giftedtech.co.ke/api/tempmail/message?apikey=gifted&email=${email}&messageid=${messageId}`);
        const data = await response.json();

        if (data.success && data.result) {
          const msg = data.result;
          await sock.sendMessage(sender, { 
            text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📧 *EMAIL MESSAGE* 
┗━━━━━━━━━━━━━━━━━━┛

👤 *From:* ${msg.from}
📝 *Subject:* ${msg.subject}
⏰ *Date:* ${msg.date}

━━━━━━━━━━━━━━━━━━
📄 *Message:*

${msg.body || msg.text || msg.content || 'No content'}

━━━━━━━━━━━━━━━━━━`
          }, { quoted: message });
        } else {
          await sock.sendMessage(sender, { 
            text: `❌ *Message not found!*\n\nCheck the message ID and try again.`
          }, { quoted: message });
        }
      } catch (error) {
        await sock.sendMessage(sender, { 
          text: `❌ *Error!* ${error.message}`
        }, { quoted: message });
      }
    } else {
      // Show help
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📧 *TEMP MAIL HELP* 
┗━━━━━━━━━━━━━━━━━━┛

🔹 *Generate Email:*
   ${config.bot.preffix}tempmail generate

🔹 *Check Inbox:*
   ${config.bot.preffix}tempmail inbox <email>

🔹 *Read Message:*
   ${config.bot.preffix}tempmail read <email> <id>

━━━━━━━━━━━━━━━━━━
_Temporary emails for privacy!_ 🔒`
      }, { quoted: message });
    }
  }
};