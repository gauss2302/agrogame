#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
until nc -z agrogame-postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

echo "🔄 Running migrations..."
npx drizzle-kit push

echo "🌱 Running seed..."
npx tsx src/db/seed.ts || true

echo "🚀 Starting app..."
exec node .output/server/index.mjs