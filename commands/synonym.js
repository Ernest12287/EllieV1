// ===== synonym.js =====
import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'synonym',
    aliases: ['synonyms', 'similar'],
    description: 'Find synonyms for a word',
    usage: '.synonym <word>',
    category: 'Info',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📖 SYNONYMS 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}synonym <word>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}synonym happy\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const word = args[0].toLowerCase();
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data[0]) {
                const entry = data[0];
                let synonyms = [];
                
                entry.meanings.forEach(meaning => {
                    meaning.definitions.forEach(def => {
                        if (def.synonyms) {
                            synonyms.push(...def.synonyms);
                        }
                    });
                    if (meaning.synonyms) {
                        synonyms.push(...meaning.synonyms);
                    }
                });
                
                synonyms = [...new Set(synonyms)].slice(0, 15);
                
                if (synonyms.length > 0) {
                    const synText = `╭━━━『 📖 SYNONYMS 』\n┃\n┃ 📝 *${word.toUpperCase()}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🔄 Similar words:\n${synonyms.map(s => `┃ • ${s}`).join('\n')}\n┃\n╰━━━━━━━━━━━━━━━⬣`;
                    
                    await sock.sendMessage(sender, { text: synText });
                    logging.success(`[SYNONYM] Synonyms sent for: ${word}`);
                } else {
                    await sock.sendMessage(sender, { text: `❌ No synonyms found for "${word}"` });
                }
            } else {
                await sock.sendMessage(sender, { text: `❌ Word not found!` });
            }
        } catch (error) {
            logging.error(`[SYNONYM] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Error!' });
        }
    }
};