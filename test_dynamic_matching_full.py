import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"dynamic-test-{int(time.time())}"

print("🧪 TESTING: Dynamic Car Matching (Full Flow)")
print("="*70)

# Step 1: Greeting
print("\n1. 👤 User: 'Hi'")
requests.post(base_url, json={
    "message": "Hi",
    "sessionId": session_id,
    "conversationHistory": []
})

# Step 2: Requirements
question = "suggest me cars under 10 lakhs for city usage"
print(f"\n2. 👤 User: '{question}'")
response = requests.post(base_url, json={
    "message": question,
    "sessionId": session_id,
    "conversationHistory": []
}, timeout=60).json()

print(f"   🤖 AI: {response.get('reply')}")
state = response.get('conversationState', {})

# Step 3: Answer Seating (The critical step)
answer = "4"
print(f"\n3. 👤 User: '{answer}'")

# Construct history correctly
history = [
    {"role": "user", "content": "Hi"},
    {"role": "ai", "content": "Hi! How can I help?", "conversationState": {}},
    {"role": "user", "content": question},
    {"role": "ai", "content": response.get('reply'), "conversationState": state}
]

try:
    response = requests.post(base_url, json={
        "message": answer,
        "sessionId": session_id,
        "conversationHistory": history
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
