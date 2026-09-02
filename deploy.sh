#!/usr/bin/env bash
# Publica a página em https://aibdigitall.com/dratercialink (VPS AIB Digital, atrás do Traefik do Coolify).
# Uso: ./deploy.sh
set -euo pipefail
HOST=root@92.113.32.30
DIR=/root/apps/dra-tersia
NAME=dra-tersia

rsync -az --delete --exclude node_modules --exclude .output --exclude .git --exclude .env --exclude .env.local ./ "$HOST:$DIR/"

ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
cd $DIR
docker build -q -t $NAME:latest .
docker rm -f $NAME >/dev/null 2>&1 || true
ENV_FILE=""
[ -f $DIR/.env ] && ENV_FILE="--env-file $DIR/.env"
docker run -d --name $NAME --restart unless-stopped --network coolify \$ENV_FILE \
  -e NODE_ENV=production -e PORT=3000 -e HOST=0.0.0.0 \
  -l traefik.enable=true \
  -l "traefik.http.services.$NAME.loadbalancer.server.port=3000" \
  -l "traefik.http.routers.$NAME-http.entryPoints=http" \
  -l "traefik.http.routers.$NAME-http.rule=(Host(\\\`aibdigitall.com\\\`) || Host(\\\`www.aibdigitall.com\\\`)) && PathPrefix(\\\`/dratercialink\\\`)" \
  -l "traefik.http.routers.$NAME-http.middlewares=redirect-to-https" \
  -l "traefik.http.routers.$NAME-http.service=$NAME" \
  -l "traefik.http.routers.$NAME-https.entryPoints=https" \
  -l "traefik.http.routers.$NAME-https.rule=(Host(\\\`aibdigitall.com\\\`) || Host(\\\`www.aibdigitall.com\\\`)) && PathPrefix(\\\`/dratercialink\\\`)" \
  -l "traefik.http.routers.$NAME-https.priority=100" \
  -l "traefik.http.routers.$NAME-https.tls=true" \
  -l "traefik.http.routers.$NAME-https.tls.certresolver=letsencrypt" \
  -l "traefik.http.routers.$NAME-https.middlewares=gzip" \
  -l "traefik.http.routers.$NAME-https.service=$NAME" \
  $NAME:latest >/dev/null
sleep 4
docker ps --filter name=$NAME --format "{{.Names}}: {{.Status}}"
REMOTE

echo "Publicado: https://aibdigitall.com/dratercialink/"
