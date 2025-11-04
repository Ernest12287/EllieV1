import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'joke',
    aliases: ['jokes', 'funny'],
    description: 'Get random jokes',
    usage: '.joke [type]',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const type = args[0]?.toLowerCase() || 'any';
        
        try {
            await sock.sendMessage(sender, { 
                text: '😂 Finding a joke...' 
            });

            const apiUrl = type === 'any' || type === 'random'
                ? 'https://official-joke-api.appspot.com/random_joke'
                : `https://official-joke-api.appspot.com/jokes/${type}/random`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const joke = Array.isArray(data) ? data[0] : data;

            if (joke && joke.setup && joke.punchline) {
                const jokeText = `╭━━━『 😂 JOKE TIME 』\n┃\n┃ ${joke.setup}\n┃\n┃ 💥 *${joke.punchline}*\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n🎭 Type: ${joke.type}\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: jokeText });
                logging.success(`[JOKE] Sent joke: ${joke.type}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ No jokes found!\n\n💡 Try: ${config.bot.preffix}joke programming\n${config.bot.preffix}joke general` 
                });
            }

        } catch (error) {
            logging.error(`[JOKE] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch joke.' 
            });
        }
    }
};