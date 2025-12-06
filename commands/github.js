import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'github',
    aliases: ['gh', 'githubuser'],
    description: 'Get GitHub user information',
    usage: '.github <username>',
    category: 'Tech',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 💻 GITHUB 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}github <username>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}github torvalds\n┃ ${config.bot.preffix}github gaearon\n┃ ${config.bot.preffix}github sindresorhus\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '💻 Fetching GitHub profile...' 
            });

            const username = args[0];
            const apiUrl = `https://api.github.com/users/${username}`;
            const response = await fetch(apiUrl);
            
            if (response.status === 200) {
                const data = await response.json();
                
                const githubText = `╭━━━『 💻 GITHUB USER 』\n┃\n┃ 👤 *${data.name || data.login}*\n┃ @${data.login}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 📝 Bio: ${data.bio || 'No bio'}\n┃ 📍 Location: ${data.location || 'Unknown'}\n┃ 🏢 Company: ${data.company || 'None'}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 📊 *Stats:*\n┃ 📦 Public Repos: ${data.public_repos}\n┃ 👥 Followers: ${data.followers}\n┃ 👤 Following: ${data.following}\n┃ ⭐ Public Gists: ${data.public_gists}\n┃\n┃ 🔗 ${data.html_url}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                if (data.avatar_url) {
                    await sock.sendMessage(jid.chat, {
                        image: { url: data.avatar_url },
                        caption: githubText
                    });
                } else {
                    await sock.sendMessage(jid.chat, { text: githubText });
                }
                
                logging.success(`[GITHUB] Sent profile for: ${username}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ GitHub user *"${username}"* not found!` 
                });
            }

        } catch (error) {
            logging.error(`[GITHUB] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch GitHub profile.' 
            });
        }
    }
};