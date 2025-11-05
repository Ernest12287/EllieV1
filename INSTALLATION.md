# 📦 EllieV1 Installation Guide

Complete step-by-step guide to get your WhatsApp bot up and running.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **WhatsApp Account** (working phone number)
- ✅ **Text Editor** (VS Code recommended)
- ✅ **Internet Connection** (stable)

### Check Your System

```bash
# Check Node.js version
node --version  # Should show v18.0.0 or higher

# Check npm version
npm --version   # Should show v8.0.0 or higher

# Check Git
git --version   # Should show git version
```

---

## 🚀 Method 1: Quick Installation (Recommended)

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/Ernest12287/EllieV1.git

# Navigate to directory
cd EllieV1
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - @whiskeysockets/baileys (WhatsApp Web API)
# - All other dependencies from package.json
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
nano .env  # Linux/Mac
notepad .env  # Windows
```

**Fill in the following required fields:**

```env
# Minimum configuration
USER_NAME=YourName
USER_NUMBER=254XXXXXXXXX  # Your WhatsApp number with country code
PREFFIX=.
```

### Step 4: Start the Bot

```bash
# Start the bot
npm start
```

### Step 5: Scan QR Code

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code displayed in terminal
5. Wait for "Connection Established" message

### Step 6: Test the Bot

Send a message to your bot:
```
.ping
```

If you get a response, congratulations! Your bot is working! 🎉

---

## 🔐 Method 2: Using Session File

This method is useful if you want to avoid scanning QR codes repeatedly.

### Step 1: Get Session File

1. Visit [Ernest Session Generator](https://ernest-session.onrender.com/)
2. Scan QR code with WhatsApp
3. Download the generated `creds.json` file
4. Place `creds.json` in your bot's root directory

### Step 2: Configure for Session File

Edit `.env`:
```env
USE_CREDS_FILE=true
CREDS_FILE_PATH=./creds.json
```

### Step 3: Start Bot

```bash
npm start
```

The bot will use the session file instead of showing QR code.

---

## 🐳 Method 3: Docker Installation (Advanced)

### Prerequisites
- Docker installed
- Docker Compose installed

### Step 1: Create docker-compose.yml

```yaml
version: '3.8'
services:
  elliev1:
    build: .
    container_name: elliev1-bot
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./Elliev1:/app/Elliev1
      - ./data:/app/data
    ports:
      - "3000:3000"
```

### Step 2: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["npm", "start"]
```

### Step 3: Build and Run

```bash
# Build Docker image
docker-compose build

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

---

## ☁️ Method 4: Deployment Guides

### Deploy to Render

1. **Fork Repository**
   - Go to [github.com/Ernest12287/EllieV1](https://github.com/Ernest12287/EllieV1)
   - Click "Fork" button

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your forked repository
   - Select "EllieV1" repository

3. **Configure Service**
   ```
   Name: elliev1-bot
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all variables from `.env.example`
   - Click "Save Changes"

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Check logs for QR code or connection status

---

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set USER_NAME="YourName"
   railway variables set USER_NUMBER="254XXXXXXXXX"
   # Add other variables...
   ```

5. **Deploy**
   ```bash
   railway up
   ```

---

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create elliev1-bot
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set USER_NAME="YourName"
   heroku config:set USER_NUMBER="254XXXXXXXXX"
   # Set all other variables...
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

### Deploy to VPS (DigitalOcean/AWS/Linode)

#### Step 1: Connect to VPS

```bash
ssh root@your-vps-ip
```

#### Step 2: Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2
```

#### Step 3: Clone and Setup

```bash
# Clone repository
git clone https://github.com/Ernest12287/EllieV1.git
cd EllieV1

# Install dependencies
npm install

# Create .env file
nano .env
# (Fill in your configuration)
```

#### Step 4: Start with PM2

```bash
# Start bot
pm2 start index.js --name elliev1

# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# (Follow the command it gives you)

# View logs
pm2 logs elliev1
```

#### Step 5: Setup Nginx (Optional - for webhook)

