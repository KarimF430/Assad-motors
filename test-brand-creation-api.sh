#!/bin/bash

# Test Brand Creation API

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        Brand Creation API Test${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}Step 1: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@motoroctane.com","password":"Admin@123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed!${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Create a brand
echo -e "${YELLOW}Step 2: Creating brand 'Honda'...${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/brands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Honda",
    "status": "active",
    "summary": "Honda is a Japanese automotive manufacturer known for reliability and innovation.",
    "faqs": [
      {
        "question": "What are the upcoming cars from Honda?",
        "answer": "Honda is expected to launch Honda WR-V and Honda Odyssey."
      }
    ]
  }')

echo "Response: $CREATE_RESPONSE"
echo ""

# Check if creation was successful
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ Brand created successfully!${NC}"
  
  # Extract brand ID
  BRAND_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo -e "${GREEN}Brand ID: $BRAND_ID${NC}"
  echo ""
  
  # Step 3: Verify by fetching all brands
  echo -e "${YELLOW}Step 3: Verifying - Fetching all brands...${NC}"
  ALL_BRANDS=$(curl -s http://localhost:5001/api/brands)
  echo "$ALL_BRANDS" | python3 -c "import sys, json; brands = json.load(sys.stdin); print(f'Total brands: {len(brands)}'); [print(f\"  - {b['name']} (ID: {b['id']}, Ranking: {b['ranking']})\") for b in brands]"
  echo ""
  
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  
elif echo "$CREATE_RESPONSE" | grep -q '"error"'; then
  echo -e "${RED}❌ Brand creation failed!${NC}"
  ERROR_MSG=$(echo "$CREATE_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo -e "${RED}Error: $ERROR_MSG${NC}"
  echo ""
  
  echo -e "${YELLOW}Troubleshooting:${NC}"
  echo "1. Make sure the backend server is running: cd backend && npm run dev"
  echo "2. Check if the server has picked up the latest code changes"
  echo "3. Try restarting the backend server"
  echo ""
  exit 1
else
  echo -e "${RED}❌ Unexpected response!${NC}"
  exit 1
fi
