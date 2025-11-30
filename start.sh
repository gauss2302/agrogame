#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
until nc -z agrogame-postgres 5432; do
  echo "Waiting for database..."
  sleep 2
done
echo "✅ PostgreSQL is ready"

echo "🔄 Running migrations..."
npm run db:push || echo "Migration failed, continuing..."

echo "🚀 Starting app..."
exec node .output/server/index.mjs