#!/bin/bash

# AgileSourcing Deployment Script
# Run this after initial setup to deploy the application

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/agilesourcing"
APP_USER="agilesourcing"
REPO_URL="https://github.com/rbwahid/agilesourcing.git"
BRANCH="main"
PHP_VERSION="8.3"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AgileSourcing Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

cd ${APP_DIR}

# Check if this is first deployment or update
if [ ! -d "${APP_DIR}/backend/.git" ]; then
    echo -e "${YELLOW}First deployment - Cloning repository...${NC}"

    # Clone the repo
    sudo -u ${APP_USER} git clone ${REPO_URL} temp_clone
    mv temp_clone/backend/* backend/ 2>/dev/null || true
    mv temp_clone/backend/.* backend/ 2>/dev/null || true
    mv temp_clone/frontend/* frontend/ 2>/dev/null || true
    mv temp_clone/frontend/.* frontend/ 2>/dev/null || true
    rm -rf temp_clone

    # Initialize git in subdirectories for future pulls
    cd ${APP_DIR}/backend
    sudo -u ${APP_USER} git init
    sudo -u ${APP_USER} git remote add origin ${REPO_URL}
    sudo -u ${APP_USER} git fetch origin
    sudo -u ${APP_USER} git checkout -f origin/${BRANCH} -- .
else
    echo -e "${YELLOW}Updating existing deployment...${NC}"

    # Pull latest changes
    cd ${APP_DIR}/backend
    sudo -u ${APP_USER} git fetch origin
    sudo -u ${APP_USER} git reset --hard origin/${BRANCH}
fi

echo -e "${YELLOW}Step 1: Backend Deployment${NC}"
cd ${APP_DIR}/backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found! Creating from example...${NC}"
    sudo -u ${APP_USER} cp .env.example .env
    echo -e "${YELLOW}IMPORTANT: Edit ${APP_DIR}/backend/.env with your settings!${NC}"
fi

# Install/update Composer dependencies
sudo -u ${APP_USER} composer install --no-dev --optimize-autoloader --no-interaction

# Generate key if not set
if ! grep -q "^APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chown -R ${APP_USER}:www-data ${APP_DIR}/backend
chmod -R 775 ${APP_DIR}/backend/storage
chmod -R 775 ${APP_DIR}/backend/bootstrap/cache

# Create storage link if not exists
if [ ! -L "${APP_DIR}/backend/public/storage" ]; then
    php artisan storage:link
fi

echo -e "${YELLOW}Step 2: Frontend Deployment${NC}"
cd ${APP_DIR}/frontend

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}.env.local file not found! Creating...${NC}"
    cat > .env.local << 'ENV'
NEXT_PUBLIC_API_URL=https://api.agilesourcing.ca/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ENV
    chown ${APP_USER}:www-data .env.local
    echo -e "${YELLOW}IMPORTANT: Edit ${APP_DIR}/frontend/.env.local with your settings!${NC}"
fi

# Install dependencies
sudo -u ${APP_USER} npm ci

# Build
sudo -u ${APP_USER} npm run build

# Set permissions
chown -R ${APP_USER}:www-data ${APP_DIR}/frontend

echo -e "${YELLOW}Step 3: Restart Services${NC}"

# Restart PHP-FPM
systemctl restart php${PHP_VERSION}-fpm

# Restart queue workers
supervisorctl restart agilesourcing-worker:*

# Restart/start PM2 for Next.js
cd ${APP_DIR}/frontend
sudo -u ${APP_USER} pm2 delete agilesourcing-frontend 2>/dev/null || true
sudo -u ${APP_USER} pm2 start npm --name "agilesourcing-frontend" -- start
sudo -u ${APP_USER} pm2 save

# Set PM2 to start on boot
pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER}

# Reload Nginx
nginx -t && systemctl reload nginx

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Services Status:${NC}"
systemctl status php${PHP_VERSION}-fpm --no-pager -l | head -5
echo ""
supervisorctl status
echo ""
sudo -u ${APP_USER} pm2 status
echo ""
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Update ${APP_DIR}/backend/.env with production settings"
echo "2. Update ${APP_DIR}/frontend/.env.local with production settings"
echo "3. Set up SSL: sudo certbot --nginx -d agilesourcing.ca -d www.agilesourcing.ca -d api.agilesourcing.ca"
