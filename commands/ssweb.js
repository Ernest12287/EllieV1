import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'ssweb',
    aliases: ['screenshot', 'ss'],
    description: 'Take screenshot of website',
    usage: '.ssweb <url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📸 SCREENSHOT 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ssweb <url>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}ssweb google.com\n┃ ${config.bot.preffix}ssweb https://github.com\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '📸 Taking screenshot...' 
            });

            let url = args[0];
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/ssweb?apikey=gifted&url=${encodeURIComponent(url)}`;
            
            const caption = `╭━━━『 📸 SCREENSHOT 』\n┃\n┃ 🔗 ${url}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
            
            await sock.sendMessage(sender, {
                image: { url: apiUrl },
                caption: caption
            });
            
            logging.success(`[SSWEB] Screenshot taken: ${url}`);

        } catch (error) {
            logging.error(`[SSWEB] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Failed to take screenshot!` 
            });
        }
    }
};