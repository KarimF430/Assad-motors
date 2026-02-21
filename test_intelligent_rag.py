import requests
import json

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 TESTING: Intelligent RAG Responses with Groq")
print("="*70)

test_questions = [
    "when is tata sierra launching",
    "what is the mileage of creta",
    "is nexon safe",
    "upcoming mahindra cars"
]

for i, question in enumerate(test_questions, 1):
    session_id = f"rag-test-{i}"
    
    print(f"\n{i}. 👤 User: '{question}'")
    
    try:
        response = requests.post(base_url, json={
            "message": question,
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        
        print(f"   🤖 AI: {reply}")
        
        # Check if it's a proper answer (not raw article dump)
        if "Based on recent news" in reply or "Based on" in reply:
            print(f"   ✅ GOOD: AI synthesized an answer")
        elif "Team-BHP" in reply or "nbsp" in reply:
            print(f"   ❌ BAD: AI dumped raw article text")
        else:
            print(f"   ⚠️  UNCLEAR: Check response above")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "="*70)
