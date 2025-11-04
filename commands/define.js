// ===== define.js =====
import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'define',
    aliases: ['definition', 'meaning'],
    description: 'Get word definition',
    usage: '.define <word>',
    category: 'Info',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📚 DICTIONARY 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}define <word>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}define serendipity\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const word = args[0].toLowerCase();
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data[0]) {
                const entry = data[0];
                const meaning = entry.meanings[0];
                const definition = meaning.definitions[0];
                
                let defText = `╭━━━『 📚 DICTIONARY 』\n┃\n┃ 📝 *${entry.word}*\n`;
                
                if (entry.phonetic) {
                    defText += `┃ 🔊 ${entry.phonetic}\n`;
                }
                
                defText += `┃\n┃━━━━━━━━━━━━━━\n┃\n`;
                defText += `┃ 🏷️ Part of speech: ${meaning.partOfSpeech}\n┃\n`;
                defText += `┃ 💡 Definition:\n┃ ${definition.definition}\n`;
                
                if (definition.example) {
                    defText += `┃\n┃ 📌 Example:\n┃ "${definition.example}"\n`;
                }
                
                defText += `┃\n╰━━━━━━━━━━━━━━━⬣`;
                
                await sock.sendMessage(sender, { text: defText });
                logging.success(`[DEFINE] Definition sent for: ${word}`);
            } else {
                await sock.sendMessage(sender, { text: `❌ No definition found for "${word}"` });
            }
        } catch (error) {
            logging.error(`[DEFINE] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Word not found!' });
        }
    }
};