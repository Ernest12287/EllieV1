import config from '../config.js';
import os from 'os';
import { getChatJid } from '../utils/jidHelper.js';
const getNumberFromJid = (jid) => {
    return jid.split('@')[0].split(':')[0];
};

const BOT_START_TIME = Date.now();
let lastReconnectTime = null;
let reconnectCount = 0;

export function updateReconnectInfo() {
    lastReconnectTime = Date.now();
    reconnectCount++;
}

export default {
    name: 'status',
    description: 'Show bot status',
    usage: '.status',
    category: 'Admin',
    adminOnly: true,
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        const ownerNumber = config.creator.number;
        
        const senderCleanNumber = getNumberFromJid(sender);
        if (ownerNumber !== senderCleanNumber) {
            await sock.sendMessage(jid.chat, { text: config.error.notadmin });
            return;
        }
        
        const uptimeMs = Date.now() - BOT_START_TIME;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        
        let lastReconnectText = 'Never';
        if (lastReconnectTime) {
            const timeSince = Date.now() - lastReconnectTime;
            const minutesAgo = Math.floor(timeSince / 60000);
            lastReconnectText = minutesAgo < 1 ? 'Just now' : `${minutesAgo} min ago`;
        }
        
        const connectionStatus = sock.user ? '🟢 Online' : '🔴 Offline';
        const memUsage = process.memoryUsage();
        const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);
        
        const statusText = `
╔═══════════════════════════╗
║   BOT STATUS REPORT       ║
╚═══════════════════════════╝

📡 *Connection*
├ Status: ${connectionStatus}
├ Reconnects: ${reconnectCount}
└ Last: ${lastReconnectText}

⏱️ *Uptime*
${days}d ${hours}h ${minutes}m ${seconds}s

💾 *Memory*
├ RSS: ${formatMB(memUsage.rss)} MB
├ Heap: ${formatMB(memUsage.heapUsed)} MB

🤖 *Bot Info*
├ Name: ${config.bot.name}
├ Version: ${config.bot.version}
└ Node: ${process.version}

✅ All systems operational
        `.trim();
        
        await sock.sendMessage(jid.chat, { text: statusText });
    }
};