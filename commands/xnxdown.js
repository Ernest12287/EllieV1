import config from '../config.js';
import logging from '../logger.js';;
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'xnxdown',
    description: 'Download and send videos from xnx ',
    usage: '.xnxdown <xvideos-url>',
    category: 'Downloader',

    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const url = args[0];

        if (!url) {
            await sock.sendMessage(jid.chat, { text: '❌ Please provide an XVideos URL.\nExample: `.xvdown https://www.xnx.com/video...`' });
            return;
        }

        try {
            logging.info(`Fetching video data for: ${url}`);
            //https://api.giftedtech.co.ke/api/download/xnxxdl?apikey=gifted&url=https%3A%2F%2Fwww.xnxx.health%2Fvideo-1256sd47%2Fstepbrother_and_stepsister_learn_about_sex_-_step_mother_family_sex_female_anatomy_accidental_creampie

            const apiUrl = `https://api.giftedtech.co.ke/api/download/xnxxdl?apikey=gifted&url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success || !data.result) {
                logging.error('Invalid API response from GiftedTech');
                await sock.sendMessage(jid.chat, { text: '⚠️ Failed to fetch video info. Try again later.' });
                return;
            }

            const { title, views, likes, dislikes, size, thumbnail, download_url } = data.result;

            // Parse the size value
            const sizeValue = parseFloat(size);
            const isMB = size.toLowerCase().includes('mb');
            const sizeInMB = isMB ? sizeValue : sizeValue / 1024; // convert KB to MB if needed

            const caption = `
🎬 *${title}*
👁️ Views: ${views}
👍 Likes: ${likes}
👎 Dislikes: ${dislikes}
💾 Size: ${size}

${sizeInMB <= 70 ? '📥 Sending video...' : '⚠️ File too large, sending link instead:'}
${sizeInMB > 70 ? download_url : ''}
            `.trim();

            if (sizeInMB > 70) {
                // Big file: send info + link only
                await sock.sendMessage(jid.chat, {
                    image: { url: thumbnail },
                    caption
                });
                logging.warn(`Skipped download — file too large (${sizeInMB.toFixed(2)} MB).`);
                return;
            }

            // Small enough: download and send video
            const tempFolder = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

            const fileName = `${Date.now()}_xv.mp4`;
            const filePath = path.join(tempFolder, fileName);

            logging.info(`Downloading video (${sizeInMB.toFixed(2)} MB): ${title}`);

            const videoRes = await fetch(download_url);
            const fileStream = fs.createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                videoRes.body.pipe(fileStream);
                videoRes.body.on('error', reject);
                fileStream.on('finish', resolve);
            });

            logging.success(`Download complete: ${fileName}`);

            await sock.sendMessage(jid.chat, {
                video: fs.readFileSync(filePath),
                caption
            });

            logging.success(`Video sent successfully to ${sender}`);

            // Clean up
            fs.unlinkSync(filePath);
            logging.info('Temporary file deleted.');

        } catch (err) {
            logging.error(err);
            await sock.sendMessage(jid.chat, { text: '❌ Something went wrong while processing your request.' });
        }
    }
};
