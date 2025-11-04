import config from '../config.js';

export default {
    name: 'define',
    description: 'Look up word definitions and synonyms',
    usage: '.define <word>',
    category: 'Education',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}define <word>\n\nExamples:\n• ${config.bot.preffix}define "serendipity"\n• ${config.bot.preffix}define "ephemeral"\n• ${config.bot.preffix}define "resilient"`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Looking up word...' 
            });

            const word = args[0].toLowerCase();
            
            // Free Dictionary API
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.title === 'No Definitions Found') {
                return await sock.sendMessage(sender, { 
                    text: `❌ No definition found for "${word}". Check spelling.` 
                });
            }

            const entry = data[0];
            let messageText = `📚 *${entry.word}* ${entry.phonetic || ''}\n\n`;

            entry.meanings.forEach((meaning, index) => {
                messageText += `*${meaning.partOfSpeech}*\n`;
                
                meaning.definitions.slice(0, 2).forEach((def, defIndex) => {
                    messageText += `${defIndex + 1}. ${def.definition}\n`;
                    if (def.example) {
                        messageText += `   *Example:* "${def.example}"\n`;
                    }
                });
                
                if (meaning.synonyms.length > 0) {
                    messageText += `   *Synonyms:* ${meaning.synonyms.slice(0, 5).join(', ')}\n`;
                }
                
                messageText += '\n';
            });

            await sock.sendMessage(sender, { text: messageText });

        } catch (error) {
            console.error('Dictionary error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error looking up word. Please try again.' 
            });
        }
    }
};