import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'menu',
    aliases: ['commands', 'cmdlist', 'list'],
    description: 'Show all bot commands',
    usage: '.menu [category]',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const sender = message.key.remoteJid;
        const prefixes = config.bot.prefixes || [config.bot.preffix || '.'];
        const defaultPrefix = config.bot.defaultPrefix || prefixes[0];
        const allowNoPrefix = config.bot.allowNoPrefix;
        
        // Organize commands by category
        const categories = {};
        
        commands.forEach((cmd, name) => {
            const category = cmd.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({ name, cmd });
        });

        // If specific category requested
        if (args[0]) {
            const requestedCategory = args[0].toLowerCase();
            const categoryKey = Object.keys(categories).find(
                k => k.toLowerCase() === requestedCategory
            );
            
            if (categoryKey) {
                return await this._sendCategoryView(sock, sender, categoryKey, categories[categoryKey], commands, defaultPrefix);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ Category *"${requestedCategory}"* not found!\n\n💡 Use ${defaultPrefix}menu to see all categories.` 
                });
                return;
            }
        }

        // Main menu - STUNNING OVERVIEW
        await this._sendMainMenu(sock, sender, categories, commands, prefixes, defaultPrefix, allowNoPrefix);
    },

    async _sendMainMenu(sock, sender, categories, commands, prefixes, defaultPrefix, allowNoPrefix) {
        const totalCommands = commands.size;
        const totalCategories = Object.keys(categories).length;
        
        let menuText = `
╔═══════════════════════╗
║                                                  ║
║       🌟 *${config.bot.name}* 🌟           ║
║                                                  ║
╚═══════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━┓
┃   🎯 *COMMAND CENTER*   ┃
┗━━━━━━━━━━━━━━━━━━━━┛

👋 Welcome! I'm your intelligent assistant
   with *${totalCommands}* powerful commands!

━━━━━━━━━━━━━━━━━━━━━━━

⚡ *Quick Stats*

┌─ 📊 Total Commands
│  ${totalCommands}
│
├─ 📂 Categories
│  ${totalCategories}
│
├─ ⚙️ Prefix Options
│  ${prefixes.join(', ')}
│
└─ 🚀 No-Prefix Mode
   ${allowNoPrefix ? '✅ Enabled' : '❌ Disabled'}

━━━━━━━━━━━━━━━━━━━━━━━

📂 *BROWSE BY CATEGORY*

`;

        // Sort categories and show with beautiful formatting
        const sortedCategories = Object.keys(categories).sort();
        
        sortedCategories.forEach((cat, index) => {
            const count = categories[cat].length;
            const emoji = this._getCategoryEmoji(cat);
            const isLast = index === sortedCategories.length - 1;
            
            menuText += `${isLast ? '└' : '├'}─ ${emoji} *${cat}*\n`;
            menuText += `${isLast ? '  ' : '│'}  ${count} command${count > 1 ? 's' : ''}\n`;
            menuText += `${isLast ? '  ' : '│'}  _${defaultPrefix}menu ${cat.toLowerCase()}_\n`;
            if (!isLast) menuText += `${isLast ? '  ' : '│'}\n`;
        });

        menuText += `\n━━━━━━━━━━━━━━━━━━━━━━━

💡 *How to Use*

`;

        // Show usage examples
        if (prefixes.length > 1) {
            menuText += `┌─ Multiple Prefixes Available\n`;
            prefixes.slice(0, 3).forEach((p, i) => {
                menuText += `│  ${i + 1}. ${p}help\n`;
            });
            menuText += `│\n`;
        }

        if (allowNoPrefix) {
            menuText += `├─ No Prefix Needed!\n`;
            menuText += `│  Just type: help\n`;
            menuText += `│\n`;
        }

        menuText += `└─ Get Command Info\n`;
        menuText += `   ${defaultPrefix}help <command>\n`;

        menuText += `\n━━━━━━━━━━━━━━━━━━━━━━━

🔥 *POPULAR COMMANDS*

┌─ 🤖 AI Assistant
│  ${defaultPrefix}gemini <question>
│
├─ 📥 Downloads
│  ${defaultPrefix}tiktok <url>
│  ${defaultPrefix}ig <url>
│  ${defaultPrefix}ytmp3 <url>
│
├─ 🎨 Media Tools
│  ${defaultPrefix}sticker (reply image)
│  ${defaultPrefix}toimg (reply sticker)
│
├─ 🎮 Fun & Games
│  ${defaultPrefix}meme
│  ${defaultPrefix}quote
│
└─ 💾 Status Saver
   ${defaultPrefix}save (reply status)

━━━━━━━━━━━━━━━━━━━━━━━

📱 *CONNECT WITH US*

┌─ Telegram Group
│  ${config.social.telegram}
│
└─ WhatsApp Channel
   ${config.social.whatsappChannel}

━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 *DEVELOPER INFO*

Name: ${config.creator.name}
Contact: wa.me/${config.creator.number}
Email: ${config.creator.email}

━━━━━━━━━━━━━━━━━━━━━━━

✨ _${config.bot.name} v${config.bot.version}_
💚 _Made with love by ${config.creator.name}_

`;

        await sock.sendMessage(sender, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: `${config.bot.name} - Main Menu`,
                    body: `${totalCommands} Commands • ${totalCategories} Categories`,
                    thumbnailUrl: 'https://i.ibb.co/2M7YJnm/bot-menu.png',
                    sourceUrl: config.social.telegram,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        
        logging.success(`[MENU] Sent main menu to user`);
    },

    async _sendCategoryView(sock, sender, categoryName, categoryCommands, allCommands, defaultPrefix) {
        const sortedCmds = categoryCommands.sort((a, b) => a.name.localeCompare(b.name));
        const emoji = this._getCategoryEmoji(categoryName);
        
        let text = `
╔═══════════════════════╗
║   ${emoji} *${categoryName.toUpperCase()}*   ║
╚═══════════════════════╝

📦 *${sortedCmds.length}* command${sortedCmds.length > 1 ? 's' : ''} in this category

━━━━━━━━━━━━━━━━━━━━━━━

`;

        sortedCmds.forEach((item, index) => {
            const { name, cmd } = item;
            const isLast = index === sortedCmds.length - 1;
            
            text += `${isLast ? '└' : '├'}─ *${defaultPrefix}${name}*\n`;
            
            if (cmd.description) {
                const shortDesc = cmd.description.length > 45 
                    ? cmd.description.substring(0, 45) + '...' 
                    : cmd.description;
                text += `${isLast ? '  ' : '│'}  📝 ${shortDesc}\n`;
            }
            
            if (cmd.usage) {
                text += `${isLast ? '  ' : '│'}  💡 ${cmd.usage}\n`;
            }
            
            if (cmd.aliases && cmd.aliases.length > 0) {
                const aliasesList = cmd.aliases.slice(0, 2).join(', ');
                text += `${isLast ? '  ' : '│'}  🔄 ${aliasesList}\n`;
            }
            
            if (!isLast) {
                text += `│\n`;
            }
        });

        text += `\n━━━━━━━━━━━━━━━━━━━━━━━

💡 *Quick Tips*

• Get details: ${defaultPrefix}help <command>
• Try: ${defaultPrefix}help ${sortedCmds[0].name}
• Back to menu: ${defaultPrefix}menu

━━━━━━━━━━━━━━━━━━━━━━━

🔗 *Related Categories*

`;

        // Show related categories
        const allCategories = new Set();
        allCommands.forEach(cmd => allCategories.add(cmd.category || 'Other'));
        const otherCategories = Array.from(allCategories)
            .filter(cat => cat !== categoryName)
            .sort()
            .slice(0, 3);

        otherCategories.forEach((cat, i) => {
            const catEmoji = this._getCategoryEmoji(cat);
            text += `${i === otherCategories.length - 1 ? '└' : '├'}─ ${catEmoji} ${cat}\n`;
            text += `${i === otherCategories.length - 1 ? '  ' : '│'}  ${defaultPrefix}menu ${cat.toLowerCase()}\n`;
        });

        text += `\n━━━━━━━━━━━━━━━━━━━━━━━

_${config.bot.name} • ${categoryName}_`;

        await sock.sendMessage(sender, { 
            text,
            contextInfo: {
                externalAdReply: {
                    title: `${categoryName} Commands`,
                    body: `${sortedCmds.length} commands available`,
                    thumbnailUrl: 'https://i.ibb.co/2M7YJnm/bot-menu.png',
                    sourceUrl: config.social.telegram,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
        
        logging.success(`[MENU] Sent ${categoryName} category`);
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
            'Social': '💬',
            'Education': '📚',
            'Music': '🎵',
            'News': '📰',
            'Shopping': '🛒',
            'Food': '🍔',
            'Travel': '✈️',
            'Sports': '⚽',
            'Business': '💼',
            'Other': '📦'
        };
        
        return emojiMap[category] || '⭐';
    }
};