import config from '../config.js';

export default {
    name: 'movie',
    description: 'Search for movie information',
    usage: '.movie <movie title>',
    category: 'Entertainment',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}movie <movie title>\n\nExamples:\n• ${config.bot.preffix}movie "Inception"\n• ${config.bot.preffix}movie "The Godfather"\n• ${config.bot.preffix}movie "Avengers Endgame"`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Searching movie database...' 
            });

            const query = args.join(' ');
            const apiKey = config.apikeys.tmdb || 'your_tmdb_key_here'; // Get free key from TMDB
            
            // Try TMDB first
            let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
            
            const response = await fetch(apiUrl);
            let data;

            if (response.ok) {
                data = await response.json();
            } else {
                // Fallback: Use OMDb API (free, get key from http://www.omdbapi.com/apikey.aspx)
                const omdbKey = config.apikeys.omdb || '3329343f';
                const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${encodeURIComponent(query)}`;
                const omdbResponse = await fetch(omdbUrl);
                data = await omdbResponse.json();
            }

            if (data.results && data.results.length > 0) {
                const movie = data.results[0];
                await this._sendMovieInfo(sock, sender, movie, apiKey);
            } else if (data.Title) {
                // OMDb response
                const movieInfo = `🎬 *${data.Title}* (${data.Year})\n\n` +
                                 `📊 *IMDb Rating:* ${data.imdbRating}/10 ⭐\n` +
                                 `⏱️ *Runtime:* ${data.Runtime}\n` +
                                 `🎭 *Genre:* ${data.Genre}\n` +
                                 `👤 *Director:* ${data.Director}\n` +
                                 `👥 *Cast:* ${data.Actors}\n` +
                                 `📖 *Plot:* ${data.Plot}\n` +
                                 `🏆 *Awards:* ${data.Awards}`;

                await sock.sendMessage(sender, { text: movieInfo });
                
                if (data.Poster && data.Poster !== 'N/A') {
                    await sock.sendMessage(sender, {
                        image: { url: data.Poster },
                        caption: `🎬 ${data.Title}`
                    });
                }
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Movie not found. Please check the title.' 
                });
            }

        } catch (error) {
            console.error('Movie search error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error searching movie database. Please try again.' 
            });
        }
    },

    async _sendMovieInfo(sock, sender, movie, apiKey) {
        // Get detailed movie info
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const details = await detailsResponse.json();

        const movieInfo = `🎬 *${details.title}* (${new Date(details.release_date).getFullYear()})\n\n` +
                         `📊 *Rating:* ${details.vote_average}/10 ⭐ (${details.vote_count} votes)\n` +
                         `⏱️ *Runtime:* ${details.runtime} minutes\n` +
                         `🎭 *Genre:* ${details.genres.map(g => g.name).join(', ')}\n` +
                         `📖 *Overview:* ${details.overview}\n` +
                         `💵 *Budget:* $${this._formatMoney(details.budget)}\n` +
                         `💰 *Revenue:* $${this._formatMoney(details.revenue)}`;

        await sock.sendMessage(sender, { text: movieInfo });

        // Send poster
        if (details.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
            await sock.sendMessage(sender, {
                image: { url: posterUrl },
                caption: `🎬 ${details.title}`
            });
        }
    },

    _formatMoney(amount) {
        if (!amount || amount === 0) return 'N/A';
        return amount.toLocaleString();
    }
};