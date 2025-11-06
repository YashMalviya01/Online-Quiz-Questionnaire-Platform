# 🌐 Ngrok Setup Guide for Online Quiz Platform

This guide helps you configure ngrok for public access to your Quiz Platform running on Mac Mini M4.

## 📋 Table of Contents
- [What is Ngrok?](#what-is-ngrok)
- [Free vs Paid Plans](#free-vs-paid-plans)
- [Quick Setup](#quick-setup)
- [Troubleshooting](#troubleshooting)
- [Common Errors](#common-errors)

---

## 🤔 What is Ngrok?

Ngrok creates a secure tunnel from the public internet to your local application, allowing:
- Remote access to your local development server
- Testing webhooks and external API integrations
- Sharing your work with clients/team members
- Testing on mobile devices

---

## 💰 Free vs Paid Plans

### Free Tier (Default)
✅ **Included:**
- Random URLs (e.g., `https://abc123.ngrok.io`)
- 1 online ngrok process
- 40 connections/minute
- HTTP/HTTPS tunnels

❌ **Not Included:**
- Reserved domains
- Custom subdomains
- IP whitelisting

### Paid Plans
✅ **Additional features:**
- Reserved domains (e.g., `smart-quiz.ngrok.dev`)
- Custom branded domains
- More concurrent tunnels
- Higher connection limits

[View Ngrok Pricing](https://ngrok.com/pricing)

---

## 🚀 Quick Setup

### Step 1: Get Your Authtoken

1. Sign up/Login at [ngrok.com](https://ngrok.com)
2. Go to [Your Authtoken page](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copy your authtoken

### Step 2: Configure the Platform

**Option A: Using Environment Variable (Recommended)**
```bash
export NGROK_AUTHTOKEN="your_token_here"
./scripts/macos/auto-start.sh
```

**Option B: Edit docker-compose.yml**
```yaml
ngrok:
  environment:
    NGROK_AUTHTOKEN: your_actual_token_here  # Replace this
```

### Step 3: Choose Your Setup

#### 🆓 Dynamic URLs (Free Tier)
The platform is already configured for this! Just run:
```bash
./scripts/macos/auto-start.sh
```

Your URL will change each time you restart (e.g., `https://xyz789.ngrok.io`)

#### 💎 Reserved Domain (Paid Plan)

If you have a paid plan with a reserved domain:

1. Edit `docker-compose.yml`:
```yaml
ngrok:
  command: ["http", "http://frontend:80", "--domain=your-domain.ngrok.io"]
```

2. Start the platform:
```bash
./scripts/macos/auto-start.sh
```

### Step 4: Verify Setup

Run the configuration helper:
```bash
./scripts/macos/configure-ngrok.sh
```

This will:
- ✅ Check if ngrok is running
- ✅ Verify your authtoken
- ✅ Display your public URL
- ✅ Show any errors with solutions

---

## 🔧 Troubleshooting

### Check Ngrok Status
```bash
# View ngrok logs
docker-compose logs -f ngrok

# Check if container is running
docker ps | grep ngrok

# Run configuration helper
./scripts/macos/configure-ngrok.sh
```

### Access Ngrok Dashboard
Open in browser: [http://localhost:4040](http://localhost:4040)

Shows:
- Active tunnels and URLs
- Request/response details
- Connection statistics
- Error messages

### Restart Ngrok
```bash
# Restart just ngrok
docker-compose restart ngrok

# Or restart everything
./scripts/macos/stop.sh
./scripts/macos/auto-start.sh
```

---

## ⚠️ Common Errors

### ERR_NGROK_3200: Endpoint is offline
**Cause:** Trying to use a reserved domain without proper subscription

**Solutions:**
1. **Use dynamic URLs** (Free tier):
   ```bash
   # Already configured! Just ensure --url flag is removed
   docker-compose up -d ngrok
   ```

2. **Verify reserved domain**:
   - Check your ngrok dashboard
   - Ensure domain is active
   - Verify your plan supports it

3. **Update configuration**:
   ```yaml
   # Remove --url flag for dynamic URLs
   command: ["http", "http://frontend:80", "--log=stdout"]
   ```

### ERR_NGROK_108: Invalid authtoken
**Cause:** Missing or incorrect authtoken

**Solution:**
```bash
# Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken
export NGROK_AUTHTOKEN="your_actual_token"
docker-compose restart ngrok
```

### ERR_NGROK_105: Account limit reached
**Cause:** Too many tunnels or connections

**Solutions:**
1. Close other ngrok processes
2. Upgrade your plan
3. Wait for connection limit to reset

### Tunnel not showing up
**Causes & Solutions:**

1. **Container not running:**
   ```bash
   docker-compose up -d ngrok
   ```

2. **Authtoken not set:**
   ```bash
   export NGROK_AUTHTOKEN="your_token"
   docker-compose restart ngrok
   ```

3. **Port conflict:**
   ```bash
   # Check if port 4040 is in use
   lsof -i :4040
   ```

4. **Still starting:**
   ```bash
   # Wait 10-15 seconds, then check
   curl -s http://localhost:4040/api/tunnels
   ```

---

## 📊 Monitoring Your Tunnel

### Get Current URL
```bash
# Using curl
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*'

# Using the helper script
./scripts/macos/configure-ngrok.sh
```

### View Live Requests
Open [http://localhost:4040](http://localhost:4040) to see:
- All incoming HTTP requests
- Request/response headers
- Timing information
- Replay requests

---

## 🔐 Security Considerations

### Free Tier URLs
- URLs are public and change on restart
- Anyone with the URL can access your app
- Consider implementing authentication

### Production Use
For production deployments:
1. ❌ **Don't rely on ngrok** - Use proper hosting
2. ✅ **Enable authentication** in your app
3. ✅ **Use HTTPS** (ngrok does this automatically)
4. ✅ **Monitor access logs**
5. ✅ **Consider paid ngrok** for:
   - Reserved domains
   - IP whitelisting
   - Better security features

---

## 📝 Configuration Options

### Basic Configuration
```yaml
ngrok:
  image: ngrok/ngrok:latest
  command: ["http", "http://frontend:80"]
  environment:
    NGROK_AUTHTOKEN: ${NGROK_AUTHTOKEN}
  ports:
    - '4040:4040'
```

### Advanced Options
```yaml
ngrok:
  command: 
    - "http"
    - "http://frontend:80"
    - "--log=stdout"                    # Log to stdout
    - "--log-level=info"                # Log verbosity
    - "--region=us"                     # Server region (us, eu, ap, au, sa, jp, in)
```

### With Reserved Domain (Paid)
```yaml
ngrok:
  command: 
    - "http"
    - "http://frontend:80"
    - "--domain=your-domain.ngrok.io"  # Your reserved domain
```

---

## 🆘 Getting Help

1. **Check Configuration:**
   ```bash
   ./scripts/macos/configure-ngrok.sh
   ```

2. **View Logs:**
   ```bash
   docker-compose logs ngrok
   ```

3. **Ngrok Documentation:**
   - [Official Docs](https://ngrok.com/docs)
   - [API Reference](https://ngrok.com/docs/api)
   - [Support Forum](https://github.com/ngrok/ngrok/discussions)

4. **Project Issues:**
   - Check project [README.md](../../README.md)
   - Review [QUICKSTART.md](../../QUICKSTART.md)
   - Open a GitHub issue

---

## ✅ Quick Reference

```bash
# Start platform with ngrok
./scripts/macos/auto-start.sh

# Check ngrok status
./scripts/macos/configure-ngrok.sh

# View ngrok logs
docker-compose logs -f ngrok

# Get current URL
curl -s http://localhost:4040/api/tunnels | grep public_url

# Restart ngrok
docker-compose restart ngrok

# Stop everything
./scripts/macos/stop.sh

# View dashboard
open http://localhost:4040
```

---

**Need more help?** Run `./scripts/macos/configure-ngrok.sh` for automated diagnostics!
