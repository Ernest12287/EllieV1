import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'emojimix',
    aliases: ['mixemoji', 'emojiblend'],
    description: 'Mix two emojis together',
    usage: '.emojimix <emoji1> <emoji2>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 2) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 🎨 EMOJI MIXER 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}emojimix <emoji1> <emoji2>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}emojimix 😂 😍\n┃ ${config.bot.preffix}emojimix 🔥 💀\n┃ ${config.bot.preffix}emojimix ❤️ 😊\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '🎨 Mixing emojis...' 
            });

            const emoji1 = args[0];
            const emoji2 = args[1];
            
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/emojimix?apikey=gifted&emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
            
            const caption = `╭━━━『 🎨 EMOJI MIX 』\n┃\n┃ ${emoji1} + ${emoji2} = 💫\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
            
            await sock.sendMessage(sender, {
                sticker: { url: apiUrl },
                mimetype: 'image/webp'
            });
            
            logging.success(`[EMOJIMIX] Mixed ${emoji1} + ${emoji2}`);

        } catch (error) {
            logging.error(`[EMOJIMIX] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Failed to mix emojis!\n\n💡 Try different emojis.` 
            });
        }
    }
};