#!/bin/bash

# AgileSourcing Server Setup Script
# Ubuntu 24.04 LTS on Hostinger
# Frontend: agilesourcing.ca
# Backend: api.agilesourcing.ca

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AgileSourcing Server Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
DOMAIN="agilesourcing.ca"
API_DOMAIN="api.agilesourcing.ca"
APP_USER="agilesourcing"
APP_DIR="/var/www/agilesourcing"
PHP_VERSION="8.3"
NODE_VERSION="20"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: System Update${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Install Basic Dependencies${NC}"
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    acl

echo -e "${YELLOW}Step 3: Install Nginx${NC}"
apt install -y nginx
systemctl enable nginx
systemctl start nginx

echo -e "${YELLOW}Step 4: Install PHP ${PHP_VERSION}${NC}"
add-apt-repository -y ppa:ondrej/php
apt update
apt install -y \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-common \
    php${PHP_VERSION}-mysql \
    php${PHP_VERSION}-pgsql \
    php${PHP_VERSION}-sqlite3 \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-imagick \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-bcmath \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-readline \
    php${PHP_VERSION}-redis \
    php${PHP_VERSION}-opcache

# Configure PHP
sed -i "s/upload_max_filesize = .*/upload_max_filesize = 64M/" /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i "s/post_max_size = .*/post_max_size = 64M/" /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i "s/memory_limit = .*/memory_limit = 512M/" /etc/php/${PHP_VERSION}/fpm/php.ini
sed -i "s/max_execution_time = .*/max_execution_time = 120/" /etc/php/${PHP_VERSION}/fpm/php.ini

systemctl restart php${PHP_VERSION}-fpm

echo -e "${YELLOW}Step 5: Install MySQL 8${NC}"
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

# Secure MySQL
echo -e "${YELLOW}Setting up MySQL...${NC}"
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24)
MYSQL_APP_PASSWORD=$(openssl rand -base64 24)

mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';"
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS agilesourcing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS 'agilesourcing'@'localhost' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';"
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON agilesourcing.* TO 'agilesourcing'@'localhost';"
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

echo -e "${YELLOW}Step 6: Install Redis${NC}"
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Configure Redis
sed -i "s/supervised no/supervised systemd/" /etc/redis/redis.conf
systemctl restart redis-server

echo -e "${YELLOW}Step 7: Install Node.js ${NODE_VERSION}${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs
npm install -g pm2

echo -e "${YELLOW}Step 8: Install Composer${NC}"
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

echo -e "${YELLOW}Step 9: Install Supervisor${NC}"
apt install -y supervisor
systemctl enable supervisor
systemctl start supervisor

echo -e "${YELLOW}Step 10: Create Application User${NC}"
if ! id "${APP_USER}" &>/dev/null; then
    useradd -m -s /bin/bash ${APP_USER}
    usermod -aG www-data ${APP_USER}
fi

echo -e "${YELLOW}Step 11: Create Directory Structure${NC}"
mkdir -p ${APP_DIR}/backend
mkdir -p ${APP_DIR}/frontend
mkdir -p ${APP_DIR}/logs
chown -R ${APP_USER}:www-data ${APP_DIR}
chmod -R 775 ${APP_DIR}

echo -e "${YELLOW}Step 12: Configure Nginx${NC}"
# Backend API config
cat > /etc/nginx/sites-available/${API_DOMAIN} << 'NGINX_API'
server {
    listen 80;
    server_name api.agilesourcing.ca;
    root /var/www/agilesourcing/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 120;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 64M;
}
NGINX_API

# Frontend config
cat > /etc/nginx/sites-available/${DOMAIN} << 'NGINX_FRONTEND'
server {
    listen 80;
    server_name agilesourcing.ca www.agilesourcing.ca;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120;
    }
}
NGINX_FRONTEND

# Enable sites
ln -sf /etc/nginx/sites-available/${API_DOMAIN} /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo -e "${YELLOW}Step 13: Configure Supervisor for Laravel Queue${NC}"
cat > /etc/supervisor/conf.d/agilesourcing-worker.conf << 'SUPERVISOR'
[program:agilesourcing-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/agilesourcing/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=agilesourcing
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/agilesourcing/logs/worker.log
stopwaitsecs=3600
SUPERVISOR

supervisorctl reread
supervisorctl update

echo -e "${YELLOW}Step 14: Install Certbot for SSL${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}Step 15: Configure Firewall${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Server Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Save these credentials securely!${NC}"
echo ""
echo "MySQL Root Password: ${MYSQL_ROOT_PASSWORD}"
echo "MySQL App Password: ${MYSQL_APP_PASSWORD}"
echo "MySQL Database: agilesourcing"
echo "MySQL User: agilesourcing"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Clone your repository to ${APP_DIR}"
echo "2. Run the deploy script: sudo ./deploy.sh"
echo "3. Set up SSL: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d ${API_DOMAIN}"
echo ""
echo -e "${YELLOW}Save these credentials to a secure location!${NC}"

# Save credentials to file (remove after noting them down)
cat > /root/agilesourcing-credentials.txt << CREDS
AgileSourcing Server Credentials
================================
MySQL Root Password: ${MYSQL_ROOT_PASSWORD}
MySQL App Password: ${MYSQL_APP_PASSWORD}
MySQL Database: agilesourcing
MySQL User: agilesourcing

DELETE THIS FILE AFTER SAVING CREDENTIALS ELSEWHERE!
CREDS

chmod 600 /root/agilesourcing-credentials.txt
echo -e "${RED}Credentials saved to /root/agilesourcing-credentials.txt - DELETE after saving!${NC}"
