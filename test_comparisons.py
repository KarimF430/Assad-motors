import requests
import json

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 TESTING: Database-Driven Car Comparison")
print("="*70)

test_questions = [
    "which is better creta or seltos",
    "compare nexon and punch",
    "creta vs seltos"
]

for i, question in enumerate(test_questions, 1):
    print(f"\n{i}. 👤 User: '{question}'")
    
    try:
        response = requests.post(base_url, json={
            "message": question,
            "sessionId": f"compare-test-{i}",
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        
        print(f"   🤖 AI: {reply[:200]}...")
        
        # Check if it's a proper comparison (not article dump)
        if any(word in reply.lower() for word in ['price', 'mileage', 'fuel', 'transmission', '₹']):
            print(f"   ✅ GOOD: Database comparison with specs")
        elif "based on recent news" in reply.lower():
            print(f"   ⚠️  FALLBACK: Using news articles")
        else:
            print(f"   ❓ UNCLEAR: Check response above")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "="*70)
