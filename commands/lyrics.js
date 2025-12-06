import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
// Assumes 'fetch' is available (Node.js v18+), or 'node-fetch' is imported if older Node version.
// If your environment is older, uncomment the line below:
// import fetch from 'node-fetch'; 

export default {
    name: 'lyrics',
    aliases: ['lyric', 'song'],
    description: 'Search for song lyrics using the GiftedTech API.',
    usage: `${config.bot.preffix}lyrics <Song Title/Artist>`,
    category: 'Media',

    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        // 1. Input Validation
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🎶 LYRICS SEARCH 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}lyrics <Song Title/Artist>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}lyrics Dynasty Miia\n┃ ${config.bot.preffix}lyrics Bohemian Rhapsody\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🎼 Searching for lyrics...' 
            });

            const query = args.join(' ');
            
            // 2. Construct the API URL
            // Ensure the query is URL-encoded to handle spaces and special characters.
            const encodedQuery = encodeURIComponent(query);
            const apiUrl = `https://api.giftedtech.co.ke/api/search/lyrics?apikey=gifted&query=${encodedQuery}`;
            
            // 3. Fetch the data
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // Handle non-200 responses (e.g., 404, 500)
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // 4. Process the Response
            
            // Check for success flag/result property (based on the sample JSON you provided)
            if (data.success && data.result && data.result.lyrics) {
                const result = data.result;
                
                // Format the final message
                const lyricsText = `╭━━━『 🎤 SONG LYRICS 』\n┃\n┃ 🎵 *Title:* ${result.title || 'Unknown'}\n┃ 🎤 *Artist:* ${result.artist || 'Unknown'}\n┃\n┃━━━━━━━━━━━━━━\n┃\n${result.lyrics}\n┃\n┃ 🔗 Full Link: ${result.link || 'N/A'}\n╰━━━━━━━━━━━━━━━⬣`;
                
                // 5. Send the result (with image if available, like in your github command)
                if (result.image) {
                    await sock.sendMessage(jid.chat, {
                        image: { url: result.image },
                        caption: lyricsText
                    });
                } else {
                    await sock.sendMessage(jid.chat, { text: lyricsText });
                }
                
                logging.success(`[LYRICS] Sent lyrics for: ${result.title} by ${result.artist}`);
                
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Lyrics not found for *"${query}"*. Please try another title or artist.`
                });
            }

        } catch (error) {
            logging.error(`[LYRICS] Error fetching data: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ An unexpected error occurred while fetching the lyrics.`
            });
        }
    }
};