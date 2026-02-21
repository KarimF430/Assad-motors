import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"real-scraping-test-{int(time.time())}"

print("🌐 REAL WEB SCRAPING TEST")
print("="*60)

# Question that requires web data
q1 = "What is the waiting period for Creta in Mumbai?"
print(f"\n1️⃣  User: '{q1}'")

try:
    start_time = time.time()
    r1 = requests.post(base_url, json={
        "message": q1,
        "sessionId": session_id,
        "conversationHistory": []
    }, timeout=60).json()
    duration = time.time() - start_time
    
    print(f"   🤖 AI ({duration:.1f}s): {r1['reply']}")
    
    # Check if response mentions real news or fallback
    if "Google News" in str(r1) or "waiting period" in r1['reply'].lower():
        print("   ✅  AI likely used web data!")
    else:
        print("   ⚠️  AI might be using fallback or failed to scrape.")

except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
