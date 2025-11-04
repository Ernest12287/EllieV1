import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'npm',
    aliases: ['npmjs', 'package'],
    description: 'Search NPM packages',
    usage: '.npm <package name>',
    category: 'Tech',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 📦 NPM SEARCH 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}npm <package>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}npm express\n┃ ${config.bot.preffix}npm react\n┃ ${config.bot.preffix}npm axios\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '📦 Searching NPM...' 
            });

            const packageName = args.join('-');
            const apiUrl = `https://registry.npmjs.org/${packageName}`;
            const response = await fetch(apiUrl);
            
            if (response.status === 200) {
                const data = await response.json();
                const latest = data['dist-tags']?.latest;
                const info = data.versions[latest];
                
                const npmText = `╭━━━『 📦 NPM PACKAGE 』\n┃\n┃ 📦 *${data.name}*\n┃ v${latest}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 📝 ${data.description || 'No description'}\n┃\n┃ 👤 Author: ${info.author?.name || 'Unknown'}\n┃ 📜 License: ${info.license || 'Unknown'}\n┃ 📅 Updated: ${new Date(data.time[latest]).toDateString()}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 💾 Install:\n┃ npm i ${data.name}\n┃\n┃ 🔗 ${`https://npmjs.com/package/${data.name}`}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: npmText });
                logging.success(`[NPM] Sent info for: ${packageName}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ Package *"${packageName}"* not found on NPM!` 
                });
            }

        } catch (error) {
            logging.error(`[NPM] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch NPM package.' 
            });
        }
    }
};