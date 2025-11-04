import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'waifu',
    aliases: ['neko', 'megumin', 'shinobu', 'awoo'],
    description: 'Get random waifu/anime images',
    usage: '.waifu [category] or .waifu list',
    category: 'Anime',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const input = args[0]?.toLowerCase();
        
        const validCategories = [
            'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 
            'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 
            'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 
            'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 'happy', 
            'wink', 'poke', 'dance', 'cringe'
        ];
        
        // Show category list
        if (!input || input === 'list' || input === 'help') {
            const categoryList = validCategories.map(cat => `• ${cat}`).join('\n');
            
            return await sock.sendMessage(sender, {
                text: `✨ *Waifu Image Categories*\n\n` +
                      `📝 *Available Categories:*\n${categoryList}\n\n` +
                      `💡 *Usage:*\n` +
                      `• ${config.bot.preffix}waifu <category>\n` +
                      `• ${config.bot.preffix}waifu (random waifu)\n` +
                      `• ${config.bot.preffix}neko (shortcut)\n\n` +
                      `📌 *Example:*\n` +
                      `${config.bot.preffix}waifu neko\n` +
                      `${config.bot.preffix}waifu cuddle\n\n` +
                      `_Powered by waifu.pics API_`
            });
        }
        
        // Validate category
        const category = input || 'waifu';
        
        if (!validCategories.includes(category)) {
            return await sock.sendMessage(sender, {
                text: `❌ Invalid category: *${category}*\n\n` +
                      `💡 Type ${config.bot.preffix}waifu list to see all categories.`
            });
        }
        
        try {
            await sock.sendMessage(sender, {
                text: `⏳ Fetching ${category} image...`
            });
            
            const apiUrl = `https://api.waifu.pics/sfw/${category}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.url) {
                await sock.sendMessage(sender, {
                    image: { url: data.url },
                    caption: `✨ *${category.charAt(0).toUpperCase() + category.slice(1)}*\n\n` +
                             `🔄 Want more? Use ${config.bot.preffix}waifu ${category}\n` +
                             `📋 See all: ${config.bot.preffix}waifu list`
                });
                
                logging.success(`[WAIFU] Sent ${category} image to ${sender}`);
            } else {
                await sock.sendMessage(sender, {
                    text: '❌ Failed to fetch waifu image. Try again!'
                });
            }
            
        } catch (error) {
            logging.error(`[WAIFU] Error: ${error.message}`);
            await sock.sendMessage(sender, {
                text: `❌ Error fetching waifu image.\n\n${error.message}`
            });
        }
    }
};