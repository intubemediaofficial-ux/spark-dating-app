# MatchKar — Deployment Guide

Complete guide to deploy MatchKar on your DigitalOcean / Hostinger VPS and publish to Google Play Store.

---

## 1. Server Requirements

- **OS:** Ubuntu 22.04+ (recommended)
- **RAM:** 2 GB minimum
- **Storage:** 20 GB
- **Domain:** matchkar.com (pointed to server IP)

---

## 2. Server Setup (DigitalOcean / VPS)

### 2.1 SSH into your server

```bash
ssh root@YOUR_SERVER_IP
```

### 2.2 Install Docker & Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

### 2.3 Install Nginx (reverse proxy)

```bash
apt install nginx certbot python3-certbot-nginx -y
```

### 2.4 Clone the repository

```bash
cd /opt
git clone https://github.com/intubemediaofficial-ux/spark-dating-app.git matchkar
cd matchkar
```

### 2.5 Configure environment

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Fill in all values:
- `DATABASE_URL` — will be auto-set by Docker Compose
- `JWT_SECRET` — generate with: `openssl rand -hex 32`
- `CLOUDINARY_*` — from https://cloudinary.com/console
- `FIREBASE_*` — from Firebase Console → Project Settings → Service Account
- `RAZORPAY_*` — from https://dashboard.razorpay.com/app/keys

### 2.6 Start services

```bash
docker compose up -d
```

### 2.7 Run database migrations

```bash
docker compose exec backend npx prisma db push
```

### 2.8 Seed bot profiles

```bash
docker compose exec backend node prisma/seed.js
docker compose exec backend node prisma/seed-bots.js
```

---

## 3. Domain & SSL Setup

### 3.1 Point domain to server

In your domain registrar (GoDaddy/Namecheap/Hostinger):
- **A Record:** `matchkar.com` → `YOUR_SERVER_IP`
- **A Record:** `api.matchkar.com` → `YOUR_SERVER_IP`
- **A Record:** `admin.matchkar.com` → `YOUR_SERVER_IP`

### 3.2 Configure Nginx

```bash
nano /etc/nginx/sites-available/matchkar
```

Paste:
```nginx
# API Backend
server {
    server_name api.matchkar.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel
server {
    server_name admin.matchkar.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/matchkar /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 3.3 SSL Certificate (free, auto-renew)

```bash
certbot --nginx -d api.matchkar.com -d admin.matchkar.com
```

---

## 4. Mobile App — Update API URL

In `mobile/src/config/api.js` (or wherever the API base URL is set), change:
```js
const API_URL = 'https://api.matchkar.com';
```

---

## 5. Google Play Store Deployment

### 5.1 Prerequisites

1. **Google Play Developer Account** — https://play.google.com/console ($25 one-time fee)
2. **EAS CLI** installed: `npm install -g eas-cli`
3. **Expo account** — https://expo.dev/signup

### 5.2 Login to EAS

```bash
cd mobile
eas login
```

### 5.3 Configure project

```bash
eas build:configure
```

Update `eas.json` with your project ID from https://expo.dev.

### 5.4 Build APK (for testing)

```bash
eas build --platform android --profile preview
```

This generates an APK you can install directly on any Android phone for testing.

### 5.5 Build AAB (for Play Store)

```bash
eas build --platform android --profile production
```

This generates an AAB (Android App Bundle) required by Play Store.

### 5.6 Upload to Play Store

1. Go to https://play.google.com/console
2. **Create App** → Name: "MatchKar", Category: "Dating", Free
3. **Store Listing:**
   - Title: MatchKar - Dating & Match
   - Short description: "Match Kar, Pyaar Kar — Find your perfect match nearby"
   - Full description: (detailed app features)
   - Screenshots: At least 2 phone screenshots
   - Feature graphic: 1024x500 banner
   - App icon: 512x512
4. **Content Rating:** Fill questionnaire (Dating category)
5. **Privacy Policy:** https://matchkar.com/privacy
6. **App Content → Data Safety:** Declare collected data
7. **Release → Production:** Upload AAB file
8. **Submit for Review** (7-14 days for first review)

### 5.7 EAS Submit (automated upload)

```bash
eas submit --platform android --profile production
```

You'll need a Google Play Service Account JSON key — follow:
https://docs.expo.dev/submit/android/#creating-a-google-service-account

---

## 6. Firebase Setup

### 6.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create project "MatchKar"
3. Enable **Authentication** → Phone Sign-In
4. Enable **Cloud Messaging**

### 6.2 Download config files

- **Android:** Download `google-services.json` → place in `mobile/`
- **Service Account:** Project Settings → Service Accounts → Generate New Private Key → save values to `.env`

---

## 7. Razorpay Setup

1. Go to https://dashboard.razorpay.com
2. Sign up / Sign in
3. Go to **Settings → API Keys**
4. Generate Key ID and Key Secret
5. Add to your `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   ```

---

## 8. Cloudinary Setup

1. Go to https://cloudinary.com/console
2. Sign up (free plan: 25K images/month)
3. Copy Cloud Name, API Key, API Secret
4. Add to `.env`

---

## 9. Maintenance Commands

```bash
# View logs
docker compose logs -f backend

# Restart services
docker compose restart

# Update code
cd /opt/matchkar
git pull
docker compose build
docker compose up -d

# Database backup
docker compose exec db pg_dump -U matchkar matchkar > backup_$(date +%Y%m%d).sql

# Restore from backup
docker compose exec -T db psql -U matchkar matchkar < backup_20240101.sql

# Seed more bot profiles
docker compose exec backend node prisma/seed-bots.js
```

---

## 10. Monitoring

- **Server:** Use DigitalOcean monitoring or install `htop`
- **API health:** `curl https://api.matchkar.com/api/health`
- **Logs:** `docker compose logs -f backend --tail 100`
- **Database:** `docker compose exec backend npx prisma studio` (port 5555)

---

## Cost Summary

| Item | Cost |
|------|------|
| Play Store Account | ₹2,100 (one-time) |
| Domain (matchkar.com) | ~₹800/yr |
| VPS (DigitalOcean/Hostinger) | ₹500-1500/mo |
| Firebase | Free (up to 10K users) |
| Cloudinary | Free (up to 25K images) |
| Razorpay | 2% per transaction |
| **Total monthly** | **~₹500-1500/mo** |
