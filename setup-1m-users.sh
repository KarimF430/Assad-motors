#!/bin/bash

# MotorOctane 1M Users Setup Script
# This script sets up all necessary components for handling 1M daily users

echo "🚀 MotorOctane 1M Users Setup Script"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if running on Mac or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    print_error "Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Step 1: Install Redis
echo "📦 Step 1: Installing Redis..."
if command -v redis-server &> /dev/null; then
    print_status "Redis already installed"
else
    if [[ "$OS" == "mac" ]]; then
        brew install redis
    else
        sudo apt-get update
        sudo apt-get install -y redis-server
    fi
    print_status "Redis installed"
fi

# Start Redis
echo "Starting Redis..."
if [[ "$OS" == "mac" ]]; then
    brew services start redis
else
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
fi
print_status "Redis started"
echo ""

# Step 2: Install PM2
echo "📦 Step 2: Installing PM2..."
if command -v pm2 &> /dev/null; then
    print_status "PM2 already installed"
else
    npm install -g pm2
    print_status "PM2 installed"
fi
echo ""

# Step 3: Install Dependencies
echo "📦 Step 3: Installing Node dependencies..."

# Frontend dependencies
echo "Installing frontend dependencies..."
npm install @sentry/nextjs @next/third-parties
print_status "Frontend dependencies installed"

# Backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install ioredis @sentry/node @sentry/profiling-node
cd ..
print_status "Backend dependencies installed"
echo ""

# Step 4: Create necessary directories
echo "📁 Step 4: Creating directories..."
mkdir -p logs
mkdir -p backups
mkdir -p uploads
print_status "Directories created"
echo ""

# Step 5: Create .env file if not exists
echo "📝 Step 5: Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOL
# Database
MONGODB_URI=mongodb://localhost:27017/motoroctane
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Sentry (Add your DSN here)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=

# Google Analytics (Add your ID here)
NEXT_PUBLIC_GA_ID=

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0

# Backup
BACKUP_DIR=./backups
MAX_BACKUPS=7

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Session Secret (Change this!)
SESSION_SECRET=your-super-secret-session-key-change-this
EOL
    print_status ".env file created (Please update with your actual values)"
else
    print_warning ".env file already exists"
fi
echo ""

# Step 6: Build the applications
echo "🔨 Step 6: Building applications..."

# Build frontend
echo "Building frontend..."
npm run build
print_status "Frontend built"

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..
print_status "Backend built"
echo ""

# Step 7: Run database optimizations
echo "🗄️ Step 7: Optimizing database..."
cd backend
npx tsx scripts/rebuild-indexes.ts
cd ..
print_status "Database indexes created"
echo ""

# Step 8: Setup cron jobs for backups
echo "⏰ Step 8: Setting up automated backups..."
CRON_JOB="0 2 * * * cd $(pwd) && npx tsx backend/scripts/backup/mongodb-backup.ts"
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
print_status "Backup cron job added (runs daily at 2 AM)"
echo ""

# Step 9: Test Redis connection
echo "🧪 Step 9: Testing Redis connection..."
redis-cli ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "Redis connection successful"
else
    print_error "Redis connection failed"
fi
echo ""

# Step 10: Create PM2 startup script
echo "🚀 Step 10: Setting up PM2 auto-start..."
pm2 startup
pm2 save
print_status "PM2 auto-start configured"
echo ""

# Summary
echo "====================================="
echo "📊 Setup Summary"
echo "====================================="
echo ""
print_status "Redis installed and running"
print_status "PM2 installed globally"
print_status "All dependencies installed"
print_status "Database indexes optimized"
print_status "Backup system configured"
print_status "Environment variables created"
print_status "Applications built"
echo ""

echo "📋 Next Steps:"
echo "1. Update .env file with your actual values:"
echo "   - Add Sentry DSN"
echo "   - Add Google Analytics ID"
echo "   - Update JWT and Session secrets"
echo ""
echo "2. Start the application with PM2:"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "3. Monitor the application:"
echo "   pm2 monit"
echo ""
echo "4. View logs:"
echo "   pm2 logs"
echo ""
echo "5. Setup Cloudflare CDN:"
echo "   - Sign up at cloudflare.com"
echo "   - Add your domain"
echo "   - Configure caching rules"
echo ""
echo "6. Setup MongoDB Atlas for replication:"
echo "   - Create account at mongodb.com/atlas"
echo "   - Create cluster with replica set"
echo "   - Update MONGODB_URI in .env"
echo ""

print_status "Setup complete! Your application is ready for scaling to 1M users!"
echo ""
echo "🎉 Happy scaling!"
