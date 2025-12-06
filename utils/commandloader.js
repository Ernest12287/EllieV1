import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = path.join(__dirname, '../commands');

export async function loadCommands() {
    const commands = new Map();
    try {
        if (!fs.existsSync(COMMANDS_DIR)) {
            logging.error(`Commands directory not found: ${COMMANDS_DIR}`);
            return commands;
        }

        const commandFiles = fs.readdirSync(COMMANDS_DIR).filter(file => file.endsWith('.js'));
        logging.info(`Found ${commandFiles.length} command file(s) to load...`);

        for (const file of commandFiles) {
            try {
                const filePath = path.join(COMMANDS_DIR, file);
                const fileUrl = `file://${filePath}`;
                const { default: command } = await import(fileUrl);

                if (command && command.name && typeof command.execute === 'function') {
                    commands.set(command.name, command);
                    logging.success(`Loaded command: ${command.name} (${file})`);
                } else {
                    logging.warn(`Command file ${file} is invalid.`);
                }
            } catch (fileError) {
                logging.error(`Failed to load ${file}:`);
                console.error(fileError);
            }
        }
    } catch (error) {
        logging.error(`Error loading commands: ${error.message}`);
    }
    return commands;
}