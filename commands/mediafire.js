import config from '../config.js';
import logging from '../logger.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: 'mediafire',
    description: 'Download and send Mediafire files using GiftedTech API',
    usage: '.mediafire <mediafire-url>',
    category: 'Downloader',

    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const url = args[0];

        if (!url) {
            await sock.sendMessage(sender, { text: '❌ Please provide a Mediafire link.\nExample: `.mediafire https://www.mediafire.com/file/...`' });
            return;
        }

        try {
            logging.info(`Fetching Mediafire file info for: ${url}`);

            const apiUrl = `https://api.giftedtech.co.ke/api/download/mediafire?apikey=gifted&url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success || !data.result) {
                logging.error('Invalid response from GiftedTech Mediafire API');
                await sock.sendMessage(sender, { text: '⚠️ Could not fetch Mediafire file info. Try again later.' });
                return;
            }

            const { fileName, fileSize, fileType, uploadedOn, uploadedFrom, downloadUrl } = data.result;

            // Convert size to MB for smart handling
            const sizeValue = parseFloat(fileSize);
            const sizeInMB = fileSize.toLowerCase().includes('kb') ? sizeValue / 1024 : sizeValue;

            const caption = `
📁 *${fileName}*
📦 Type: ${fileType}
📏 Size: ${fileSize}
🌍 Uploaded from: ${uploadedFrom}
🕒 Uploaded on: ${uploadedOn}

${sizeInMB <= 70 ? '📥 Sending file...' : '⚠️ File too large — sending download link instead:'}
${sizeInMB > 70 ? downloadUrl : ''}
            `.trim();

            if (sizeInMB > 70) {
                await sock.sendMessage(sender, { text: caption });
                logging.warn(`Skipped download — file too large (${sizeInMB.toFixed(2)} MB).`);
                return;
            }

            // Download and send file
            const tempFolder = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

            const filePath = path.join(tempFolder, `${Date.now()}_${fileName.replace(/\s+/g, '_')}`);

            logging.info(`Downloading file (${sizeInMB.toFixed(2)} MB): ${fileName}`);

            const fileRes = await fetch(downloadUrl);
            const fileStream = fs.createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                fileRes.body.pipe(fileStream);
                fileRes.body.on('error', reject);
                fileStream.on('finish', resolve);
            });

            logging.success(`Download complete: ${fileName}`);

            await sock.sendMessage(sender, {
                document: fs.readFileSync(filePath),
                mimetype: data.result.mimeType,
                fileName,
                caption
            });

            logging.success(`File sent successfully to ${sender}`);

            fs.unlinkSync(filePath);
            logging.info('Temporary file deleted.');

        } catch (err) {
            logging.error(err);
            await sock.sendMessage(sender, { text: '❌ Something went wrong while processing your request.' });
        }
    }
};
