import config from '../config.js';

export default {
    name: 'aimenu',
    description: 'List AI models',
    usage: '.aimenu',
    category: 'AI',
    
    async execute(sock, message) {
        const sender = message.key.remoteJid;
        const prefix = config.bot.preffix;
        
        const menuText = `
╔═══════════════════════════╗
║   🤖 AI MODELS AVAILABLE   ║
╚═══════════════════════════╝

⚡ *Groq AI (Llama 3)*
├ ${prefix}groq <question>
├ Speed: Ultra Fast ⚡⚡⚡
└ Status: ✅ Working

🔮 *Google Gemini Pro*
├ ${prefix}gemini <question>
├ Speed: Fast ⚡⚡
└ Status: ✅ Working

━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *EXAMPLES:*
${prefix}groq What is AI?
${prefix}gemini Explain quantum physics

━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Powered by ${config.bot.name}
        `.trim();
        
        await sock.sendMessage(sender, { text: menuText });
    }
};