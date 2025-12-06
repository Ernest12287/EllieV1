import config from '../config.js';
import os from 'os';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'info',
    description: 'Display bot and system information',
    usage: '.info',
    category: 'System',
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        
        try {
            const platform = os.platform();
            const arch = os.arch();
            const hostname = os.hostname();
            const uptimeSeconds = os.uptime();
            const cpus = os.cpus();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            
            const days = Math.floor(uptimeSeconds / 86400);
            const hours = Math.floor((uptimeSeconds % 86400) / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const uptimeFormatted = `${days}d ${hours}h ${minutes}m`;
            
            const formatBytes = (bytes) => {
                const gb = (bytes / (1024 ** 3)).toFixed(2);
                return `${gb} GB`;
            };
            
            const memoryUsedPercent = ((usedMem / totalMem) * 100).toFixed(2);
            const memoryFreePercent = ((freeMem / totalMem) * 100).toFixed(2);
            
            const cpuModel = cpus[0]?.model || 'Unknown';
            const cpuCores = cpus.length;
            const cpuSpeed = cpus[0]?.speed ? `${cpus[0].speed} MHz` : 'Unknown';
            
            const platformNames = {
                'win32': 'Windows',
                'darwin': 'macOS',
                'linux': 'Linux'
            };
            const platformName = platformNames[platform] || platform;
            
            const infoText = `
╔═══════════════════════════╗
║   BOT INFORMATION         ║
╚═══════════════════════════╝

🤖 *Bot Details*
├ Name: ${config.bot.name}
├ Version: ${config.bot.version}
└ Prefix: ${config.bot.preffix}

━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 *System Information*
├ Platform: ${platformName}
├ Architecture: ${arch}
├ Hostname: ${hostname}
└ Uptime: ${uptimeFormatted}

━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 *CPU Information*
├ Model: ${cpuModel}
├ Cores: ${cpuCores}
└ Speed: ${cpuSpeed}

━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 *Memory Information*
├ Total: ${formatBytes(totalMem)}
├ Used: ${formatBytes(usedMem)} (${memoryUsedPercent}%)
├ Free: ${formatBytes(freeMem)} (${memoryFreePercent}%)
└ Available: ${memoryFreePercent}%

━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *Node.js*
├ Version: ${process.version}
└ PID: ${process.pid}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Made with ❤️ using baileys
            `.trim();
            
            await sock.sendMessage(jid.chat, { text: infoText });
            
        } catch (error) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Could not load system information` 
            });
        }
    }
};