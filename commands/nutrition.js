import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'nutrition',
    aliases: ['nutrient', 'calories'],
    description: 'Get detailed nutrition facts for food items',
    usage: '.nutrition <food item>',
    category: 'Health',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🍎 NUTRITION FACTS 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}nutrition <food>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}nutrition apple\n┃ ${config.bot.preffix}nutrition chicken breast\n┃ ${config.bot.preffix}nutrition rice\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '⏳ Analyzing nutrition data...' 
            });

            const food = args.join(' ').toLowerCase();
            
            // Use USDA FoodData Central API (free)
            const apiKey = 'Sw0zUgYeZceF8t4Cs2s6ZT8goTNkH5vjdWukS9g8'; // You can get your own key from api.nal.usda.gov
            const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=${apiKey}`;
            
            const response = await fetch(searchUrl);
            const data = await response.json();

            if (data.foods && data.foods.length > 0) {
                const foodItem = data.foods[0];
                const nutrients = {};
                
                // Extract key nutrients
                foodItem.foodNutrients?.forEach(n => {
                    if (n.nutrientName.includes('Energy')) nutrients.calories = n.value;
                    if (n.nutrientName.includes('Protein')) nutrients.protein = n.value;
                    if (n.nutrientName.includes('Carbohydrate')) nutrients.carbs = n.value;
                    if (n.nutrientName.includes('Total lipid') || n.nutrientName.includes('Fat')) nutrients.fat = n.value;
                    if (n.nutrientName.includes('Sugars')) nutrients.sugar = n.value;
                    if (n.nutrientName.includes('Fiber')) nutrients.fiber = n.value;
                });
                
                let nutritionText = `╭━━━『 🍎 NUTRITION FACTS 』\n┃\n`;
                nutritionText += `┃ 📋 *${foodItem.description || food}*\n┃\n`;
                nutritionText += `┃━━━━━━━━━━━━━━\n┃\n`;
                nutritionText += `┃ 🔥 *Calories:* ${nutrients.calories?.toFixed(0) || 'N/A'} kcal\n`;
                nutritionText += `┃ 🍚 *Carbs:* ${nutrients.carbs?.toFixed(1) || 'N/A'}g\n`;
                nutritionText += `┃ 🥩 *Protein:* ${nutrients.protein?.toFixed(1) || 'N/A'}g\n`;
                nutritionText += `┃ 🧈 *Fat:* ${nutrients.fat?.toFixed(1) || 'N/A'}g\n`;
                nutritionText += `┃ 🍬 *Sugar:* ${nutrients.sugar?.toFixed(1) || 'N/A'}g\n`;
                nutritionText += `┃ 🌾 *Fiber:* ${nutrients.fiber?.toFixed(1) || 'N/A'}g\n`;
                nutritionText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n`;
                nutritionText += `📊 *Serving:* 100g\n`;
                nutritionText += `_Data from USDA FoodData Central_`;

                await sock.sendMessage(jid.chat, { text: nutritionText });
                logging.success(`[NUTRITION] Data sent for: ${food}`);

            } else {
                // Fallback to common foods database
                const commonData = this._getCommonFoodData(food);
                if (commonData) {
                    await sock.sendMessage(jid.chat, { text: commonData });
                } else {
                    await sock.sendMessage(jid.chat, { 
                        text: `❌ No nutrition data found for *"${food}"*\n\n💡 Try common food names like: apple, banana, chicken, rice, egg` 
                    });
                }
            }

        } catch (error) {
            logging.error(`[NUTRITION] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch nutrition data.' 
            });
        }
    },

    _getCommonFoodData(food) {
        const db = {
            'apple': {name: 'Apple', cal: 52, carbs: 14, protein: 0.3, fat: 0.2, sugar: 10, fiber: 2.4},
            'banana': {name: 'Banana', cal: 89, carbs: 23, protein: 1.1, fat: 0.3, sugar: 12, fiber: 2.6},
            'chicken': {name: 'Chicken Breast', cal: 165, carbs: 0, protein: 31, fat: 3.6, sugar: 0, fiber: 0},
            'rice': {name: 'White Rice (cooked)', cal: 130, carbs: 28, protein: 2.7, fat: 0.3, sugar: 0, fiber: 0.4},
            'egg': {name: 'Egg (1 large)', cal: 78, carbs: 0.6, protein: 6, fat: 5, sugar: 0.6, fiber: 0},
            'bread': {name: 'White Bread', cal: 265, carbs: 49, protein: 9, fat: 3.2, sugar: 5, fiber: 2.7},
            'milk': {name: 'Whole Milk', cal: 61, carbs: 4.8, protein: 3.2, fat: 3.3, sugar: 5.1, fiber: 0},
            'beef': {name: 'Beef (lean)', cal: 250, carbs: 0, protein: 26, fat: 15, sugar: 0, fiber: 0},
            'potato': {name: 'Potato', cal: 77, carbs: 17, protein: 2, fat: 0.1, sugar: 0.8, fiber: 2.1},
            'orange': {name: 'Orange', cal: 47, carbs: 12, protein: 0.9, fat: 0.1, sugar: 9, fiber: 2.4}
        };

        for (const [key, data] of Object.entries(db)) {
            if (food.includes(key)) {
                return `╭━━━『 🍎 NUTRITION FACTS 』\n┃\n┃ 📋 *${data.name}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🔥 *Calories:* ${data.cal} kcal\n┃ 🍚 *Carbs:* ${data.carbs}g\n┃ 🥩 *Protein:* ${data.protein}g\n┃ 🧈 *Fat:* ${data.fat}g\n┃ 🍬 *Sugar:* ${data.sugar}g\n┃ 🌾 *Fiber:* ${data.fiber}g\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n📊 *Serving:* 100g\n_Common nutrition data_`;
            }
        }
        return null;
    }
};