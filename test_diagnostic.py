"""
Quick diagnostic to check backend processing
"""

import requests
import json

base_url = "http://localhost:5001/api/ai-chat"

# Build a proper conversation
history = [
    {"role": "user", "content": "5 seater SUV 15 lakhs city"},
    {
        "role": "ai",
        "content": "Great! Here are some cars",
        "cars": [
            {"id": "1", "brand": "Hyundai", "name": "Creta", "price": 1050000},
            {"id": "2", "brand": "Kia", "name": "Seltos", "price": 1090000}
        ],
        "conversationState": {"stage": "results", "collectedInfo": {"budget": 15, "seating": 5, "usage": "city"}}
    }
]

print("📤 Sending request with cars in history...")
print(f"   Cars in history: {len(history[1]['cars'])}")

response = requests.post(base_url, json={
    "message": "what about mileage",
    "sessionId": "diagnostic",
    "conversationHistory": history
}, timeout=20).json()

print(f"\n📥 Response:")
print(f"   {response['reply']}")

print(f"\n🔍 Analysis:")
if 'kmpl' in response['reply'] or 'mileage' in response['reply'].lower():
    print("   ✅ SUCCESS! Got mileage data!")
else:
    print("   ❌ FAIL: Generic response")
    print("\n   Possible issues:")
    print("   1. Backend not finding cars in history")
    print("   2. isFollowUpQuestion() returning false")
    print("   3. handleComplexQuestion() not being called")
    print("\n   Check backend terminal for debug logs!")
