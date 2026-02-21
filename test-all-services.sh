#!/bin/bash

# MotorOctane Complete System Test
# Tests Frontend, Backend, and Database connectivity

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:5001}"
MONGODB_URI="${MONGODB_URI:-mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority}"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        MotorOctane Complete System Test${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${CYAN}🧪 Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ -n "$expected_result" ]; then
            if eval "$test_command" | grep -q "$expected_result"; then
                echo -e "${GREEN}✅ PASS: $test_name${NC}"
                TESTS_PASSED=$((TESTS_PASSED + 1))
            else
                echo -e "${RED}❌ FAIL: $test_name (unexpected result)${NC}"
                TESTS_FAILED=$((TESTS_FAILED + 1))
            fi
        else
            echo -e "${GREEN}✅ PASS: $test_name${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        fi
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to test HTTP endpoint
test_http() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${CYAN}🧪 Testing: $name${NC}"
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS: $name (HTTP $status_code)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $name (HTTP $status_code, expected $expected_status)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to test API endpoint with JSON response
test_api() {
    local name="$1"
    local url="$2"
    local expected_field="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${CYAN}🧪 Testing: $name${NC}"
    
    local response=$(curl -s "$url" 2>/dev/null || echo "{}")
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "200" ]; then
        if [ -n "$expected_field" ]; then
            if echo "$response" | grep -q "$expected_field"; then
                echo -e "${GREEN}✅ PASS: $name (HTTP 200, contains '$expected_field')${NC}"
                TESTS_PASSED=$((TESTS_PASSED + 1))
            else
                echo -e "${RED}❌ FAIL: $name (HTTP 200, but missing '$expected_field')${NC}"
                echo -e "${YELLOW}   Response: $(echo "$response" | head -c 100)...${NC}"
                TESTS_FAILED=$((TESTS_FAILED + 1))
            fi
        else
            echo -e "${GREEN}✅ PASS: $name (HTTP 200)${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        fi
    else
        echo -e "${RED}❌ FAIL: $name (HTTP $status_code)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo -e "${YELLOW}🔍 Phase 1: Environment & Dependencies Check${NC}"
echo ""

# Check Node.js
run_test "Node.js Installation" "node --version"

# Check npm
run_test "npm Installation" "npm --version"

# Check if project dependencies are installed
run_test "Frontend Dependencies" "test -d node_modules"
run_test "Backend Dependencies" "test -d backend/node_modules"

echo ""
echo -e "${YELLOW}🔍 Phase 2: Database Connectivity${NC}"
echo ""

# Test MongoDB connection using Node.js
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${CYAN}🧪 Testing: MongoDB Connection${NC}"

# Test MongoDB connection by checking if we can get data from the API
brands_response=$(curl -s "$BACKEND_URL/api/brands" 2>/dev/null || echo "[]")
if echo "$brands_response" | grep -q '"id"'; then
    echo -e "${GREEN}✅ PASS: MongoDB Connection (API returns data)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: MongoDB Connection (no data returned)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${YELLOW}🔍 Phase 3: Backend Service Tests${NC}"
echo ""

# Check if backend is running
test_http "Backend Health Check" "$BACKEND_URL/api/stats"

# Test API endpoints
test_api "Brands API" "$BACKEND_URL/api/brands" "id"
test_api "Models API" "$BACKEND_URL/api/models" "id"
test_api "Popular Comparisons API" "$BACKEND_URL/api/popular-comparisons"

# Test authentication endpoint (should return error without credentials)
test_http "Auth Endpoint Accessibility" "$BACKEND_URL/api/auth/me" "401"

echo ""
echo -e "${YELLOW}🔍 Phase 4: Frontend Service Tests${NC}"
echo ""

# Test frontend
test_http "Frontend Home Page" "$FRONTEND_URL"

# Test if Next.js is serving properly (check for Next.js specific content)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${CYAN}🧪 Testing: Frontend Framework (Next.js)${NC}"
frontend_content=$(curl -s "$FRONTEND_URL" 2>/dev/null || echo "")
if echo "$frontend_content" | grep -q -i "next\|react\|__next"; then
    echo -e "${GREEN}✅ PASS: Frontend Framework (Next.js detected)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Frontend Framework (Next.js not detected)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${YELLOW}🔍 Phase 5: Authentication Flow Test${NC}"
echo ""

# Test login with valid credentials
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${CYAN}🧪 Testing: Authentication Login${NC}"

login_response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@motoroctane.com","password":"Admin@123"}' 2>/dev/null || echo "{}")

if echo "$login_response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ PASS: Authentication Login${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Extract token for further tests
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        # Test authenticated endpoint
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        echo -e "${CYAN}🧪 Testing: Authenticated API Access${NC}"
        
        auth_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/auth/me" 2>/dev/null || echo "{}")
        
        if echo "$auth_response" | grep -q '"success":true'; then
            echo -e "${GREEN}✅ PASS: Authenticated API Access${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL: Authenticated API Access${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    fi
else
    echo -e "${RED}❌ FAIL: Authentication Login${NC}"
    echo -e "${YELLOW}   Response: $(echo "$login_response" | head -c 100)...${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${YELLOW}🔍 Phase 6: Data Integrity Tests${NC}"
echo ""

# Test if we can fetch data and it has expected structure
test_api "Brands Data Structure" "$BACKEND_URL/api/brands" '"name"'
test_api "Models Data Structure" "$BACKEND_URL/api/models" '"brandId"'

echo ""
echo -e "${YELLOW}🔍 Phase 7: File Upload Test${NC}"
echo ""

# Test file upload endpoint (POST without file should return 400)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${CYAN}🧪 Testing: File Upload Endpoint${NC}"

upload_response=$(curl -s -X POST "$BACKEND_URL/api/upload/logo" 2>/dev/null || echo "{}")
upload_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/upload/logo" 2>/dev/null || echo "000")

if [ "$upload_status" = "400" ]; then
    echo -e "${GREEN}✅ PASS: File Upload Endpoint (HTTP 400 - no file provided)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: File Upload Endpoint (HTTP $upload_status, expected 400)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    TEST RESULTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}Total Tests: $TOTAL_TESTS${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your system is working correctly.${NC}"
    echo ""
    echo -e "${YELLOW}✅ Frontend: Running and accessible${NC}"
    echo -e "${YELLOW}✅ Backend: Running and responding to API calls${NC}"
    echo -e "${YELLOW}✅ Database: Connected and accessible${NC}"
    echo -e "${YELLOW}✅ Authentication: Working correctly${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED! Please check the issues above.${NC}"
    echo ""
    echo -e "${YELLOW}Common fixes:${NC}"
    echo -e "${YELLOW}• Make sure both frontend and backend are running${NC}"
    echo -e "${YELLOW}• Check MongoDB connection in .env file${NC}"
    echo -e "${YELLOW}• Verify all dependencies are installed${NC}"
    echo ""
    exit 1
fi

