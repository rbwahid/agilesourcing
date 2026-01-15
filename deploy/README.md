# AgileSourcing Server Deployment Guide

This guide covers deploying AgileSourcing to a fresh Ubuntu 24.04 LTS server on Hostinger.

## Server Requirements

- Ubuntu 24.04 LTS
- Minimum 2GB RAM (4GB recommended)
- 20GB+ storage
- Root SSH access

## Domains

- Frontend: `agilesourcing.ca`
- Backend API: `api.agilesourcing.ca`

## Quick Start

### Step 1: Connect to Your Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Download and Run Setup Script

```bash
# Download the setup script
wget https://raw.githubusercontent.com/rbwahid/agilesourcing/main/deploy/setup.sh

# Make executable
chmod +x setup.sh

# Run setup
./setup.sh
```

**IMPORTANT**: Save the MySQL credentials shown at the end!

### Step 3: Configure DNS

Point your domain DNS records to your server IP:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |
| A | api | YOUR_SERVER_IP |

Wait for DNS propagation (can take up to 48 hours, usually faster).

### Step 4: Clone Repository

```bash
cd /var/www/agilesourcing

# Clone as the app user
sudo -u agilesourcing git clone https://github.com/rbwahid/agilesourcing.git temp
mv temp/backend/* backend/
mv temp/frontend/* frontend/
rm -rf temp
```

### Step 5: Configure Environment Files

#### Backend (.env)

```bash
cd /var/www/agilesourcing/backend
sudo -u agilesourcing cp .env.example .env
sudo -u agilesourcing nano .env
```

Update these critical values:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.agilesourcing.ca`
- `DB_PASSWORD=` (from setup.sh output)
- `FRONTEND_URL=https://agilesourcing.ca`
- `SANCTUM_STATEFUL_DOMAINS=agilesourcing.ca,www.agilesourcing.ca`
- `SESSION_DOMAIN=.agilesourcing.ca`
- `SESSION_SECURE_COOKIE=true`

#### Frontend (.env.local)

```bash
cd /var/www/agilesourcing/frontend
sudo -u agilesourcing nano .env.local
```

Add:
```
NEXT_PUBLIC_API_URL=https://api.agilesourcing.ca/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
```

### Step 6: Run Deployment

```bash
cd /var/www/agilesourcing
wget https://raw.githubusercontent.com/rbwahid/agilesourcing/main/deploy/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### Step 7: Set Up SSL Certificates

```bash
certbot --nginx -d agilesourcing.ca -d www.agilesourcing.ca -d api.agilesourcing.ca
```

Follow the prompts to:
1. Enter your email
2. Agree to terms
3. Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### Step 8: Verify Deployment

1. Visit `https://agilesourcing.ca` - should show the frontend
2. Visit `https://api.agilesourcing.ca/api/health` - should return JSON response
3. Check services:

```bash
# Check PHP-FPM
systemctl status php8.3-fpm

# Check Nginx
systemctl status nginx

# Check queue workers
supervisorctl status

# Check frontend
sudo -u agilesourcing pm2 status
```

## Updating the Application

To deploy updates after initial setup:

```bash
cd /var/www/agilesourcing
./deploy.sh
```

## Manual Commands

### Backend

```bash
cd /var/www/agilesourcing/backend

# Run migrations
sudo -u agilesourcing php artisan migrate

# Clear caches
sudo -u agilesourcing php artisan config:clear
sudo -u agilesourcing php artisan cache:clear

# Rebuild caches
sudo -u agilesourcing php artisan config:cache
sudo -u agilesourcing php artisan route:cache
sudo -u agilesourcing php artisan view:cache

# Check logs
tail -f storage/logs/laravel.log
tail -f storage/logs/security.log
```

### Frontend

```bash
cd /var/www/agilesourcing/frontend

# Rebuild
sudo -u agilesourcing npm run build

# Restart
sudo -u agilesourcing pm2 restart agilesourcing-frontend

# Check logs
sudo -u agilesourcing pm2 logs agilesourcing-frontend
```

### Queue Workers

```bash
# Restart workers
supervisorctl restart agilesourcing-worker:*

# Check worker logs
tail -f /var/www/agilesourcing/logs/worker.log
```

## Troubleshooting

### 502 Bad Gateway

```bash
# Check PHP-FPM
systemctl status php8.3-fpm
systemctl restart php8.3-fpm

# Check Nginx error log
tail -f /var/log/nginx/error.log
```

### Frontend Not Loading

```bash
# Check PM2
sudo -u agilesourcing pm2 status
sudo -u agilesourcing pm2 logs agilesourcing-frontend

# Restart frontend
sudo -u agilesourcing pm2 restart agilesourcing-frontend
```

### Permission Errors

```bash
cd /var/www/agilesourcing/backend
chown -R agilesourcing:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### SSL Certificate Renewal

Certbot auto-renews, but you can test manually:

```bash
certbot renew --dry-run
```

## Security Checklist

Before going live, ensure:

- [ ] `APP_DEBUG=false` in backend .env
- [ ] Strong MySQL password set
- [ ] SSL certificates installed
- [ ] Firewall enabled (UFW)
- [ ] API keys configured (Stripe, OpenAI, etc.)
- [ ] Email provider configured
- [ ] Backups configured

## File Locations

| Component | Location |
|-----------|----------|
| Backend | `/var/www/agilesourcing/backend` |
| Frontend | `/var/www/agilesourcing/frontend` |
| Nginx API config | `/etc/nginx/sites-available/api.agilesourcing.ca` |
| Nginx Frontend config | `/etc/nginx/sites-available/agilesourcing.ca` |
| Supervisor config | `/etc/supervisor/conf.d/agilesourcing-worker.conf` |
| PHP-FPM config | `/etc/php/8.3/fpm/php.ini` |
| Logs | `/var/www/agilesourcing/logs/` |
| Credentials (temp) | `/root/agilesourcing-credentials.txt` |
