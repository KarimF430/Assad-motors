import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"dynamic-test-{int(time.time())}"

print("🧪 TESTING: Dynamic Car Matching (LLM Brain)")
print("="*70)

# Step 1: Send greeting
print("\n1. 👤 User: 'Hi'")
requests.post(base_url, json={
    "message": "Hi",
    "sessionId": session_id,
    "conversationHistory": []
})

# Step 2: Send requirements (10 lakhs, city)
# This previously returned 0 cars because of hardcoded logic
question = "suggest me cars under 10 lakhs for city usage"
print(f"\n2. 👤 User: '{question}'")

try:
    response = requests.post(base_url, json={
        "message": question,
        "sessionId": session_id,
        "conversationHistory": []
    }, timeout=60).json()
    
    reply = response.get('reply', '')
    cars = response.get('cars', [])
    
    print(f"\n🤖 AI Response:")
    print(f"   {reply}")
    
    if cars and len(cars) > 0:
        print(f"\n✅ SUCCESS: Found {len(cars)} cars!")
        for car in cars:
            print(f"   - {car['brand']} {car['name']} {car['variant']} (₹{car['price']})")
            print(f"     Match Score: {car.get('matchScore', 'N/A')}")
            print(f"     Reasons: {car.get('reasons', [])}")
    else:
        print("\n❌ FAILURE: No cars found.")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "="*70)
