#!/usr/bin/env bash
# Ручний деплой vl_site на 91.239.235.97. Запускати з кореня репозиторію:
#   bash deploy.sh
#
# На відміну від pmh_b2b (там локальна збірка + scp) — тут git pull і збірка
# відбуваються прямо на сервері (Next.js має нативні біндинги, зібрані під
# Windows не запустяться на Linux). Ніколи не чіпає .env на сервері — лише
# код і pm2-процес ЦЬОГО проєкту (через ecosystem.config.js, інші застосунки
# на сервері не перезапускаються).
set -euo pipefail

SERVER="root@91.239.235.97"
REMOTE_ROOT="/var/www/vl_site"
KEY="$HOME/.ssh/id_ed25519"
SSH="ssh -i $KEY $SERVER"

echo "==> Оновлення на сервері (git pull, збірка, міграції, перезапуск)..."
$SSH bash -s <<'REMOTE'
set -e
cd /var/www/vl_site
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 startOrReload ecosystem.config.js
REMOTE

echo "==> Готово: https://lemeshko.org"
