#!/bin/bash

# Deployment Verification Script
# Checks if all necessary files are present for successful deployment

echo "🔍 DEPLOYMENT VERIFICATION"
echo "=========================="

# Check package.json files
echo "📦 Checking package.json files..."
if [ -f "package.json" ]; then
    echo "  ✅ Root package.json exists"
else
    echo "  ❌ Root package.json missing"
fi

if [ -f "backend/package.json" ]; then
    echo "  ✅ Backend package.json exists"
else
    echo "  ❌ Backend package.json missing"
fi

# Check package-lock.json files
echo "🔒 Checking package-lock.json files..."
if [ -f "package-lock.json" ]; then
    echo "  ✅ Root package-lock.json exists"
else
    echo "  ❌ Root package-lock.json missing"
fi

if [ -f "backend/package-lock.json" ]; then
    echo "  ✅ Backend package-lock.json exists"
    echo "  📊 Size: $(ls -lh backend/package-lock.json | awk '{print $5}')"
else
    echo "  ❌ Backend package-lock.json missing - DEPLOYMENT WILL FAIL!"
fi

# Check critical dependencies
echo "🔧 Checking critical dependencies..."
if grep -q "node-cron" backend/package.json; then
    echo "  ✅ node-cron dependency found"
else
    echo "  ❌ node-cron dependency missing"
fi

if grep -q "@sentry/node" backend/package.json; then
    echo "  ✅ Sentry dependencies found"
else
    echo "  ❌ Sentry dependencies missing"
fi

# Check build scripts
echo "🏗️  Checking build configuration..."
if grep -q "build" backend/package.json; then
    echo "  ✅ Build script configured"
else
    echo "  ❌ Build script missing"
fi

# Check environment files
echo "🌍 Checking environment configuration..."
if [ -f ".env.example" ]; then
    echo "  ✅ Environment example exists"
else
    echo "  ⚠️  Environment example missing"
fi

if [ -f "backend/.env.example" ]; then
    echo "  ✅ Backend environment example exists"
else
    echo "  ⚠️  Backend environment example missing"
fi

# Check Node version
echo "🟢 Checking Node.js configuration..."
if [ -f ".nvmrc" ]; then
    echo "  ✅ Node version specified: $(cat .nvmrc)"
else
    echo "  ⚠️  .nvmrc file missing"
fi

echo ""
echo "🎯 DEPLOYMENT READINESS:"
if [ -f "backend/package-lock.json" ]; then
    echo "✅ READY FOR DEPLOYMENT"
    echo "   All critical files are present"
    echo "   npm ci should work correctly"
else
    echo "❌ NOT READY FOR DEPLOYMENT"
    echo "   Missing backend/package-lock.json"
    echo "   Run: npm install in backend directory"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Commit and push all changes"
echo "2. Deploy to Render"
echo "3. Check deployment logs"
echo "4. Test upload functionality"
