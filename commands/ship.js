// ===== ship.js =====
import config from '../config.js';

export default {
    name: 'ship',
    aliases: ['love', 'lovecalc'],
    description: 'Calculate love compatibility',
    usage: '.ship <n1> <n2>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 2) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 💕 LOVE CALCULATOR 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ship <n1> <n2>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}ship John Jane\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }
        
        const name1 = args[0];
        const name2 = args[1];
        
        const percentage = Math.floor(Math.random() * 101);
        
        let message = '';
        let emoji = '';
        
        if (percentage < 25) {
            message = 'Not meant to be 💔';
            emoji = '😔';
        } else if (percentage < 50) {
            message = 'Just friends 🤝';
            emoji = '😊';
        } else if (percentage < 75) {
            message = 'Good match! 💖';
            emoji = '😍';
        } else if (percentage < 90) {
            message = 'Perfect couple! 💕';
            emoji = '🥰';
        } else {
            message = 'Soulmates! 💝';
            emoji = '😻';
        }
        
        const bars = '█'.repeat(Math.floor(percentage / 10)) + '▒'.repeat(10 - Math.floor(percentage / 10));
        
        await sock.sendMessage(sender, { 
            text: `╭━━━『 💕 LOVE SHIP 』\n┃\n┃ 👤 ${name1} 💘 ${name2}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 📊 [${bars}] ${percentage}%\n┃\n┃ ${emoji} ${message}\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};