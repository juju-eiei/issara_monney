#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing backend dependencies..."
npm install

echo "🛠️ Generating Prisma Client and Database..."
npx prisma generate
npx prisma db push

echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Build complete!"
