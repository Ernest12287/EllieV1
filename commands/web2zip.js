import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'web2zip',
    aliases: ['webzip', 'downloadweb'],
    description: 'Download website as ZIP file',
    usage: '.web2zip <url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📦 WEB TO ZIP 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}web2zip <url>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}web2zip https://example.com\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '📦 Downloading website...' 
            });

            let url = args[0];
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/web2zip?apikey=gifted&url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.download_url) {
                await sock.sendMessage(sender, {
                    document: { url: data.download_url },
                    mimetype: 'application/zip',
                    fileName: `website_${Date.now()}.zip`,
                    caption: `╭━━━『 📦 WEBSITE ZIP 』\n┃\n┃ 🔗 ${url}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`
                });
                
                logging.success(`[WEB2ZIP] Website downloaded: ${url}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to download website!' 
                });
            }

        } catch (error) {
            logging.error(`[WEB2ZIP] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Error downloading website!` 
            });
        }
    }
};