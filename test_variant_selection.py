import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"variant-test-{int(time.time())}"

print("🕵️‍♂️ LIVE VARIANT SELECTION TEST")
print("="*60)

# 1. Ask for cars (Broad)
q1 = "15 lakhs SUV petrol"
print(f"\n1️⃣  User: '{q1}'")
r1 = requests.post(base_url, json={
    "message": q1,
    "sessionId": session_id,
    "conversationHistory": []
}, timeout=20).json()

cars = r1.get('cars', [])
print(f"   Found {len(cars)} cars.")
for car in cars:
    print(f"   - {car.get('brand')} {car.get('name')} {car.get('variant')} (₹{car.get('price')/100000}L)")

# Verification
passed = False
if len(cars) > 0 and 'variant' in cars[0]:
    passed = True
    print("   ✅ PASS: Returned specific variants!")
else:
    print("   ❌ FAIL: Did not return specific variants.")

# 2. Ask for specific feature (Sunroof)
q2 = "Which one has panoramic sunroof?"
print(f"\n2️⃣  User: '{q2}'")
history = [
    {"role": "user", "content": q1},
    {"role": "ai", "content": r1['reply'], "cars": cars, "conversationState": r1.get('conversationState')}
]

r2 = requests.post(base_url, json={
    "message": q2,
    "sessionId": session_id,
    "conversationHistory": history
}, timeout=20).json()

print(f"   🤖 AI: {r2['reply'][:150]}...")

print("\n" + "="*60)
