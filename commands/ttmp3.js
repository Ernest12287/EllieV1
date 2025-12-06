// commands/ttmp3.js
export default {
    name: 'ttmp3',
    aliases: ['tiktokmp3', 'ttaudio'],
    description: 'Download TikTok audio only',
    usage: '.ttmp3 <url>',
    category: 'Download',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            return await sock.sendMessage(jid.chat, {
                text: '❌ Usage: .ttmp3 <url>'
            });
        }
        
        let tiktokUrl = args[0];
        
        // Add query params
        if (!tiktokUrl.includes('?')) {
            tiktokUrl += '?is_from_webapp=1&sender_device=pc';
        }
        
        await sock.sendMessage(jid.chat, {
            text: '🎵 Extracting audio...'
        });
        
        try {
            const apiUrl = `https://ernest-tiksave.vercel.app/api/download?url=${encodeURIComponent(tiktokUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (!data.data.links.mp3) {
                throw new Error('Audio not available');
            }
            
            const audioResponse = await fetch(data.data.links.mp3);
            const audioBuffer = await audioResponse.buffer();
            
            await sock.sendMessage(jid.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mp4',
                ptt: false,
                fileName: `tiktok_audio_${Date.now()}.mp3`
            }, { quoted: message });
            
        } catch (error) {
            await sock.sendMessage(jid.chat, {
                text: `❌ Audio extraction failed: ${error.message}`
            });
        }
    }
};