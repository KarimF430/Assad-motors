#!/bin/bash

# MotorOctane Load Test Runner
# Usage: ./run-load-test.sh [quick|full]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:5001}"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        MotorOctane K6 Load Test Runner${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check if K6 is installed
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}❌ K6 is not installed!${NC}"
    echo ""
    echo "Install K6:"
    echo "  macOS:   brew install k6"
    echo "  Linux:   See K6_LOAD_TEST_GUIDE.md"
    echo "  Windows: choco install k6"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ K6 is installed ($(k6 version | head -n 1))${NC}"
echo ""

# Check if services are running
echo -e "${YELLOW}🔍 Checking services...${NC}"
echo ""

# Check Frontend
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend is running at $FRONTEND_URL${NC}"
else
    echo -e "${RED}❌ Frontend is not responding at $FRONTEND_URL${NC}"
    echo -e "${YELLOW}   Please start frontend: npm run dev${NC}"
    exit 1
fi

# Check Backend
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/brands" | grep -q "200"; then
    echo -e "${GREEN}✅ Backend is running at $BACKEND_URL${NC}"
else
    echo -e "${RED}❌ Backend is not responding at $BACKEND_URL/api/brands${NC}"
    echo -e "${YELLOW}   Please start backend: cd backend && npm run dev${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Determine test type
TEST_TYPE="${1:-quick}"

case "$TEST_TYPE" in
    quick)
        echo -e "${YELLOW}🚀 Running Quick Smoke Test (5 minutes)${NC}"
        echo ""
        k6 run k6-quick-test.js \
            -e BASE_URL="$FRONTEND_URL" \
            -e BACKEND_URL="$BACKEND_URL"
        ;;
    
    full)
        echo -e "${YELLOW}🚀 Running Full Load Test (~67 minutes)${NC}"
        echo -e "${YELLOW}   Target: 500k daily users (~20 users/second)${NC}"
        echo ""
        echo -e "${RED}⚠️  This will run for over an hour!${NC}"
        echo -e "${YELLOW}   Press Ctrl+C within 5 seconds to cancel...${NC}"
        echo ""
        sleep 5
        
        k6 run k6-load-test.js \
            -e BASE_URL="$FRONTEND_URL" \
            -e BACKEND_URL="$BACKEND_URL" \
            --out json=load-test-results.json
        
        echo ""
        echo -e "${GREEN}✅ Test complete! Results saved to load-test-results.json${NC}"
        ;;
    
    *)
        echo -e "${RED}❌ Invalid test type: $TEST_TYPE${NC}"
        echo ""
        echo "Usage: ./run-load-test.sh [quick|full]"
        echo ""
        echo "Options:"
        echo "  quick  - 5 minute smoke test (default)"
        echo "  full   - 67 minute full load test"
        echo ""
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Load test completed successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
