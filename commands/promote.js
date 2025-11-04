import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'promote',
    description: 'Promote to admin',
    usage: '.promote @user',
    category: 'Group',
    
    async execute(sock, message) {
        const sender = message.key.remoteJid;
        
        if (!sender.endsWith('@g.us')) {
            await sock.sendMessage(sender, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;
            
            const senderIsAdmin = participants.find(p => 
                p.id === message.key.participant && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            if (!senderIsAdmin) {
                await sock.sendMessage(sender, { text: config.error.notadmin });
                return;
            }
            
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(sender, { 
                    text: `❌ Mention user\n\nUsage: ${config.bot.preffix}promote @user` 
                });
                return;
            }
            
            await sock.groupParticipantsUpdate(sender, mentioned, 'promote');
            
            let text = `✅ *Promoted*\n\n`;
            mentioned.forEach(user => {
                text += `👑 @${user.split('@')[0]}\n`;
            });
            
            await sock.sendMessage(sender, { text, mentions: mentioned });
            
            logging.success(`[PROMOTE] Promoted ${mentioned.length} user(s)`);
            
        } catch (error) {
            logging.error(`[PROMOTE] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed. Bot must be admin.' 
            });
        }
    }
};