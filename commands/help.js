import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'help',
    aliases: ['h', 'cmd'],
    description: 'Get help for specific command',
    usage: '.help [command]',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const sender = message.key.remoteJid;
        
        // If no args, show quick help
        if (args.length === 0) {
            const totalCommands = commands.size;
            
            let helpText = `╭━━━『 ℹ️ HELP 』\n┃\n`;
            helpText += `┃ 🤖 *${config.bot.name}*\n`;
            helpText += `┃ 📊 ${totalCommands} Commands Available\n┃\n`;
            helpText += `┃━━━━━━━━━━━━━━\n┃\n`;
            helpText += `┃ 💡 *Quick Commands:*\n`;
            helpText += `┃ • ${config.bot.preffix}menu - View all categories\n`;
            helpText += `┃ • ${config.bot.preffix}help <cmd> - Command info\n`;
            helpText += `┃ • ${config.bot.preffix}aimenu - AI commands\n┃\n`;
            helpText += `┃━━━━━━━━━━━━━━\n┃\n`;
            helpText += `┃ 🔥 *Popular:*\n`;
            helpText += `┃ • ${config.bot.preffix}gemini <question>\n`;
            helpText += `┃ • ${config.bot.preffix}tiktok <url>\n`;
            helpText += `┃ • ${config.bot.preffix}sticker (reply image)\n`;
            helpText += `┃ • ${config.bot.preffix}save (reply status)\n`;
            helpText += `┃ • ${config.bot.preffix}meme\n┃\n`;
            helpText += `╰━━━━━━━━━━━━━━━⬣\n\n`;
            helpText += `_Type ${config.bot.preffix}menu to see all commands_`;
            
            return await sock.sendMessage(sender, { text: helpText });
        }

        // Get specific command help
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName);
        
        if (!command) {
            // Try to find similar commands
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
            
            let notFoundText = `╭━━━『 ❌ NOT FOUND 』\n┃\n`;
            notFoundText += `┃ Command *"${commandName}"* not found!\n┃\n`;
            
            if (similar.length > 0) {
                notFoundText += `┃━━━━━━━━━━━━━━\n┃\n`;
                notFoundText += `┃ 💡 Did you mean:\n`;
                similar.slice(0, 5).forEach(cmd => {
                    notFoundText += `┃ • ${config.bot.preffix}${cmd}\n`;
                });
                notFoundText += `┃\n`;
            }
            
            notFoundText += `╰━━━━━━━━━━━━━━━⬣\n\n`;
            notFoundText += `_Use ${config.bot.preffix}menu to see all commands_`;
            
            return await sock.sendMessage(sender, { text: notFoundText });
        }

        // Show detailed command help
        let cmdHelp = `╭━━━『 ℹ️ COMMAND INFO 』\n┃\n`;
        cmdHelp += `┃ 📝 *Command:* ${config.bot.preffix}${command.name}\n┃\n`;
        
        if (command.aliases && command.aliases.length > 0) {
            cmdHelp += `┃ 🔄 *Aliases:*\n`;
            command.aliases.forEach(alias => {
                cmdHelp += `┃ • ${config.bot.preffix}${alias}\n`;
            });
            cmdHelp += `┃\n`;
        }
        
        cmdHelp += `┃━━━━━━━━━━━━━━\n┃\n`;
        
        if (command.description) {
            cmdHelp += `┃ 📖 *Description:*\n`;
            cmdHelp += `┃ ${command.description}\n┃\n`;
        }
        
        if (command.usage) {
            cmdHelp += `┃ 💡 *Usage:*\n`;
            cmdHelp += `┃ ${command.usage}\n┃\n`;
        }
        
        if (command.category) {
            cmdHelp += `┃ 📂 *Category:* ${command.category}\n┃\n`;
        }
        
        cmdHelp += `╰━━━━━━━━━━━━━━━⬣\n\n`;
        cmdHelp += `_${config.bot.name}_`;

        await sock.sendMessage(sender, { text: cmdHelp });
        logging.success(`[HELP] Sent help for: ${commandName}`);
    }
};