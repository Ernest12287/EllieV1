import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'goodbye',
    aliases: ['welcome', 'greet'],
    description: 'Create welcome/goodbye images',
    usage: '.goodbye <name> <type>',
    category: 'Image',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 2) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 👋 WELCOME/GOODBYE 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}goodbye <name> <type>\n┃\n┃ 💡 Types:\n┃ • type1 - Welcome style 1\n┃ • type2 - Welcome style 2\n┃ • type3 - Goodbye style\n┃\n┃ 📝 Example:\n┃ ${config.bot.preffix}goodbye John type1\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '👋 Creating image...' 
            });

            const name = args[0];
            const type = args[1] || 'type1';
            
            // Get user's profile pic or use default
            const profilePicUrl = 'https://i.imgur.com/whjlJSf.jpg'; // Default avatar
            
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/goodbye?apikey=gifted&name=${encodeURIComponent(name)}&type=${type}&profilePicUrl=${encodeURIComponent(profilePicUrl)}`;
            
            const caption = `╭━━━『 👋 GREETING 』\n┃\n┃ 👤 Name: ${name}\n┃ 🎨 Style: ${type}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
            
            await sock.sendMessage(jid.chat, {
                image: { url: apiUrl },
                caption: caption
            });
            
            logging.success(`[GOODBYE] Created greeting for: ${name}`);

        } catch (error) {
            logging.error(`[GOODBYE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Failed to create image!` 
            });
        }
    }
};