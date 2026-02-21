#!/bin/bash
set -e

echo "🔧 Building backend..."
cd backend

echo "📦 Installing dependencies..."
npm ci --only=production

echo "🏗️ Building application..."
npm run build

echo "✅ Backend build complete!"
