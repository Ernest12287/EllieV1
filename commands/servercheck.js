import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'servercheck',
    aliases: ['checkserver', 'serverstatus'],
    description: 'Check server/website status',
    usage: '.servercheck <url>',
    category: 'Network',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 🌐 SERVER CHECK 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}servercheck <url>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}servercheck google.com\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '🌐 Checking server...' 
            });

            const url = args[0];
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/server-check?apikey=gifted&url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                const result = data.result;
                const statusEmoji = result.status === 'online' ? '✅' : '❌';
                
                const resultText = `╭━━━『 🌐 SERVER STATUS 』\n┃\n┃ 🔗 Link: ${result.link}\n┃ 📊 HTTP Code: ${result.http_code}\n┃ ${statusEmoji} Status: ${result.status.toUpperCase()}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: resultText });
                logging.success(`[SERVERCHECK] Checked: ${url}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to check server!' 
                });
            }

        } catch (error) {
            logging.error(`[SERVERCHECK] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Error checking server!` 
            });
        }
    }
};
