import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
// ============================================
// PREFIX TEST COMMAND
// Demonstrates multi-prefix functionality
// ============================================
export default {
    name: 'prefix',
    aliases: ['prefixes', 'prefixtest'],
    description: 'Test multi-prefix functionality and see all available prefixes',
    usage: '.prefix',
    category: 'Info',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        try {
            const prefixes = config.bot.prefixes || ['.'];
            const allowNoPrefix = config.bot.allowNoPrefix;
            const defaultPrefix = config.bot.defaultPrefix || prefixes[0];
            
            // Create visual prefix examples
            const exampleCommand = 'help';
            const prefixExamples = prefixes.map(p => `${p}${exampleCommand}`).join('\n   ');
            
            let response = `╭━━━━━━━━━━━━━━━━━━━━━━╮\n`;
            response += `┃  🎯 *PREFIX SETTINGS*  ┃\n`;
            response += `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
            
            // Active Prefixes
            response += `✅ *Active Prefixes:*\n`;
            response += `   ${prefixes.map(p => `\`${p}\``).join(' ')}\n\n`;
            
            // No-Prefix Status
            response += `🔓 *No-Prefix Mode:* ${allowNoPrefix ? '✅ ENABLED' : '❌ DISABLED'}\n\n`;
            
            // Default Prefix
            response += `⭐ *Default Prefix:* \`${defaultPrefix}\`\n`;
            response += `   _(Used in help messages)_\n\n`;
            
            // Examples Section
            response += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            response += `💡 *How to Use Commands:*\n\n`;
            
            // With Prefix Examples
            response += `📌 *With Prefix:*\n`;
            response += `   ${prefixExamples}\n\n`;
            
            // No Prefix Example
            if (allowNoPrefix) {
                response += `📌 *Without Prefix:*\n`;
                response += `   ${exampleCommand}\n\n`;
                response += `   _All options work!_ ✨\n\n`;
            } else {
                response += `❌ No-prefix mode is disabled\n\n`;
            }
            
            // Test Examples
            response += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            response += `🧪 *Try These Tests:*\n\n`;
            
            prefixes.forEach((prefix, index) => {
                response += `${index + 1}. Type: \`${prefix}ping\`\n`;
            });
            
            if (allowNoPrefix) {
                response += `${prefixes.length + 1}. Type: \`ping\` (no prefix)\n`;
            }
            
            response += `\n_All should work!_ 🎉\n\n`;
            
            // Statistics
            response += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            response += `📊 *Configuration:*\n`;
            response += `   • Total Prefixes: ${prefixes.length}\n`;
            response += `   • No-Prefix: ${allowNoPrefix ? 'Yes' : 'No'}\n`;
            response += `   • Total Options: ${allowNoPrefix ? prefixes.length + 1 : prefixes.length}\n\n`;
            
            // Footer
            response += `╭━━━━━━━━━━━━━━━━━━━━━━╮\n`;
            response += `┃  ${config.bot.name}  ┃\n`;
            response += `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
            
            await sock.sendMessage(jid.chat, { 
                text: response 
            }, { quoted: message });
            
            logging.success(`[PREFIX] Sent prefix info to ${sender}`);
            
        } catch (error) {
            logging.error(`[PREFIX] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to get prefix information.' 
            }, { quoted: message });
        }
    }
};