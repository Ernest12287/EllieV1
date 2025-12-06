import config from '../config.js';
import logging from '../logger.js';
import { getAFKData } from './afk.js';
import { getChatJid } from '../utils/jidHelper.js';
function formatAFKTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

export default {
    name: 'afklist',
    aliases: ['afkusers', 'whoafk'],
    description: 'View list of all AFK users',
    usage: '.afklist',
    category: 'Personal',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const isGroup = sender.endsWith('@g.us');
        
        try {
            const afkData = getAFKData();
            const afkUsers = Object.entries(afkData);
            
            if (afkUsers.length === 0) {
                await sock.sendMessage(jid.chat, {
                    text: '📭 *No AFK Users*\n\nThere are currently no users in AFK mode.'
                }, { quoted: message });
                return;
            }
            
            // Filter for group members if in a group
            let filteredUsers = afkUsers;
            let groupMembers = [];
            
            if (isGroup) {
                try {
                    const groupMetadata = await sock.groupMetadata(sender);
                    groupMembers = groupMetadata.participants.map(p => p.id);
                    
                    filteredUsers = afkUsers.filter(([jid]) => 
                        groupMembers.includes(jid) || jid.includes(sender.split('@')[0])
                    );
                } catch (error) {
                    logging.error(`[AFKLIST] Error getting group metadata: ${error.message}`);
                }
            }
            
            if (filteredUsers.length === 0 && isGroup) {
                await sock.sendMessage(jid.chat, {
                    text: '📭 *No AFK Users in This Group*\n\nNo group members are currently AFK.'
                }, { quoted: message });
                return;
            }
            
            let listText = `💤 *AFK Users List*\n`;
            listText += `═══════════════════\n\n`;
            
            if (isGroup) {
                listText += `📊 *${filteredUsers.length} user${filteredUsers.length > 1 ? 's' : ''} AFK in this group*\n\n`;
            } else {
                listText += `📊 *${afkUsers.length} user${afkUsers.length > 1 ? 's' : ''} currently AFK*\n\n`;
            }
            
            const usersToShow = isGroup ? filteredUsers : afkUsers;
            const mentions = [];
            
            usersToShow.forEach(([jid, data], index) => {
                const number = jid.split('@')[0];
                const duration = formatAFKTime(data.time);
                const mentionCount = data.mentions || 0;
                
                listText += `${index + 1}. @${number}\n`;
                listText += `   📝 ${data.reason}\n`;
                listText += `   ⏰ ${duration}`;
                
                if (mentionCount > 0) {
                    listText += ` • 📬 ${mentionCount} mention${mentionCount > 1 ? 's' : ''}`;
                }
                
                listText += `\n\n`;
                mentions.push(jid);
            });
            
            listText += `═══════════════════\n`;
            listText += `_Use ${config.bot.preffix}afk [reason] to go AFK_`;
            
            await sock.sendMessage(jid.chat, {
                text: listText,
                mentions: mentions
            }, { quoted: message });
            
            logging.success(`[AFKLIST] Sent AFK list (${usersToShow.length} users)`);
            
        } catch (error) {
            logging.error(`[AFKLIST] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, {
                text: '❌ *Error*\n\nFailed to retrieve AFK list.'
            }, { quoted: message });
        }
    }
};