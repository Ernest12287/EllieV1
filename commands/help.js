import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'help',
    aliases: ['h', 'cmd'],
    description: 'Get help for specific command',
    usage: '.help [command]',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const jid = getChatJid(message);
        const prefixes = config.bot.prefixes || [config.bot.preffix || '.'];
        const defaultPrefix = config.bot.defaultPrefix || prefixes[0];
        const allowNoPrefix = config.bot.allowNoPrefix;
        
        // If no args, show stunning quick help
        if (args.length === 0) {
            const totalCommands = commands.size;
            
            // Count categories
            const categories = new Set();
            commands.forEach(cmd => categories.add(cmd.category || 'Other'));
            
            let helpText = `┏━━━━━━━━━━━━━━━━━━━━┓
┃                                              ┃
┃      ✨ *${config.bot.name}* ✨         ┃
┃                                              ┃
┗━━━━━━━━━━━━━━━━━━━━┛

╭─────────────────────╮
│   🎯 *QUICK START*   │
╰─────────────────────╯

`;

            // Show prefix options beautifully
            if (prefixes.length > 1 || allowNoPrefix) {
                helpText += `⚡ *Multiple Ways to Use:*\n\n`;
                
                // Show first 3 prefixes
                prefixes.slice(0, 3).forEach((p, i) => {
                    helpText += `   ${i + 1}️⃣ ${p}help\n`;
                });
                
                if (allowNoPrefix) {
                    helpText += `   4️⃣ help _(no prefix!)_\n`;
                }
                
                helpText += `\n`;
            }

            helpText += `━━━━━━━━━━━━━━━━━━━━━━

📊 *Statistics*
├─ Commands: ${totalCommands}
├─ Categories: ${categories.size}
├─ Prefixes: ${prefixes.join(', ')}
${allowNoPrefix ? '└─ No-prefix: ✅ Enabled' : '└─ No-prefix: ❌ Disabled'}

━━━━━━━━━━━━━━━━━━━━━━

🎯 *Quick Commands*

┌─ 📋 View All
│  ${defaultPrefix}menu
│
├─ 🤖 AI Assistant  
│  ${defaultPrefix}gemini <question>
│
├─ 📥 Download
│  ${defaultPrefix}tiktok <url>
│  ${defaultPrefix}ig <url>
│
├─ 🎨 Media
│  ${defaultPrefix}sticker (reply image)
│  ${defaultPrefix}toimg (reply sticker)
│
└─ 💾 Save Status
   ${defaultPrefix}save (reply to status)

━━━━━━━━━━━━━━━━━━━━━━

💡 *Need More Help?*

• ${defaultPrefix}menu - Browse categories
• ${defaultPrefix}help <cmd> - Command info
• ${defaultPrefix}prefix - Check settings

━━━━━━━━━━━━━━━━━━━━━━

🔥 *Trending Now*
${defaultPrefix}meme  •  ${defaultPrefix}advice  •  ${defaultPrefix}quote

━━━━━━━━━━━━━━━━━━━━━━

📱 *Connect With Us*
Telegram: ${config.social.telegram}

━━━━━━━━━━━━━━━━━━━━━━

_${config.bot.name} v${config.bot.version}_
_Made with 💚 by ${config.creator.name}_`;
            
            await sock.sendMessage(jid.chat, { 
                text: helpText,
                contextInfo: {
                    externalAdReply: {
                        title: `${config.bot.name} - Help Center`,
                        body: `${totalCommands} Commands • ${categories.size} Categories`,
                        thumbnailUrl: 'https://i.ibb.co/0cMQz4P/help-icon.png',
                        sourceUrl: config.social.telegram,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        }

        // Get specific command help
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName);
        
        if (!command) {
            // Try to find similar commands (fuzzy search)
            const similar = [];
            commands.forEach((cmd, name) => {
                if (name.includes(commandName) || commandName.includes(name)) {
                    similar.push(name);
                }
                if (cmd.aliases?.some(alias => 
                    alias.includes(commandName) || commandName.includes(alias)
                )) {
                    similar.push(name);
                }
            });
            
            let notFoundText = `┏━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ *COMMAND NOT FOUND*   ┃
┗━━━━━━━━━━━━━━━━━━━━┛

🔍 Looking for: *"${commandName}"*

`;
            
            if (similar.length > 0) {
                const uniqueSimilar = [...new Set(similar)];
                notFoundText += `━━━━━━━━━━━━━━━━━━━━━━

💡 *Did You Mean?*

`;
                uniqueSimilar.slice(0, 5).forEach((cmd, i) => {
                    notFoundText += `${i + 1}. ${defaultPrefix}${cmd}\n`;
                });
                
                notFoundText += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            } else {
                notFoundText += `━━━━━━━━━━━━━━━━━━━━━━

⚠️ No similar commands found

━━━━━━━━━━━━━━━━━━━━━━

`;
            }
            
            notFoundText += `📚 *Browse All Commands*
${defaultPrefix}menu - View categories
${defaultPrefix}menu <category> - View category

━━━━━━━━━━━━━━━━━━━━━━

_Try checking the spelling or use ${defaultPrefix}menu_`;
            
            await sock.sendMessage(jid.chat, { text: notFoundText });
        }

        // Show BEAUTIFUL detailed command help
        let cmdHelp = `┏━━━━━━━━━━━━━━━━━━━━┓
┃   📖 *COMMAND DETAILS*   ┃
┗━━━━━━━━━━━━━━━━━━━━┛

`;

        // Command name with emoji based on category
        const categoryEmoji = this._getCategoryEmoji(command.category);
        cmdHelp += `${categoryEmoji} *${command.name.toUpperCase()}*\n\n`;
        
        cmdHelp += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Description
        if (command.description) {
            cmdHelp += `📝 *Description*\n${command.description}\n\n`;
            cmdHelp += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
        
        // Usage examples with all prefixes
        if (command.usage) {
            cmdHelp += `💡 *Usage*\n${command.usage}\n\n`;
            
            // Show multiple ways to use
            cmdHelp += `⚡ *Try These:*\n`;
            prefixes.slice(0, 2).forEach((p, i) => {
                cmdHelp += `   ${i + 1}. ${p}${command.name}${args[1] ? ' ' + args.slice(1).join(' ') : ''}\n`;
            });
            if (allowNoPrefix) {
                cmdHelp += `   3. ${command.name} _(no prefix)_\n`;
            }
            cmdHelp += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
        
        // Aliases
        if (command.aliases && command.aliases.length > 0) {
            cmdHelp += `🔄 *Alternative Names*\n`;
            command.aliases.forEach((alias, i) => {
                cmdHelp += `   ${i + 1}. ${defaultPrefix}${alias}\n`;
            });
            cmdHelp += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
        
        // Category
        if (command.category) {
            cmdHelp += `📂 *Category*\n${command.category}\n\n`;
            cmdHelp += `_View more: ${defaultPrefix}menu ${command.category.toLowerCase()}_\n\n`;
            cmdHelp += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
        
        // Footer
        cmdHelp += `💬 *Need More Help?*\n`;
        cmdHelp += `Contact: wa.me/${config.creator.number}\n\n`;
        cmdHelp += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        cmdHelp += `_${config.bot.name} • ${command.category || 'General'}_`;

        await sock.sendMessage(jid.chat, { 
            text: cmdHelp,
            contextInfo: {
                externalAdReply: {
                    title: `${command.name.toUpperCase()} - Command Help`,
                    body: command.description || 'View command details',
                    thumbnailUrl: 'https://i.ibb.co/0cMQz4P/help-icon.png',
                    sourceUrl: config.social.telegram,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
        
        logging.success(`[HELP] Sent help for: ${commandName}`);
    },
    
    _getCategoryEmoji(category) {
        const emojiMap = {
            'AI': '🤖',
            'Download': '📥',
            'Downloader': '📥',
            'Media': '🎬',
            'Fun': '🎮',
            'Game': '🎮',
            'Utility': '🔧',
            'Tools': '🔧',
            'Image': '🖼️',
            'Sticker': '🎨',
            'Info': 'ℹ️',
            'Group': '👥',
            'Admin': '👑',
            'Owner': '👑',
            'Search': '🔍',
            'Bible': '📖',
            'Other': '📦'
        };
        return emojiMap[category] || '⭐';
    }
};