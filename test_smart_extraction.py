import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"smart-test-{int(time.time())}"

print("🧠 SMART AI EXTRACTION TEST")
print("="*60)

# Complex Query
q1 = "I want a car for me and my dog, mostly for city driving but sometimes for hiking trips. Budget is around 15L."
print(f"\n1️⃣  User: '{q1}'")

r1 = requests.post(base_url, json={
    "message": q1,
    "sessionId": session_id,
    "conversationHistory": []
}, timeout=30).json()

print(f"   🤖 AI Reply: {r1['reply']}")
if 'cars' in r1 and len(r1['cars']) > 0:
    print(f"   🚗 Recommended: {len(r1['cars'])} cars")
    for car in r1['cars']:
        print(f"      - {car['brand']} {car['name']} ({car['variant']})")
else:
    print("   ❌ No cars recommended yet (maybe missing info?)")

# Check if it understood usage/budget without asking again
if "budget" in r1['reply'].lower():
    print("   ⚠️  AI asked for budget (Failed to extract 15L)")
elif "drive" in r1['reply'].lower() and "city" not in r1['reply'].lower():
    print("   ⚠️  AI asked for usage (Failed to extract mixed usage)")
else:
    print("   ✅  AI understood requirements!")

print("\n" + "="*60)
