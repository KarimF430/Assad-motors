#!/bin/bash

# Mobile Setup Script for MotorOctane
# Configures the app for mobile device access

echo "🔧 MotorOctane Mobile Setup"
echo ""

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "📱 Local IP Address: $LOCAL_IP"
echo ""

# Function to setup for mobile
setup_mobile() {
    echo "📱 Setting up for mobile access..."
    
    # Copy mobile environment
    cp .env.mobile .env
    
    # Update IP in mobile env if it changed
    sed -i '' "s/192\.168\.1\.23/$LOCAL_IP/g" .env
    
    echo "✅ Mobile configuration applied!"
    echo ""
    echo "📋 Mobile Access URLs:"
    echo "   Frontend: http://$LOCAL_IP:3000"
    echo "   Backend:  http://$LOCAL_IP:5001"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Make sure your mobile device is on the same WiFi network"
    echo "   2. Open http://$LOCAL_IP:3000 in your mobile browser"
    echo "   3. The backend API will be accessible at http://$LOCAL_IP:5001"
    echo ""
}

# Function to setup for desktop
setup_desktop() {
    echo "💻 Setting up for desktop access..."
    
    # Create desktop environment
    cat > .env << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

# Mobile Access Configuration
NEXT_PUBLIC_LOCAL_IP=$LOCAL_IP
NEXT_PUBLIC_MOBILE_API_URL=http://$LOCAL_IP:5001
NEXT_PUBLIC_MOBILE_BACKEND_URL=http://$LOCAL_IP:5001

# Environment
NODE_ENV=development
EOF
    
    echo "✅ Desktop configuration applied!"
    echo ""
    echo "📋 Desktop Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5001"
    echo ""
}

# Function to show current configuration
show_config() {
    echo "📊 Current Configuration:"
    echo ""
    if grep -q "localhost" .env; then
        echo "   Mode: 💻 Desktop"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:5001"
    else
        echo "   Mode: 📱 Mobile"
        echo "   Frontend: http://$LOCAL_IP:3000"
        echo "   Backend:  http://$LOCAL_IP:5001"
    fi
    echo ""
}

# Function to test connectivity
test_backend() {
    echo "🔍 Testing backend connectivity..."
    echo ""
    
    # Test localhost
    if curl -s http://localhost:5001/api/brands > /dev/null; then
        echo "✅ Desktop backend (localhost:5001) - Working"
    else
        echo "❌ Desktop backend (localhost:5001) - Not accessible"
    fi
    
    # Test mobile IP
    if curl -s http://$LOCAL_IP:5001/api/brands > /dev/null; then
        echo "✅ Mobile backend ($LOCAL_IP:5001) - Working"
    else
        echo "❌ Mobile backend ($LOCAL_IP:5001) - Not accessible"
    fi
    echo ""
}

# Main menu
case "$1" in
    "mobile")
        setup_mobile
        ;;
    "desktop")
        setup_desktop
        ;;
    "status")
        show_config
        ;;
    "test")
        test_backend
        ;;
    *)
        echo "📝 Usage:"
        echo "   ./mobile-setup.sh mobile   - Setup for mobile access"
        echo "   ./mobile-setup.sh desktop  - Setup for desktop access"
        echo "   ./mobile-setup.sh status   - Show current configuration"
        echo "   ./mobile-setup.sh test     - Test backend connectivity"
        echo ""
        show_config
        ;;
esac
