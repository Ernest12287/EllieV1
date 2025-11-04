import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'tagall',
    description: 'Tag all members',
    usage: '.tagall <message>',
    category: 'Group',
    
    async execute(sock, message, args) {
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
            
            const tagMessage = args.length > 0 ? args.join(' ') : 'Attention everyone!';
            let mentions = participants.map(p => p.id);
            
            let text = `╔═══════════════════╗\n`;
            text += `║   📢 *TAG ALL*    ║\n`;
            text += `╚═══════════════════╝\n\n`;
            text += `${tagMessage}\n\n`;
            text += `┌─────────────────\n`;
            
            participants.forEach((p, i) => {
                text += `│ ${i + 1}. @${p.id.split('@')[0]}\n`;
            });
            
            text += `└─────────────────\n\n`;
            text += `👥 Total: ${participants.length}\n`;
            text += `🤖 ${config.bot.name}`;
            
            await sock.sendMessage(sender, { text, mentions });
            
            logging.success(`[TAGALL] Tagged ${participants.length} members`);
            
        } catch (error) {
            logging.error(`[TAGALL] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Failed to tag members.' });
        }
    }
};