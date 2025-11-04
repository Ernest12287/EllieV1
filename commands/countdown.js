import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'countdown',
    aliases: ['timer', 'daysuntil'],
    description: 'Count days until an event',
    usage: '.countdown <date> <event name>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 2) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 ⏰ COUNTDOWN 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}countdown <date> <event>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}countdown 2025-12-25 Christmas\n┃ ${config.bot.preffix}countdown 2025-01-01 New Year\n┃ ${config.bot.preffix}countdown 2025-06-15 Birthday\n┃\n┃ 📅 Format: YYYY-MM-DD\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const dateStr = args[0];
            const eventName = args.slice(1).join(' ');
            
            const targetDate = new Date(dateStr);
            const today = new Date();
            
            if (isNaN(targetDate.getTime())) {
                return await sock.sendMessage(sender, { 
                    text: '❌ Invalid date format!\n\n💡 Use: YYYY-MM-DD (e.g., 2025-12-25)' 
                });
            }
            
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let countdownText = `╭━━━『 ⏰ COUNTDOWN 』\n┃\n┃ 🎯 *${eventName}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n`;
            
            if (diffDays > 0) {
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                
                countdownText += `┃ ⏳ *${diffDays} days* until ${eventName}!\n┃\n`;
                if (months > 0) {
                    countdownText += `┃ 📅 (~${months} months, ${days} days)\n┃\n`;
                }
                countdownText += `┃ 📆 Date: ${targetDate.toDateString()}\n`;
            } else if (diffDays === 0) {
                countdownText += `┃ 🎉 *TODAY IS ${eventName.toUpperCase()}!*\n`;
            } else {
                countdownText += `┃ ⏰ ${eventName} was ${Math.abs(diffDays)} days ago\n┃ 📆 Date: ${targetDate.toDateString()}\n`;
            }
            
            countdownText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
            
            await sock.sendMessage(sender, { text: countdownText });
            logging.success(`[COUNTDOWN] Calculated for: ${eventName}`);

        } catch (error) {
            logging.error(`[COUNTDOWN] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Countdown calculation failed.' 
            });
        }
    }
};