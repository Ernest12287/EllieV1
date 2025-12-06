// ===== urban.js =====
import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'urban',
    aliases: ['urbandictionary', 'slang'],
    description: 'Search Urban Dictionary',
    usage: '.urban <term>',
    category: 'Info',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 📖 URBAN DICTIONARY 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}urban <term>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}urban yeet\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const term = args.join(' ');
            const apiUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.list && data.list.length > 0) {
                const def = data.list[0];
                const definition = def.definition.replace(/\[|\]/g, '').substring(0, 300);
                const example = def.example.replace(/\[|\]/g, '').substring(0, 200);
                
                const urbanText = `╭━━━『 📖 URBAN DICTIONARY 』\n┃\n┃ 📝 *${def.word}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 💡 Definition:\n┃ ${definition}${definition.length >= 300 ? '...' : ''}\n┃\n┃ 📌 Example:\n┃ ${example}${example.length >= 200 ? '...' : ''}\n┃\n┃ 👍 ${def.thumbs_up} 👎 ${def.thumbs_down}\n┃\n╰━━━━━━━━━━━━━━━⬣`;
                
                await sock.sendMessage(jid.chat, { text: urbanText });
                logging.success(`[URBAN] Definition sent for: ${term}`);
            } else {
                await sock.sendMessage(jid.chat, { text: `❌ No definition found for "${term}"` });
            }
        } catch (error) {
            logging.error(`[URBAN] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Error!' });
        }
    }
};
