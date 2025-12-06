import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'shorten',
    aliases: ['shorturl', 'tiny'],
    description: 'Shorten long URLs',
    usage: '.shorten <url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🔗 URL SHORTENER 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}shorten <url>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}shorten https://example.com/very/long/url\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔗 Shortening URL...' 
            });

            const longUrl = args[0];
            
            // Validate URL
            if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Invalid URL! Must start with http:// or https://' 
                });
            }
            
            // Using TinyURL API
            const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
            const response = await fetch(apiUrl);
            const shortUrl = await response.text();

            if (shortUrl && shortUrl.startsWith('http')) {
                const urlText = `╭━━━『 🔗 URL SHORTENED 』\n┃\n┃ 📝 *Original:*\n┃ ${longUrl.substring(0, 50)}${longUrl.length > 50 ? '...' : ''}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ ✅ *Shortened:*\n┃ ${shortUrl}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: urlText });
                logging.success(`[SHORTEN] URL shortened`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to shorten URL. Try again.' 
                });
            }

        } catch (error) {
            logging.error(`[SHORTEN] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ URL shortening failed.' 
            });
        }
    }
};