import config from '../config.js';
import logging from '../logger.js';
import os from 'os';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'about',
    aliases: ['info', 'botinfo', 'stats'],
    description: 'Get detailed information about the bot',
    usage: '.about',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const jid = getChatJid(message);
        const prefixes = config.bot.prefixes || [config.bot.preffix || '.'];
        const defaultPrefix = config.bot.defaultPrefix || prefixes[0];
        const allowNoPrefix = config.bot.allowNoPrefix;
        
        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        let uptimeStr = '';
        if (days > 0) uptimeStr += `${days}d `;
        if (hours > 0) uptimeStr += `${hours}h `;
        if (minutes > 0) uptimeStr += `${minutes}m `;
        uptimeStr += `${seconds}s`;
        
        // Memory usage
        const memUsage = process.memoryUsage();
        const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        // Platform info
        const platform = os.platform();
        const nodeVersion = process.version;
        
        // Count categories
        const categories = new Set();
        commands.forEach(cmd => categories.add(cmd.category || 'Other'));
        
        let aboutText = `
╔═══════════════════════════════╗
║                                                            ║
║        🌟 *BOT INFORMATION* 🌟           ║
║                                                            ║
╚═══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🤖 *${config.bot.name}*   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

💬 Your intelligent WhatsApp assistant
   powered by advanced technology

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *STATISTICS*

┌─ Commands Available
│  ${commands.size} commands
│
├─ Categories
│  ${categories.size} categories
│
├─ Active Prefixes
│  ${prefixes.join(', ')}
│
├─ No-Prefix Mode
│  ${allowNoPrefix ? '✅ Enabled' : '❌ Disabled'}
│
└─ Version
   v${config.bot.version}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ *SYSTEM INFO*

┌─ Uptime
│  ${uptimeStr}
│
├─ Memory Usage
│  ${memUsedMB} MB / ${memTotalMB} MB
│
├─ Platform
│  ${platform}
│
└─ Node.js
   ${nodeVersion}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *FEATURES*

┌─ 🤖 AI Integration
│  Smart responses with Gemini AI
│
├─ 📥 Multi-Platform Downloads
│  TikTok, Instagram, YouTube, FB
│
├─ 🎨 Media Processing
│  Stickers, images, filters
│
├─ 👥 Group Management
│  Admin tools, moderation
│
├─ 🎮 Fun & Entertainment
│  Games, memes, quotes
│
└─ 🔧 Utility Tools
   Calculator, weather, search

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *QUICK START*

• View commands: ${defaultPrefix}menu
• Get help: ${defaultPrefix}help <command>
• Check prefix: ${defaultPrefix}prefix
• Popular: ${defaultPrefix}gemini, ${defaultPrefix}tiktok

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 *DEVELOPER*

Name: ${config.creator.name}
Contact: wa.me/${config.creator.number}
Email: ${config.creator.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *SOCIAL LINKS*

┌─ Telegram Group
│  ${config.social.telegram}
│
└─ WhatsApp Channel
   ${config.social.whatsappChannel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 *WHY CHOOSE ${config.bot.name}?*

✅ Fast & Reliable
✅ Regular Updates
✅ 24/7 Availability
✅ User-Friendly
✅ Multi-Feature
✅ Active Support

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💚 _Made with love by ${config.creator.name}_
🚀 _Powered by baileys_

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 *Ready to explore?*
Type ${defaultPrefix}menu to get started!
`;

        await sock.sendMessage(jid.chat, { 
            text: aboutText,
            contextInfo: {
                externalAdReply: {
                    title: `${config.bot.name} v${config.bot.version}`,
                    body: `${commands.size} Commands • ${uptimeStr} Uptime`,
                    thumbnailUrl: 'https://i.ibb.co/YRK0sDR/bot-info.png',
                    sourceUrl: config.social.telegram,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        
        logging.success(`[ABOUT] Sent bot info to ${sender}`);
    }
};