import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'topdf',
    aliases: ['makepdf', 'pdf'],
    description: 'Convert text or URL to PDF',
    usage: '.topdf <text/url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📄 TO PDF 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}topdf <text>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}topdf Hello World\n┃ ${config.bot.preffix}topdf https://example.com\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '📄 Creating PDF...' 
            });

            const query = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/topdf?apikey=gifted&query=${encodeURIComponent(query)}`;
            
            await sock.sendMessage(sender, {
                document: { url: apiUrl },
                mimetype: 'application/pdf',
                fileName: `document_${Date.now()}.pdf`,
                caption: `╭━━━『 📄 PDF CREATED 』\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`
            });
            
            logging.success(`[TOPDF] PDF created`);

        } catch (error) {
            logging.error(`[TOPDF] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Error creating PDF!` 
            });
        }
    }
};