#!/bin/bash

# Comprehensive Performance Test for All Pages
# Tests all optimized endpoints to verify CarWale-like performance

echo "========================================"
echo "  COMPREHENSIVE PERFORMANCE TEST"
echo "========================================"
echo ""

BACKEND_URL="http://localhost:5001"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local max_time="$3"
    
    echo "Testing: $name"
    
    # Get response time and size
    response=$(curl -s -w "\n%{time_total}|%{size_download}" -o /tmp/test_response.json "$url")
    time=$(echo "$response" | tail -1 | cut -d'|' -f1)
    size=$(echo "$response" | tail -1 | cut -d'|' -f2)
    
    # Convert time to milliseconds for comparison
    time_ms=$(echo "$time * 1000" | bc)
    max_ms=$(echo "$max_time * 1000" | bc)
    
    # Check if time is within limit
    if (( $(echo "$time_ms < $max_ms" | bc -l) )); then
        echo -e "  ${GREEN}✓${NC} Time: ${time}s (target: <${max_time}s)"
        echo -e "  ${GREEN}✓${NC} Size: ${size} bytes"
        ((PASS++))
    else
        echo -e "  ${RED}✗${NC} Time: ${time}s (target: <${max_time}s) - TOO SLOW"
        echo -e "  ${YELLOW}!${NC} Size: ${size} bytes"
        ((FAIL++))
    fi
    echo ""
}

echo "📊 Testing Core Endpoints..."
echo "----------------------------"
echo ""

# 1. Brands
test_endpoint "1. Brands List" \
    "$BACKEND_URL/api/brands" \
    0.1

# 2. Models with Pricing (Home Page)
test_endpoint "2. Models with Pricing (Home Page)" \
    "$BACKEND_URL/api/models-with-pricing" \
    0.5

# 3. Models with Pricing - Filtered by Brand (Brand Page)
test_endpoint "3. Models with Pricing - Brand Filter (Brand Page)" \
    "$BACKEND_URL/api/models-with-pricing?brandId=brand-hyundai" \
    0.5

# 4. Variants - Full Fields (for comparison)
test_endpoint "4. Variants - FULL Fields (Creta)" \
    "$BACKEND_URL/api/variants?modelId=model-brand-hyundai-creta" \
    0.5

# 5. Variants - Minimal Fields (Model Page)
test_endpoint "5. Variants - MINIMAL Fields (Model Page)" \
    "$BACKEND_URL/api/variants?modelId=model-brand-hyundai-creta&fields=minimal" \
    0.2

# 6. All Variants - Minimal (Price Breakup Page)
test_endpoint "6. All Variants - MINIMAL (Price Breakup)" \
    "$BACKEND_URL/api/variants?fields=minimal" \
    1.5

echo "========================================"
echo "  DATA TRANSFER COMPARISON"
echo "========================================"
echo ""

# Get sizes for comparison
full_size=$(curl -s "$BACKEND_URL/api/variants?modelId=model-brand-hyundai-creta" | wc -c | tr -d ' ')
minimal_size=$(curl -s "$BACKEND_URL/api/variants?modelId=model-brand-hyundai-creta&fields=minimal" | wc -c | tr -d ' ')

# Calculate reduction
reduction=$(echo "scale=1; (1 - $minimal_size / $full_size) * 100" | bc)

echo "Creta Variants (52 variants):"
echo "  Full fields:    $full_size bytes"
echo "  Minimal fields: $minimal_size bytes"
echo -e "  ${GREEN}Reduction: ${reduction}%${NC}"
echo ""

# Verify minimal fields structure
echo "========================================"
echo "  FIELD PROJECTION VERIFICATION"
echo "========================================"
echo ""

echo "Checking minimal endpoint returns only required fields..."
fields=$(curl -s "$BACKEND_URL/api/variants?modelId=model-brand-hyundai-creta&fields=minimal" | \
    python3 -c "import sys, json; data=json.load(sys.stdin); print(list(data[0].keys()) if data else [])" 2>/dev/null)

expected_fields="['id', 'name', 'brandId', 'modelId', 'price', 'transmission', 'fuelType']"

if [ "$fields" = "$expected_fields" ]; then
    echo -e "${GREEN}✓${NC} Correct fields returned: $fields"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Unexpected fields: $fields"
    echo "   Expected: $expected_fields"
    ((FAIL++))
fi

echo ""
echo "========================================"
echo "  TEST SUMMARY"
echo "========================================"
echo ""
echo -e "${GREEN}Passed:${NC} $PASS tests"
echo -e "${RED}Failed:${NC} $FAIL tests"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo "Application has CarWale-like performance!"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo "Review failed tests above"
    exit 1
fi
