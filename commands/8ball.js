import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
 // ONE LINE CHANGE!

export default {
    name: '8ball',
    aliases: ['eightball', 'magic8'],
    description: 'Ask the magic 8ball',
    usage: '.8ball <question>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🎱 MAGIC 8BALL 』\n┃\n┃ ❌ Ask a yes/no question!\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}8ball Will I be rich?\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        const responses = [
            '✅ Yes, definitely!', '✅ It is certain!', '✅ Without a doubt!',
            '✅ Yes!', '✅ You may rely on it!', '✅ Most likely!',
            '🤔 Reply hazy, try again', '🤔 Ask again later', '🤔 Cannot predict now',
            '❌ Don\'t count on it', '❌ My reply is no', '❌ Very doubtful',
            '⚠️ Concentrate and ask again', '💫 Signs point to yes', '🎯 Outlook good'
        ];
        
        const answer = responses[Math.floor(Math.random() * responses.length)];
        const question = args.join(' ');
        
        await sock.sendMessage(jid.chat, { 
            text: `╭━━━『 🎱 MAGIC 8BALL 』\n┃\n┃ ❓ ${question}\n┃\n┃ 🎱 ${answer}\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};
