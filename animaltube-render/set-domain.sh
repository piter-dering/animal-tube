#!/bin/sh
# Uzycie: ./set-domain.sh animaltube.pl  (albo xxx.vercel.app)
sed -i "s#TWOJA-DOMENA.pl#$1#g" public/index.html public/robots.txt public/sitemap.xml
echo "Ustawiono domene: $1"
