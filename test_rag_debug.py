import requests
import json

print("🔍 RAG SYSTEM DEBUG TEST")
print("="*60)

# Test 1: Direct scraping endpoint (if exists)
print("\n1️⃣ Testing Google News RSS directly...")
try:
    import urllib.parse
    query = urllib.parse.quote("Hyundai Creta India car review problems waiting period")
    url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml'
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    print(f"   Status: {response.status_code}")
    print(f"   Content-Type: {response.headers.get('Content-Type')}")
    print(f"   Content Length: {len(response.text)} bytes")
    
    if response.status_code == 200:
        # Check if it's valid XML
        if '<rss' in response.text or '<feed' in response.text:
            print("   ✅ Valid RSS/XML received")
            # Count items
            item_count = response.text.count('<item>')
            print(f"   Found {item_count} news items")
        else:
            print("   ⚠️ Response is not valid RSS/XML")
            print(f"   First 200 chars: {response.text[:200]}")
    else:
        print(f"   ❌ Failed with status {response.status_code}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: AI Chat with detailed logging
print("\n2️⃣ Testing AI Chat endpoint...")
base_url = "http://localhost:5001/api/ai-chat"
session_id = "debug-test-123"

questions = [
    "What is the waiting period for Creta?",
    "How reliable is the Hyundai Creta?",
    "I want a car under 15 lakhs"
]

for i, q in enumerate(questions, 1):
    print(f"\n   Question {i}: '{q}'")
    try:
        response = requests.post(base_url, json={
            "message": q,
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            reply = data.get('reply', 'No reply')
            print(f"   Reply: {reply[:100]}...")
            
            # Check if it's the fallback message
            if "I'd be happy to help" in reply or "provide more details" in reply:
                print("   ⚠️ Got fallback response (RAG might have failed)")
            else:
                print("   ✅ Got meaningful response")
                
        else:
            print(f"   ❌ HTTP {response.status_code}: {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "="*60)
print("✅ Debug test complete")
