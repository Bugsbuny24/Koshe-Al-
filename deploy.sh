#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Koshei Production Başlatılıyor..."

# 1. Ortam değişkenlerini yükle
set -a
source .env.production
set +a

# 2. Kod güncelleme ve build
git pull origin main
npm ci
npm run build

# 3. Supabase migration ve seed
supabase db push --project-ref $SUPABASE_PROJECT_REF
supabase db seed --file ./seed_data.json

# 4. Supabase functions ve auth
supabase functions deploy --project-ref $SUPABASE_PROJECT_REF
supabase auth enable

# 5. PM2 ile production server
pm2 reload koshei-prod 2>/dev/null || pm2 start npm --name "koshei-prod" -- start
pm2 save

# 6. Nginx reverse proxy + SSL
nginx -t && systemctl reload nginx
if ! certbot certificates 2>/dev/null | grep -q "koshei.example.com"; then
  certbot --nginx -d koshei.example.com --non-interactive --agree-tos -m admin@koshei.example.com
fi

# 7. Healthcheck
curl -fsS https://koshei.example.com/_health || { echo "⚠️ Healthcheck başarısız"; exit 1; }

# 8. Günlük yedekleme cron
CRON_JOB="0 3 * * * pg_dump $SUPABASE_DB_URL -Fc -f /var/backups/koshei_\$(date +\%F).dump"
( crontab -l 2>/dev/null | grep -qF "koshei_" ) || ( crontab -l 2>/dev/null; echo "$CRON_JOB" ) | crontab -

echo "✅ Koshei Production başarıyla çalışıyor!"
