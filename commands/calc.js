import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'calc',
    aliases: ['calculate', 'math'],
    description: 'Calculate mathematical expressions',
    usage: '.calc <expression>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🔢 CALCULATOR 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}calc <expression>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}calc 2 + 2\n┃ ${config.bot.preffix}calc 5 * 10\n┃ ${config.bot.preffix}calc sqrt(16)\n┃ ${config.bot.preffix}calc 2^8\n┃\n┃ ➕ Operators:\n┃ + - * / ^ % sqrt() sin() cos()\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const expression = args.join(' ')
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**');
            
            // Use Math.js API for safe evaluation
            const apiUrl = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`;
            const response = await fetch(apiUrl);
            const result = await response.text();

            if (result && !result.includes('Error')) {
                const calcText = `╭━━━『 🔢 CALCULATOR 』\n┃\n┃ 📝 *Expression:*\n┃ ${expression}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ ✅ *Result:*\n┃ ${result}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: calcText });
                logging.success(`[CALC] Calculated: ${expression} = ${result}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Invalid expression!\n\n💡 Check your syntax and try again.` 
                });
            }

        } catch (error) {
            logging.error(`[CALC] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Calculation failed. Check your expression.' 
            });
        }
    }
};