import config from '../config.js';
import logging from '../logger.js';
import os from 'os';

export default {
    name: 'stats',
    aliases: ['statistics', 'botstats'],
    description: 'View bot statistics and performance',
    usage: '.stats',
    category: 'Info',
    
    async execute(sock, message, args, commands) {
        const sender = message.key.remoteJid;
        
        try {
            // Get command categories
            const categories = {};
            commands.forEach(cmd => {
                const cat = cmd.category || 'Other';
                categories[cat] = (categories[cat] || 0) + 1;
            });
            
            // Sort categories by count
            const sortedCategories = Object.entries(categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            // System info
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const memUsage = process.memoryUsage();
            const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
            const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
            
            const cpuUsage = os.loadavg()[0].toFixed(2);
            const platform = os.platform();
            const nodeVersion = process.version;
            
            let statsText = `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
            statsText += `┃   📊 BOT STATISTICS   ┃\n`;
            statsText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
            
            statsText += `╭━━━『 🤖 BOT INFO 』\n┃\n`;
            statsText += `┃ 📛 Name: ${config.bot.name}\n`;
            statsText += `┃ 📦 Version: ${config.bot.version}\n`;
            statsText += `┃ ⚡ Prefix: ${config.bot.preffix}\n`;
            statsText += `┃ 📊 Total Commands: *${commands.size}*\n`;
            statsText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n`;
            
            statsText += `╭━━━『 📂 CATEGORIES 』\n┃\n`;
            sortedCategories.forEach(([cat, count]) => {
                const percentage = ((count / commands.size) * 100).toFixed(1);
                const bars = '█'.repeat(Math.floor(percentage / 10));
                statsText += `┃ ${cat}: ${count}\n`;
                statsText += `┃ ${bars} ${percentage}%\n┃\n`;
            });
            statsText += `╰━━━━━━━━━━━━━━━⬣\n\n`;
            
            statsText += `╭━━━『 💻 SYSTEM 』\n┃\n`;
            statsText += `┃ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n`;
            statsText += `┃ 🧠 Memory: ${memUsedMB}/${memTotalMB} MB\n`;
            statsText += `┃ 📈 CPU Load: ${cpuUsage}\n`;
            statsText += `┃ 🖥️ Platform: ${platform}\n`;
            statsText += `┃ 🟢 Node: ${nodeVersion}\n`;
            statsText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n`;
            
            statsText += `╭━━━『 👤 CREATOR 』\n┃\n`;
            statsText += `┃ 👨‍💻 ${config.creator.name}\n`;
            statsText += `┃ 📱 wa.me/${config.creator.number}\n`;
            statsText += `┃ 📧 ${config.creator.email}\n`;
            statsText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n`;
            
            statsText += `📱 *Socials:*\n`;
            statsText += `• Telegram: ${config.social.telegram}\n`;
            statsText += `• WhatsApp: ${config.social.whatsappChannel}\n\n`;
            
            statsText += `_Bot is running smoothly! 🚀_`;
            
            await sock.sendMessage(sender, { 
                text: statsText,
                contextInfo: {
                    externalAdReply: {
                        title: `${config.bot.name} Statistics`,
                        body: `${commands.size} Commands | Uptime: ${hours}h ${minutes}m`,
                        thumbnailUrl: '',
                        sourceUrl: config.social.telegram,
                        mediaType: 1
                    }
                }
            });
            
            logging.success('[STATS] Statistics sent');
            
        } catch (error) {
            logging.error(`[STATS] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to get statistics!' 
            });
        }
    }
};