import requests
import json

base_url = "http://localhost:5001/api/ai-chat"
session_id = "full-flow-test"
conversation_history = []

print("🧪 TESTING: Full Recommendation Flow")
print("="*70)

messages = [
    "hello",
    "suggest me a car",
    "10 lakhs",
    "5",
    "city"
]

for i, msg in enumerate(messages, 1):
    print(f"\n{i}. 👤 User: '{msg}'")
    
    try:
        response = requests.post(base_url, json={
            "message": msg,
            "sessionId": session_id,
            "conversationHistory": conversation_history
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        cars = response.get('cars', [])
        
        print(f"   🤖 AI: {reply}")
        
        if cars:
            print(f"   🚗 Cars: {len(cars)} shown!")
            for car in cars:
                print(f"      - {car.get('brand')} {car.get('name')} - ₹{car.get('price', 0)/100000:.1f}L")
        
        # Add to conversation history
        conversation_history.append({
            "role": "user",
            "content": msg
        })
        conversation_history.append({
            "role": "ai",
            "content": reply
        })
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        break

print("\n" + "="*70)
