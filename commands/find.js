import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
// Assumes 'fetch' is available (Node.js v18+), or 'node-fetch' is imported if older Node version.
// import fetch from 'node-fetch'; 

export default {
    name: 'find',
    aliases: ['image', 'searchimage', 'img'],
    description: 'Search for an image using the GiftedTech Google Image search API.',
    usage: `${config.bot.preffix}find <search query>`,
    category: 'Media',

    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        // 1. Input Validation
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🖼️ IMAGE FINDER 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}find <search query>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}find golden retriever puppy\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔍 Searching for your image...' 
            });

            const query = args.join(' ');
            
            // 2. Construct the API URL
            // Ensure the query is URL-encoded and apikey=gifted is included.
            const encodedQuery = encodeURIComponent(query);
            const apiUrl = `https://api.giftedtech.co.ke/api/search/googleimage?apikey=gifted&query=${encodedQuery}`;
            
            // 3. Fetch the data
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // Handle non-200 responses
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // 4. Process the Response
            
            // Check for success and if the results array contains anything
            if (data.success && Array.isArray(data.results) && data.results.length > 0) {
                // Get the URL of the first image
                const imageUrl = data.results[0];
                
                // 5. Send the image back
                await sock.sendMessage(jid.chat, {
                    image: { url: imageUrl },
                    caption: `🖼️ First result for *"${query}"*`
                });
                
                logging.success(`[IMAGE] Sent image for: ${query}`);
                
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Image not found for *"${query}"*. Please try a different search query.`
                });
            }

        } catch (error) {
            logging.error(`[IMAGE] Error fetching data: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ An unexpected error occurred while fetching the image.`
            });
        }
    }
};