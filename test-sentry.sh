#!/bin/bash

# Quick Sentry Test Script
# Tests if Sentry is properly configured and receiving events

echo "🧪 Testing Sentry Configuration..."
echo ""

# Test Backend Sentry
echo "1️⃣ Testing Backend Sentry..."
curl -X POST http://localhost:5001/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{"test": true}' \
  2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Backend Sentry endpoint accessible"
else
  echo "⚠️  Backend might not be running on port 5001"
fi

echo ""
echo "2️⃣ Testing Frontend Sentry..."
echo "   Open http://localhost:3000 in your browser"
echo "   Check browser console for: '✅ Sentry client initialized'"

echo ""
echo "3️⃣ Verify in Sentry Dashboard:"
echo "   🔗 https://sentry.io/organizations/your-org/issues/"
echo ""
echo "   You should see test events within 1-2 minutes"
echo ""

echo "✅ Test complete! Check your Sentry dashboard for events."
