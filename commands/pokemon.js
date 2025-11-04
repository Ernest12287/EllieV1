import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'pokemon',
    aliases: ['poke', 'pokedex'],
    description: 'Get Pokemon information',
    usage: '.pokemon <name or id>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 ⚡ POKEMON 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}pokemon <name/id>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}pokemon pikachu\n┃ ${config.bot.preffix}pokemon 25\n┃ ${config.bot.preffix}pokemon charizard\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⚡ Searching Pokedex...' 
            });

            const query = args[0].toLowerCase();
            const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            const response = await fetch(apiUrl);
            
            if (response.status === 200) {
                const data = await response.json();
                
                const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                const types = data.types.map(t => t.type.name).join(', ');
                const abilities = data.abilities.map(a => a.ability.name).join(', ');
                const height = (data.height / 10).toFixed(1); // decimeters to meters
                const weight = (data.weight / 10).toFixed(1); // hectograms to kg
                const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('\n┃ ');
                
                const pokeText = `╭━━━『 ⚡ POKEMON 』\n┃\n┃ 📛 *${name}* #${data.id}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🎨 Type: ${types}\n┃ ⚔️ Abilities: ${abilities}\n┃ 📏 Height: ${height}m\n┃ ⚖️ Weight: ${weight}kg\n┃\n┃━━━━━━━━━━━━━━\n┃ 📊 *Base Stats:*\n┃ ${stats}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                // Send with sprite image
                await sock.sendMessage(sender, {
                    image: { url: data.sprites.other['official-artwork'].front_default || data.sprites.front_default },
                    caption: pokeText
                });
                
                logging.success(`[POKEMON] Sent info for: ${name}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ Pokemon *"${query}"* not found!\n\n💡 Check spelling or try a different Pokemon.` 
                });
            }

        } catch (error) {
            logging.error(`[POKEMON] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch Pokemon data.' 
            });
        }
    }
};