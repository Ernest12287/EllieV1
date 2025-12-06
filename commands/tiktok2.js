// commands/tiktok.js
import { getChatJid } from '../utils/jidHelper.js';
import config from '../config.js';
import fetch from 'node-fetch';

export default {
    name: 'tiktok2',
    aliases: ['tt', 'ttdl', 'tiktokdl'],
    description: 'Download TikTok videos',
    usage: '.tiktok <url>',
    category: 'Download',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            return await sock.sendMessage(jid.chat, {
                text: '❌ Usage: .tiktok <url>\n\nExample:\n.tiktok https://www.tiktok.com/@user/video/123456789'
            });
        }
        
        let tiktokUrl = args[0];
        
        // Clean URL (remove any extra text)
        const urlMatch = tiktokUrl.match(/https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/);
        if (!urlMatch) {
            return await sock.sendMessage(jid.chat, {
                text: '❌ Invalid TikTok URL!'
            });
        }
        
        tiktokUrl = urlMatch[0];
        
        // Add required query parameters if not present
        if (!tiktokUrl.includes('?')) {
            tiktokUrl += '?is_from_webapp=1&sender_device=pc';
        } else if (!tiktokUrl.includes('is_from_webapp')) {
            tiktokUrl += '&is_from_webapp=1&sender_device=pc';
        }
        
        await sock.sendMessage(jid.chat, {
            text: '⏳ Downloading TikTok video...\n\nPlease wait...'
        });
        
        try {
            const apiUrl = `https://ernest-tiksave.vercel.app/api/download?url=${encodeURIComponent(tiktokUrl)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status !== 'success' || !data.data.links || Object.keys(data.data.links).length === 0) {
                throw new Error('Failed to fetch video details');
            }
            
            const videoData = data.data;
            
            // Send video info first
            await sock.sendMessage(jid.chat, {
                text: `✅ *TikTok Download Ready!*\n\n` +
                      `👤 *Author:* ${videoData.author_name} (@${videoData.author})\n` +
                      `📝 *Description:* ${videoData.desc || 'No description'}\n\n` +
                      `⏱️ *Processing:* Sending video...`
            });
            
            // Download and send HD video
            const videoUrl = videoData.links.mp4_hd || videoData.links.mp4_576 || videoData.links.mp4_480;
            
            if (!videoUrl) {
                throw new Error('No video link available');
            }
            
            const videoResponse = await fetch(videoUrl);
            const videoBuffer = await videoResponse.buffer();
            
            // Send video
            await sock.sendMessage(jid.chat, {
                video: videoBuffer,
                caption: `🎬 *TikTok Video*\n\n` +
                        `👤 ${videoData.author_name}\n` +
                        `📝 ${videoData.desc}\n\n` +
                        `_Downloaded by ${config.bot.name}_`,
                mimetype: 'video/mp4'
            });
            
            // Optional: Send audio separately
            if (videoData.links.mp3) {
                await sock.sendMessage(jid.chat, {
                    text: '🎵 Audio available! Type .ttmp3 <url> for audio only.'
                });
            }
            
        } catch (error) {
            console.error('TikTok download error:', error);
            await sock.sendMessage(jid.chat, {
                text: `❌ Download failed!\n\nError: ${error.message}\n\n💡 Tips:\n` +
                      `• Make sure the video is public\n` +
                      `• Try a different video\n` +
                      `• Check if the URL is complete`
            });
        }
    }
};