```bash
# Install Nginx
apt install nginx -y

# Create config
nano /etc/nginx/sites-available/elliev1

# Add:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/elliev1 /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔧 Configuration

### Essential Configuration

Edit `.env` with these minimum values:

```env
VERSION=1.0.0
PREFFIX=.
USER_NAME=Ernest
USER_NUMBER=254XXXXXXXXX
USE_CREDS_FILE=false
CONFIG_FOLDER=Elliev1
```

### Optional But Recommended

```env
# For weather command
WEATHER_API_KEY=your_key_from_openweathermap

# For AI commands
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key

# For self-update feature
GITHUB_PAT=your_github_token
```

### Getting API Keys

#### OpenWeatherMap (Weather)
1. Visit [openweathermap.org](https://openweathermap.org/api)
2. Sign up for free account
3. Go to API Keys section
4. Copy your API key

#### Groq AI
1. Visit [console.groq.com](https://console.groq.com)
2. Create account
3. Generate API key
4. Copy key to `.env`

#### Google Gemini
1. Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Get API key
3. Copy to `.env`

#### GitHub PAT (For .update command)
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select `repo` scope
4. Generate and copy token

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Connection closed"

**Possible causes:**
1. Internet connection unstable
2. WhatsApp logged in elsewhere
3. Session expired

**Solution:**
```bash
# Delete session and reconnect
rm -rf Elliev1/
npm start
# Scan QR code again
```

---

### Issue: "QR code not showing"

**Solution:**
```bash
# Make sure terminal supports QR display
# Or use session file method instead
```

---

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in code
```

---

### Issue: "Bot not responding"

**Checklist:**
- ✅ Bot is running (check with `pm2 status` or `ps aux | grep node`)
- ✅ WhatsApp connection active
- ✅ Correct prefix being used
- ✅ Number is not blocked
- ✅ Check logs for errors

```bash
# View logs
pm2 logs elliev1
# Or
tail -f logs/error.log
```

---

### Issue: Commands not loading

**Solution:**
```bash
# Check commands folder
ls commands/

# Verify file format
# Each command must export default object

# Restart bot
pm2 restart elliev1
```

---

## 📊 Post-Installation

### Verify Installation

```bash
# Test these commands:
.ping      # Should respond with latency
.help      # Should show command list
.menu      # Should show categorized commands
.info      # Should show bot info
```

### Enable Self-Update

```bash
# Add GitHub PAT to .env
GITHUB_PAT=your_token_here

# Test update command
.update
```

### Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Setup keymetrics (optional)
pm2 link your-secret-key your-public-key
```

### Backup Session

```bash
# Backup your session folder
cp -r Elliev1/ Elliev1-backup/

# Or backup creds.json
cp creds.json creds-backup.json
```

---

## 🎓 Next Steps

1. **Join Community**
   - Telegram: [Ernest Tech House](https://t.me/ernesttechhouse)
   - WhatsApp: [Channel](https://whatsapp.com/channel/0029VayK4ty7DAWr0jeCZx0i)

2. **Customize Bot**
   - Change prefix in `.env`
   - Add custom welcome image
   - Modify command responses

3. **Add Custom Commands**
   - See `commands/` folder for examples
   - Create new `.js` file
   - Follow existing command structure

4. **Monitor Performance**
   - Use `pm2 monit` for real-time stats
   - Check logs regularly
   - Monitor API usage

5. **Stay Updated**
   - Watch GitHub repository
   - Join Telegram for updates
   - Use `.update` command regularly

---

## 📞 Support

If you need help:

1. **Check Documentation** - Most answers are in README.md
2. **Search Issues** - Someone may have had same problem
3. **Ask Community** - Telegram group is very active
4. **Contact Creator** - peaseernest8@gmail.com

---

## ✅ Installation Checklist

- [ ] Node.js installed (v18+)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Bot started successfully
- [ ] QR code scanned / Session file loaded
- [ ] Test command works (`.ping`)
- [ ] API keys added (optional)
- [ ] PM2 setup (if using VPS)
- [ ] Session backed up
- [ ] Joined support community

---

**Congratulations! Your EllieV1 bot is now ready to use! 🎉**

For more information, check the main [README.md](README.md)