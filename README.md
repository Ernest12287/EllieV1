# 🤖 EllieV1 - Advanced WhatsApp Bot

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Commands](https://img.shields.io/badge/commands-100%2B-orange.svg)

**A powerful, lightweight, and feature-rich WhatsApp bot with over 100 working commands**

[Features](#-features) • [Installation](#-installation) • [Commands](#-commands) • [Deployment](#-deployment) • [Support](#-support)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Commands](#-commands)
- [Deployment](#-deployment)
- [Advanced Features](#-advanced-features)
- [API Keys](#-api-keys)
- [Support & Community](#-support--community)
- [FAQ](#-faq)
- [License](#-license)

---

## 🎯 About

**EllieV1** is an ultra-lightweight WhatsApp bot built with modern JavaScript and the latest Baileys library. Despite having over 100 fully functional commands, it requires only **1GB RAM** and **200MB storage**, making it perfect for deployment on free hosting platforms.

### Why Choose EllieV1?

- ✅ **100+ Working Commands** - All tested and fully functional
- ⚡ **Ultra Lightweight** - Runs smoothly on 1GB RAM
- 🔒 **Secure** - Built-in security features and admin controls
- 🚀 **Easy Deployment** - One-click deploy to multiple platforms
- 🔄 **Self-Updating** - Fetch latest code from GitHub without manual git pulls
- 🎨 **Modern Design** - Clean, elegant command responses
- 📱 **Multi-Platform** - Works on any hosting service

---

## ✨ Features

### Core Features
- 🎮 **Fun & Games** - 8ball, dice, trivia, riddles, truth/dare, RPS, ship calculator
- 🖼️ **Image & Media** - Stickers, memes, image manipulation, AI image generation
- 📥 **Downloaders** - YouTube, TikTok, Instagram, Facebook, Twitter, MediaFire
- 🤖 **AI Integration** - GPT-4, Gemini, Groq, DeepSeek, Claude AI
- 🔧 **Utility Tools** - QR codes, URL shorteners, weather, time, calculator
- 👥 **Group Management** - Promote, demote, tag all, antiword, antitag
- 🎨 **Creative** - Text-to-image, fancy text, emoji mix, ASCII art
- 📚 **Information** - Wikipedia, dictionary, crypto prices, nutrition facts
- 🔐 **Security** - Encryption tools, password generator, antiword/antitag protection

### Advanced Features
- 🔄 **Self-Update System** - Update bot code directly from GitHub
- 🔒 **Private Mode** - Restrict bot to owner-only responses
- 👁️ **Presence Simulation** - Shows "typing" or "recording" status
- 💾 **Persistent Storage** - JSON-based data storage for settings
- 🛡️ **Admin Protection** - Owner-only commands with security checks
- 📊 **Command Statistics** - Track bot usage and performance

---

## 💻 Requirements

### Minimum Requirements
- **RAM:** 1GB
- **Storage:** 200MB
- **Node.js:** v18.0.0 or higher
- **Internet:** Stable connection

### Recommended
- **RAM:** 2GB
- **Storage:** 512MB
- **Node.js:** v20.0.0 or higher

---

## 🚀 Installation

### Method 1: Quick Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/Ernest12287/EllieV1.git

# Navigate to directory
cd EllieV1

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your details

# Start the bot
npm start
```

### Method 2: With Session File

```bash
# Clone repository
git clone https://github.com/Ernest12287/EllieV1.git
cd EllieV1

# Install dependencies
npm install

# Get session file from Ernest Session Generator
# Visit: https://ernest-session.onrender.com/

# Place creds.json in root directory
# Configure .env
cp .env.example .env
nano .env

# Set USE_CREDS_FILE=true in .env
# Start bot
npm start
```

### Method 3: Docker (Coming Soon)

```bash
docker pull ernest/elliev1:latest
docker run -d --name elliev1 ernest/elliev1
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# ==================================
# BOT CONFIGURATION
# ==================================
VERSION=1.0.0
PREFFIX=.
WELCOME_IMAGE=./assets/welcome.jpg

# ==================================
# API KEYS (Get from respective platforms)
# ==================================
WEATHER_API_KEY=your_openweathermap_key
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key

# ==================================
# AUTH & CREDENTIALS
# ==================================
CONFIG_FOLDER=Elliev1
USE_CREDS_FILE=false
CREDS_FILE_PATH=./creds.json

# ==================================
# GITHUB SELF-UPDATE (Required for .update command)
# ==================================
GITHUB_PAT=your_github_personal_access_token

# ==================================
# USER/CREATOR DETAILS
# ==================================
USER_NAME=YourName
USER_NUMBER=254XXXXXXXXX

# ==================================
# SOCIAL LINKS
# ==================================
TELEGRAM_GROUP=https://t.me/ernesttechhouse
WHATSAPP_CHANNEL=https://whatsapp.com/channel/0029VayK4ty7DAWr0jeCZx0i
```

### Authentication Methods

#### Method 1: Folder-Based (Default)
```env
USE_CREDS_FILE=false
CONFIG_FOLDER=Elliev1
```
Scan QR code on first run. Session saved in `Elliev1` folder.

#### Method 2: Session File
```env
USE_CREDS_FILE=true
CREDS_FILE_PATH=./creds.json
```
Use pre-generated session from [Ernest Session Generator](https://ernest-session.onrender.com/).

---

## 📱 Commands

### Command Categories

<details>
<summary><b>🎮 Fun & Games (15 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.8ball` | Magic 8-ball predictions | `.8ball Will I pass?` |
| `.dare` | Random dare challenge | `.dare` |
| `.dice` | Roll a dice | `.dice` |
| `.flip` | Flip a coin | `.flip` |
| `.joke` | Random joke | `.joke` |
| `.meme` | Random meme | `.meme` |
| `.riddle` | Random riddle | `.riddle` |
| `.rps` | Rock Paper Scissors | `.rps rock` |
| `.ship` | Ship calculator | `.ship @user1 @user2` |
| `.trivia` | Trivia questions | `.trivia` |
| `.truth` | Truth question | `.truth` |
| `.quote` | Inspirational quote | `.quote` |
| `.advice` | Random advice | `.advice` |
| `.fact` | Random fact | `.fact` |
| `.bully` | Roast someone | `.bully @user` |

</details>

<details>
<summary><b>🤖 AI Commands (10 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.gpt` | ChatGPT 3.5 | `.gpt Hello` |
| `.gpt4o` | GPT-4 Turbo | `.gpt4o Explain quantum` |
| `.gpt4omini` | GPT-4 Mini | `.gpt4omini Quick answer` |
| `.gemini` | Google Gemini | `.gemini Write a story` |
| `.geminipro` | Gemini Pro | `.geminipro Complex query` |
| `.groq` | Groq AI | `.groq Fast response` |
| `.mistral` | Mistral AI | `.mistral Coding help` |
| `.giftedai` | Gifted AI | `.giftedai Creative task` |
| `.deepimg` | AI Image Analysis | `.deepimg (with image)` |
| `.vision` | Vision AI | `.vision (with image)` |

</details>

<details>
<summary><b>📥 Downloaders (12 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.youtube` | Download YouTube videos | `.youtube <url>` |
| `.ytmp3` | YouTube to MP3 | `.ytmp3 <url>` |
| `.tiktok` | TikTok downloader | `.tiktok <url>` |
| `.instagram` | Instagram downloader | `.instagram <url>` |
| `.facebook` | Facebook downloader | `.facebook <url>` |
| `.twitter` | Twitter downloader | `.twitter <url>` |
| `.mediafire` | MediaFire downloader | `.mediafire <url>` |
| `.apk` | APK downloader | `.apk WhatsApp` |
| `.download` | Universal downloader | `.download <url>` |
| `.xvdown` | Adult site downloader | `.xvdown <url>` |
| `.xnxdown` | Adult site downloader | `.xnxdown <url>` |
| `.save` | Save status | `.save (reply to status)` |

</details>

<details>
<summary><b>🖼️ Image & Stickers (10 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.sticker` | Create sticker | `.sticker (with image/video)` |
| `.toimage` | Sticker to image | `.toimage (reply to sticker)` |
| `.fluximg` | AI image generation | `.fluximg A cat in space` |
| `.deepimg` | Deep AI image | `.deepimg Futuristic city` |
| `.remini` | Enhance image quality | `.remini (with image)` |
| `.removebg` | Remove background | `.removebg (with image)` |
| `.anime` | Anime image | `.anime` |
| `.waifu` | Waifu image | `.waifu` |
| `.neko` | Neko image | `.neko` |
| `.megumin` | Megumin image | `.megumin` |

</details>

<details>
<summary><b>🔧 Utility Tools (20 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.qr` | Generate QR code | `.qr https://example.com` |
| `.weather` | Weather info | `.weather Nairobi` |
| `.time` | Current time | `.time Kenya` |
| `.calc` | Calculator | `.calc 5 + 5` |
| `.currency` | Currency converter | `.currency 100 USD KES` |
| `.crypto` | Crypto prices | `.crypto BTC` |
| `.define` | Define word | `.define serendipity` |
| `.dictionary` | Dictionary lookup | `.dictionary hello` |
| `.translate` | Translate text | `.translate en es Hello` |
| `.shorten` | URL shortener | `.shorten <long-url>` |
| `.tinyurl` | TinyURL | `.tinyurl <url>` |
| `.adfoc` | AdFocus link | `.adfoc <url>` |
| `.cleanuri` | Clean URI | `.cleanuri <url>` |
| `.rebrandly` | Rebrandly link | `.rebrandly <url>` |
| `.tempmail` | Temp email | `.tempmail` |
| `.password` | Generate password | `.password 16` |
| `.encrypt` | Encrypt text | `.encrypt mytext` |
| `.encrypt2` | Encrypt v2 | `.encrypt2 mytext` |
| `.encrypt3` | Encrypt v3 | `.encrypt3 mytext` |
| `.proxy` | Get proxy list | `.proxy` |

</details>

<details>
<summary><b>👥 Group Management (10 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.promote` | Promote to admin | `.promote @user` |
| `.demote` | Demote admin | `.demote @user` |
| `.tagall` | Tag everyone | `.tagall Hello everyone` |
| `.groupinfo` | Group information | `.groupinfo` |
| `.antitag` | Anti mass-tag | `.antitag on/off` |
| `.antiword` | Block bad words | `.antiword add/remove <word>` |
| `.announce` | Announcement mode | `.announce` |
| `.goodbye` | Goodbye message | `.goodbye` |
| `.fullpp` | Full size profile pic | `.fullpp` |
| `.pp` | Profile picture | `.pp` |

</details>

<details>
<summary><b>📚 Information & Search (15 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.wiki` | Wikipedia search | `.wiki Artificial Intelligence` |
| `.search` | Web search | `.search NodeJS` |
| `.npm` | NPM package info | `.npm express` |
| `.github` | GitHub repo info | `.github user/repo` |
| `.movie` | Movie information | `.movie Inception` |
| `.lyrics` | Song lyrics | `.lyrics Shape of You` |
| `.anime` | Anime info | `.anime Naruto` |
| `.pokemon` | Pokemon info | `.pokemon Pikachu` |
| `.nutrition` | Nutrition facts | `.nutrition banana` |
| `.horoscope` | Daily horoscope | `.horoscope Aries` |
| `.verse` | Bible verse | `.verse John 3:16` |
| `.quran` | Quran verse | `.quran 1:1` |
| `.chapter` | Quran chapter | `.chapter 1` |
| `.urban` | Urban dictionary | `.urban yeet` |
| `.synonym` | Find synonyms | `.synonym happy` |

</details>

<details>
<summary><b>🎨 Creative & Fun (10 commands)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.fancy` | Fancy text | `.fancy Hello` |
| `.ttp` | Text to PNG | `.ttp Hello World` |
| `.emojimix` | Mix emojis | `.emojimix 😀 😎` |
| `.countdown` | Countdown timer | `.countdown New Year` |
| `.topdf` | Image to PDF | `.topdf (with image)` |
| `.ssweb` | Website screenshot | `.ssweb https://google.com` |
| `.ssur` | URL screenshot | `.ssur <url>` |
| `.vgd` | Video thumbnail | `.vgd (with video)` |
| `.convert` | Unit converter | `.convert 5 km miles` |
| `.find` | Find command | `.find sticker` |

</details>

<details>
<summary><b>⚙️ Bot Management (Owner Only)</b></summary>

| Command | Description | Usage |
|---------|-------------|-------|
| `.update` | Update bot from GitHub | `.update` |
| `.public` | Toggle public/private mode | `.public on/off` |
| `.restart` | Restart bot | `.restart` |
| `.eval` | Execute JavaScript | `.eval console.log("Hi")` |
| `.setprefix` | Change bot prefix | `.setprefix !` |
| `.stop` | Stop bot | `.stop` |

</details>

### Quick Command Reference

```
Total Commands: 100+
Categories: 10
Prefix: . (customizable)
Owner Commands: 6
Public Commands: 94+
```

---

## 🌐 Deployment

EllieV1 can be deployed on various platforms. Here are the supported hosting services:

### Free Hosting Platforms

#### 1. **Render**
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

```bash
# Steps:
1. Fork this repository
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Set environment variables
5. Deploy!
```

**Pros:** 750 hours/month free, auto-deploy, easy setup
**Cons:** Cold starts after inactivity

---

#### 2. **Railway**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

```bash
# Steps:
1. Click "Deploy on Railway"
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically
```

**Pros:** $5 free credit monthly, fast deployment
**Cons:** Limited free tier

---

#### 3. **Koyeb**
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://www.koyeb.com)

```bash
# Steps:
1. Sign up on Koyeb
2. Create new service
3. Connect GitHub repo
4. Configure environment
5. Deploy
```

**Pros:** Always-on free tier, no cold starts
**Cons:** Requires credit card

---

#### 4. **Heroku** (Paid)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create elliev1-bot

# Set environment variables
heroku config:set KEY=VALUE

# Deploy
git push heroku main
```

**Pros:** Reliable, scalable, easy management
**Cons:** No free tier (starts at $7/month)

---

#### 5. **BotHosting.net**

```bash
# Steps:
1. Visit bothosting.net
2. Create account
3. Upload bot files
4. Configure .env
5. Start bot from panel
```

**Pros:** WhatsApp bot optimized, 24/7 uptime
**Cons:** Paid service ($2-5/month)

---

#### 6. **Katabump**

Similar to BotHosting.net, specialized for WhatsApp bots.

```bash
# Steps:
1. Register at katabump.com
2. Create new bot instance
3. Upload repository
4. Set configuration
5. Start bot
```

---

### VPS Deployment

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name elliev1

# Save PM2 configuration
pm2 save

# Setup auto-restart on system boot
pm2 startup

# Useful PM2 commands
pm2 logs elliev1      # View logs
pm2 restart elliev1   # Restart bot
pm2 stop elliev1      # Stop bot
pm2 delete elliev1    # Remove from PM2
pm2 monit             # Monitor resources
```

#### Using systemd (Linux)

```bash
# Create service file
sudo nano /etc/systemd/system/elliev1.service

# Add the following:
[Unit]
Description=EllieV1 WhatsApp Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/EllieV1
ExecStart=/usr/bin/node index.js
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start service
sudo systemctl enable elliev1
sudo systemctl start elliev1
sudo systemctl status elliev1
```

---

## 🔐 Advanced Features

### Self-Update System

The bot can update itself from GitHub without manual intervention:

```bash
# Command: .update
# What it does:
1. Fetches latest code from GitHub repository
2. Downloads and replaces command files
3. Updates handler files
4. Restarts bot automatically

# Requirements:
- GITHUB_PAT in .env file
- GitHub Personal Access Token with 'repo' scope
```

**Getting GitHub PAT:**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select 'repo' scope
4. Copy token to `.env` as `GITHUB_PAT`

---

### Private Mode

Restrict bot to respond only to owner messages:

```bash
# Enable private mode
.public off

# Disable private mode (public)
.public on

# Check current mode
.public
```

**Use Cases:**
- Testing new features privately
- Maintenance mode
- Personal use only
- Preventing spam in busy groups

---

### Presence Simulation

Bot shows realistic "typing" or "recording" presence:

```javascript
// Automatically detects context
- Text messages → Shows "typing..."
- Voice queries → Shows "recording audio..."
- Auto-clears after 3 seconds
```

---

### Anti-Tag & Anti-Word Protection

**Anti-Tag:** Prevents mass tagging in groups
```bash
.antitag on 10  # Block if more than 10 people tagged
.antitag off    # Disable protection
```

**Anti-Word:** Block specific words
```bash
.antiword add badword    # Add banned word
.antiword remove badword # Remove from list
.antiword list           # Show banned words
.antiword off            # Disable protection
```

---

## 🔑 API Keys

### Required APIs

| Service | Purpose | Free Tier | Get Key |
|---------|---------|-----------|---------|
| OpenWeatherMap | Weather info | Yes (60 calls/min) | [Get Key](https://openweathermap.org/api) |
| Groq | AI responses | Yes | [Get Key](https://console.groq.com) |
| Google Gemini | AI chat | Yes | [Get Key](https://makersuite.google.com/app/apikey) |
| DeepSeek | AI responses | Yes | [Get Key](https://platform.deepseek.com) |

### Optional APIs

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Spotify | Music info | Yes |
| TMDB | Movie info | Yes |
| NewsAPI | News feeds | Yes (100 req/day) |
| RapidAPI | Multiple services | Varies |

### API Configuration

Add to `.env`:
```env
WEATHER_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
```

---

## 📞 Support & Community

### Get Help

- 💬 **Telegram Group:** [Ernest Tech House](https://t.me/ernesttechhouse)
- 📱 **WhatsApp Channel:** [Join Channel](https://whatsapp.com/channel/0029VayK4ty7DAWr0jeCZx0i)
- 📧 **Email:** peaseernest8@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/Ernest12287/EllieV1/issues)

### Creator

**Ernest Pease**
- GitHub: [@Ernest12287](https://github.com/Ernest12287)
- WhatsApp: +254793859108
- Email: peaseernest8@gmail.com
- Telegram: [@ernesttechhouse](https://t.me/ernesttechhouse)

---

## ❓ FAQ

<details>
<summary><b>How do I get a session file?</b></summary>

Visit [Ernest Session Generator](https://ernest-session.onrender.com/) and follow the instructions. Download `creds.json` and place it in your bot's root directory. Set `USE_CREDS_FILE=true` in `.env`.
</details>

<details>
<summary><b>Bot keeps disconnecting. What to do?</b></summary>

1. Check your internet connection
2. Ensure you're not logged in elsewhere
3. Delete the session folder and scan QR again
4. Use a VPS for stable hosting
</details>

<details>
<summary><b>How to add custom commands?</b></summary>

Create a new `.js` file in the `commands` folder following this structure:

```javascript
export default {
    name: 'commandname',
    description: 'What it does',
    usage: '.commandname <args>',
    category: 'Category',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        await sock.sendMessage(sender, { 
            text: 'Response here' 
        });
    }
};
```
</details>

<details>
<summary><b>Can I use this bot commercially?</b></summary>

Yes, but please provide credit to the original creator. Do not remove copyright notices.
</details>

<details>
<summary><b>Bot is slow. How to optimize?</b></summary>

1. Use a VPS instead of free hosting
2. Increase RAM allocation
3. Disable unused commands
4. Use PM2 with clustering
5. Optimize API calls
</details>

<details>
<summary><b>How to update the bot?</b></summary>

**Method 1 (Automatic):**
```bash
.update  # Use the built-in update command
```

**Method 2 (Manual):**
```bash
git pull origin main
npm install
pm2 restart elliev1
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/EllieV1.git

# Create development branch
git checkout -b dev

# Install dependencies
npm install

# Run in development mode
npm run dev

# Test your changes
npm test
```

---

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 Ernest Pease

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

## 🙏 Acknowledgments

- [@WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Ernest Logger](https://www.npmjs.com/package/ernest-logger) - Beautiful console logging
- All contributors and supporters

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History](https://api.star-history.com/svg?repos=Ernest12287/EllieV1&type=Date)](https://star-history.com/#Ernest12287/EllieV1&Date)

---

## 📊 Statistics

```
Total Lines of Code: 15,000+
Total Commands: 100+
Supported Platforms: 7+
Weekly Downloads: 500+
Active Users: 1,000+
GitHub Stars: ⭐ (Star this repo!)
```

---

<div align="center">

### Made with ❤️ by [Ernest Pease](https://github.com/Ernest12287)

**[⬆ Back to Top](#-elliev1---advanced-whatsapp-bot)**

</div>