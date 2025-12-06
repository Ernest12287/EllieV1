import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    name: 'update',
    description: 'Fetch latest bot code from GitHub and restart',
    usage: '.update',
    category: 'Owner',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        // SECURITY: Only bot owner can use this
        const ownerNumber = config.user.number.replace(/[^0-9]/g, '');
        const senderNumber = sender.replace(/[^0-9]/g, '');
        
        if (senderNumber !== ownerNumber) {
            await sock.sendMessage(jid.chat, {
                text: '❌ *Access Denied*\n\nThis command is restricted to the bot owner only.'
            }, { quoted: message });
        }

        // GitHub Configuration
        const API_BASE = 'https://api.github.com/repos/Ernest12287/EllieV1/contents/';
        const GITHUB_TOKEN = process.env.GITHUB_PAT;
        
        if (!GITHUB_TOKEN) {
            logging.error('[UPDATE] GITHUB_PAT not found in environment variables');
            await sock.sendMessage(jid.chat, {
                text: '❌ *Update Failed*\n\nGITHUB_PAT not configured in .env file.\n\nPlease add your GitHub Personal Access Token to continue.'
            }, { quoted: message });
        }

        // Define directories to update
        const TARGET_DIRS = [
            { remote: 'commands', local: path.join(__dirname, '..', 'commands') },
            { remote: 'Handlers', local: path.join(__dirname, '..', 'Handlers') }
        ];

        await sock.sendMessage(jid.chat, {
            text: '🔄 *Update Started*\n\n⏳ Fetching latest code from GitHub...\n\n_This may take a moment._'
        }, { quoted: message });

        let totalUpdated = 0;
        let totalFailed = 0;
        const failedFiles = [];

        try {
            // Process each directory
            for (const dir of TARGET_DIRS) {
                logging.info(`[UPDATE] Processing ${dir.remote} directory...`);
                
                const apiUrl = API_BASE + dir.remote;
                const headers = {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'User-Agent': 'EllieV1-Updater',
                    'Accept': 'application/vnd.github.v3+json'
                };

                // Fetch directory contents
                const response = await fetch(apiUrl, { headers });
                
                if (!response.ok) {
                    throw new Error(`GitHub API error for ${dir.remote}: ${response.status} ${response.statusText}`);
                }

                const remoteFiles = await response.json();
                
                // Filter only files (not subdirectories)
                const files = remoteFiles.filter(item => item.type === 'file');
                
                logging.info(`[UPDATE] Found ${files.length} files in ${dir.remote}`);

                // Download and update each file
                for (const file of files) {
                    try {
                        logging.info(`[UPDATE] Downloading ${file.name}...`);
                        
                        const fileResponse = await fetch(file.download_url);
                        
                        if (!fileResponse.ok) {
                            throw new Error(`Failed to download ${file.name}`);
                        }
                        
                        const fileContent = await fileResponse.text();
                        const localPath = path.join(dir.local, file.name);
                        
                        // Write file synchronously for integrity
                        fs.writeFileSync(localPath, fileContent, 'utf8');
                        
                        totalUpdated++;
                        logging.success(`[UPDATE] Updated ${file.name}`);
                        
                    } catch (fileError) {
                        totalFailed++;
                        failedFiles.push(`${dir.remote}/${file.name}`);
                        logging.error(`[UPDATE] Failed to update ${file.name}: ${fileError.message}`);
                    }
                }
            }

            // Generate update summary
            let summaryText = '✅ *Update Completed*\n\n';
            summaryText += `📊 *Summary:*\n`;
            summaryText += `• Files Updated: ${totalUpdated}\n`;
            summaryText += `• Failed: ${totalFailed}\n\n`;
            
            if (failedFiles.length > 0) {
                summaryText += '⚠️ *Failed Files:*\n';
                failedFiles.forEach(f => {
                    summaryText += `  • ${f}\n`;
                });
                summaryText += '\n';
            }
            
            summaryText += '🔄 *Restarting bot in 3 seconds...*\n\n';
            summaryText += '_All updates will be applied after restart._';

            await sock.sendMessage(jid.chat, {
                text: summaryText
            }, { quoted: message });

            logging.success(`[UPDATE] Update complete: ${totalUpdated} updated, ${totalFailed} failed`);
            
            // Wait 3 seconds before restart
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            logging.info('[UPDATE] Initiating self-restart...');
            process.exit(0); // Exit and let hosting panel restart

        } catch (error) {
            logging.error(`[UPDATE] Critical error: ${error.message}`);
            
            await sock.sendMessage(jid.chat, {
                text: `❌ *Update Failed*\n\n*Error:* ${error.message}\n\n*Files Updated:* ${totalUpdated}\n*Files Failed:* ${totalFailed}\n\n_Please check logs for details._`
            }, { quoted: message });
        }
    }
};