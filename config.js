import dotenv from "dotenv";
import logging from "./logger.js";
dotenv.config();
logging.success("Configs loading successfully initiated");

const config = {
    bot: {
        name: process.env.BOT_NAME || "𝓔𝓵𝓵𝓲𝓮 𝓿1", 
        version: process.env.VERSION || "1.0.0",
        preffix: process.env.PREFFIX || ".",
        welcomeImage: process.env.WELCOME_IMAGE || "./assets/welcome.jpg",
    },
    // apikeys: API keys are now exclusively loaded from process.env in the auth section or where they are used.
    auth: {
        // MODIFIED: Support both folder and file-based authentication
        folder: process.env.CONFIG_FOLDER || "Elliev1",
        useCredsFile: process.env.USE_CREDS_FILE === "true", // Set to "true" to use creds.json
        credsFilePath: process.env.CREDS_FILE_PATH || "./creds.json",
    },
    user: {
        name: process.env.USER_NAME || "Ernest",
        number: process.env.USER_NUMBER || "254103106336",
    },
    social: {
        telegram: process.env.TELEGRAM_GROUP || "https://t.me/Peaseernest",
        whatsappChannel: process.env.WHATSAPP_CHANNEL || "https://whatsapp.com/channel/0029VayK4ty7DAWr0jeCZx0i",
    },
    error: {
        message: "There has been an error executing the command",
        notadmin: "You are not an admin so you cant use this command",
        notingroups: "This command works only in groups",
    },
    creator: {
        number: "254793859108",
        name: "PeaseErnest",
        email: "peaseernest8@gmail.com"
    }
};

export default config;