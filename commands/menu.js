import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'menu',
    aliases: ['commands', 'cmdlist'],
    description: 'Show all bot commands',
    usage: '.menu [category]',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const sender = message.key.remoteJid;
        
        // Organize commands by category
        const categories = {};
        
        commands.forEach((cmd, name) => {
            const category = cmd.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(name);
        });

        // If specific category requested
        if (args[0]) {
            const requestedCategory = args[0].toLowerCase();
            const categoryKey = Object.keys(categories).find(
                k => k.toLowerCase() === requestedCategory
            );
            
            if (categoryKey) {
                const cmds = categories[categoryKey].sort();
                let text = `╭━━━『 📂 ${categoryKey.toUpperCase()} 』\n┃\n`;
                
                cmds.forEach(cmd => {
                    const cmdObj = commands.get(cmd);
                    text += `┃ ${config.bot.preffix}${cmd}\n`;
                    if (cmdObj.description) {
                        text += `┃ ↳ ${cmdObj.description}\n┃\n`;
                    }
                });
                
                text += `╰━━━━━━━━━━━━━━━⬣\n\n`;
                text += `📊 Total: ${cmds.length} commands\n`;
                text += `💡 Use: ${config.bot.preffix}menu <category> for details`;
                
                return await sock.sendMessage(sender, { text });
            }
        }

        // Main menu - show categories
        const totalCommands = commands.size;
        
        let menuText = `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        menuText += `┃   🤖 ${config.bot.name}   ┃\n`;
        menuText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        
        menuText += `👋 Hello! I'm ${config.bot.name}\n`;
        menuText += `📊 Total Commands: *${totalCommands}*\n`;
        menuText += `⚡ Prefix: *${config.bot.preffix}*\n\n`;
        
        menuText += `╭━━━『 📂 CATEGORIES 』\n┃\n`;
        
        // Sort categories and show command counts
        const sortedCategories = Object.keys(categories).sort();
        sortedCategories.forEach(cat => {
            const count = categories[cat].length;
            const emoji = this._getCategoryEmoji(cat);
            menuText += `┃ ${emoji} *${cat}* (${count})\n`;
        });
        
        menuText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n`;
        
        menuText += `💡 *Usage:*\n`;
        menuText += `• ${config.bot.preffix}menu <category> - View category\n`;
        menuText += `• ${config.bot.preffix}help <command> - Command details\n\n`;
        
        menuText += `📱 *Socials:*\n`;
        menuText += `• Telegram: ${config.social.telegram}\n`;
        menuText += `• WhatsApp: ${config.social.whatsappChannel}\n\n`;
        
        menuText += `_Made by ${config.creator.name}_ ❤️`;

        await sock.sendMessage(sender, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: `${config.bot.name} - ${totalCommands} Commands`,
                    body: `Tap to view categories`,
                    thumbnailUrl: '',
                    sourceUrl: config.social.telegram,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        
        logging.success(`[MENU] Sent menu to user`);
    },

    _getCategoryEmoji(category) {
        const emojiMap = {
            'AI': '🤖',
            'Download': '📥',
            'Downloader': '📥',
            'Media': '🎬',
            'Fun': '🎮',
            'Game': '🎮',
            'Games': '🎮',
            'Utility': '🔧',
            'Tools': '🔧',
            'Image': '🖼️',
            'Sticker': '🎨',
            'Info': 'ℹ️',
            'Information': 'ℹ️',
            'Group': '👥',
            'Admin': '👑',
            'Owner': '👑',
            'Search': '🔍',
            'Tech': '💻',
            'Developer': '💻',
            'Finance': '💰',
            'Network': '🌐',
            'Bible': '📖',
            'Religion': '🕉️',
            'Anime': '🎌',
            'Health': '🏥',
            'Weather': '🌤️',
            'Social': '💬'
        };
        
        return emojiMap[category] || '📌';
    }
};