#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo -e "${RED}Please run as root${NC}";sleep 0.5
  exit 1
fi

CDIR=$(realpath $(dirname "$0"))
apt update
apt install -y nginx
cp "$CDIR/nginx-config" /etc/nginx/sites-available/default
cp -r "$CDIR/parkit_web" /var/www/

service nginx restart

