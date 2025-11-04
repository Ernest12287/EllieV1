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
    apikeys: {
        weather: process.env.WEATHER_API_KEY || "4eae741def192d7170adcc74d60d9ceb",
        groq: process.env.GROQ_API_KEY || "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",
        gemini: process.env.GEMINI_API_KEY || "AIzaSyBLt8nENoQsgm82t9wdrXl1xTMswG8TMH0",
        deepseek: process.env.DEEPSEEK_API_KEY || "sk-9bc9de8af1f2484888989c4c5523bf4a",
    },
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