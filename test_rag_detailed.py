import requests
import json

print("🔬 DETAILED RAG FLOW TEST")
print("="*60)

base_url = "http://localhost:5001/api/ai-chat"
session_id = "detailed-test-456"

# Test with a question that should trigger RAG
question = "What is the waiting period for Hyundai Creta in Delhi?"

print(f"\n📝 Question: '{question}'")
print("\nSending request...")

try:
    response = requests.post(base_url, json={
        "message": question,
        "sessionId": session_id,
        "conversationHistory": []
    }, timeout=30)
    
    print(f"✅ Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        print("\n📦 Response Data:")
        print(f"   Reply: {data.get('reply', 'No reply')}")
        print(f"   Cars: {len(data.get('cars', []))} cars")
        print(f"   Needs More Info: {data.get('needsMoreInfo', False)}")
        
        # Check conversation state
        if 'conversationState' in data:
            state = data['conversationState']
            print(f"\n🧠 Conversation State:")
            print(f"   Stage: {state.get('stage', 'unknown')}")
            print(f"   Collected Info: {json.dumps(state.get('collectedInfo', {}), indent=6)}")
            print(f"   Confidence: {state.get('confidence', 0)}")
        
        # Analyze the reply
        reply = data.get('reply', '')
        if "I'd be happy to help" in reply or "provide more details" in reply:
            print("\n❌ PROBLEM: Got generic fallback response")
            print("   This means RAG failed or wasn't triggered")
        elif "waiting" in reply.lower() or "period" in reply.lower():
            print("\n✅ SUCCESS: Got relevant response about waiting period!")
        elif "budget" in reply.lower() or "seating" in reply.lower():
            print("\n⚠️  PARTIAL: AI is asking for requirements (consultant mode)")
        else:
            print("\n🤔 UNCLEAR: Got some response, analyzing...")
            print(f"   First 200 chars: {reply[:200]}")
    else:
        print(f"❌ HTTP Error: {response.status_code}")
        print(f"   Response: {response.text[:500]}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
