#!/bin/bash
set -e

echo "🔧 Building backend for Render..."
cd backend

echo "📦 Installing production dependencies..."
npm install --omit=dev

echo "🏗️ Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build complete! Server ready at dist/index.js"
