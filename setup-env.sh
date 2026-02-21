#!/bin/bash

# Setup Environment Variables Script
# This creates the .env file with R2 configuration

echo "🔧 Setting up backend .env file..."

# Create the backend .env file
cat > backend/.env << 'EOF'
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/motoroctane

# JWT Secret
JWT_SECRET=motoroctane-super-secret-key-change-in-production

# Server Configuration
NODE_ENV=development
PORT=5001

# Cloudflare R2 Storage Configuration (Required for image uploads)
R2_BUCKET=killerwhale
R2_ACCOUNT_ID=68f29b8a9b7761d61a0c03abb5e11db0
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
R2_PUBLIC_BASE_URL=https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev
R2_REGION=auto

# Sentry Error Tracking (Optional)
SENTRY_DSN=https://fcc246ee6b9ce924e62913ec99901490@o4510345482797056.ingest.us.sentry.io/4510345509142528
EOF

echo "✅ Created backend/.env file"
echo ""
echo "🚨 IMPORTANT: You need to update the R2 credentials!"
echo ""
echo "📋 Next steps:"
echo "1. Get R2 credentials from Cloudflare Dashboard:"
echo "   - Go to Cloudflare Dashboard → R2 Object Storage"
echo "   - Click 'Manage R2 API tokens'"
echo "   - Create new token with 'Object Read & Write' permissions"
echo "   - Copy the Access Key ID and Secret Access Key"
echo ""
echo "2. Edit backend/.env and replace:"
echo "   R2_ACCESS_KEY_ID=your_r2_access_key_here"
echo "   R2_SECRET_ACCESS_KEY=your_r2_secret_key_here"
echo ""
echo "3. Restart your server"
echo "4. Test image upload"
echo ""
echo "🔍 To verify R2 configuration after updating credentials:"
echo "   cd backend && node check-r2-status.js"
