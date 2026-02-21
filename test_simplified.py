import requests
import json

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 TESTING: Simplified AI-First Approach")
print("="*70)

test_cases = [
    "hello",
    "hi",
    "honda amaze or city?",
    "suggest me a car",
    "when is tata sierra launching",
    "what's the mileage of creta",
    "best car under 10 lakhs"
]

for i, question in enumerate(test_cases, 1):
    session_id = f"simple-test-{i}"
    
    print(f"\n{i}. 👤 User: '{question}'")
    
    try:
        response = requests.post(base_url, json={
            "message": question,
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        cars = response.get('cars', [])
        
        print(f"   🤖 AI: {reply}")
        
        if cars:
            print(f"   🚗 Cars: {len(cars)} shown")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "="*70)
