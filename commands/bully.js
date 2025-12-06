// neko.js - Create similar files for other categories
import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'bully',
    description: 'Get random bullt NFSW images',
    usage: '.bully',
    category: 'Anime',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const category = 'bully'; // Change this for each shortcut
        
        try {
            await sock.sendMessage(jid.chat, {
                text: `⏳ Fetching ${category}...`
            });
            
            const apiUrl = `https://api.waifu.pics/sfw/${category}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.url) {
                await sock.sendMessage(jid.chat, {
                    image: { url: data.url },
                    caption: `✨ *${category.charAt(0).toUpperCase() + category.slice(1)}*\n\n` +
                             `🔄 Want more? Use ${config.bot.preffix}${category}\n` +
                             `📋 See all: ${config.bot.preffix}waifu list`
                });
                
                logging.success(`[${category.toUpperCase()}] Sent image to ${sender}`);
            } else {
                await sock.sendMessage(jid.chat, {
                    text: '❌ Failed to fetch image. Try again!'
                });
            }
            
        } catch (error) {
            logging.error(`[${category.toUpperCase()}] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, {
                text: `❌ Error fetching image.\n\n${error.message}`
            });
        }
    }
};

// To create more shortcuts, duplicate this file and change:
// 1. File name: megumin.js, shinobu.js, awoo.js, etc.
// 2. name: 'megumin'
// 3. const category = 'megumin'
// 4. description: 'Get random megumin images'