import requests
import json

print("🧪 TESTING: 'Can you suggest upcoming Tata cars under 15 lakhs'")
print("="*70)

base_url = "http://localhost:5001/api/ai-chat"
session_id = "upcoming-test-123"

question = "Can you suggest upcoming Tata cars under 15 lakhs"

print(f"\n👤 User: '{question}'")
print("\n🔍 Expected Behavior:")
print("   - AI should classify this as a QUERY (not recommendation)")
print("   - AI should answer with information about upcoming Tata cars")
print("   - AI should NOT ask for seating/usage")

try:
    response = requests.post(base_url, json={
        "message": question,
        "sessionId": session_id,
        "conversationHistory": []
    }, timeout=30).json()
    
    reply = response.get('reply', '')
    cars = response.get('cars', [])
    
    print(f"\n🤖 AI Response:")
    print(f"   {reply}")
    
    # Check if AI is asking questions (wrong behavior)
    is_asking_questions = any(keyword in reply.lower() for keyword in [
        'how many people', 'where will you', 'what\'s your budget',
        'seating', 'usage', 'drive'
    ]) and '?' in reply
    
    # Check if AI answered with information
    has_info = any(keyword in reply.lower() for keyword in [
        'upcoming', 'launch', 'tata', 'news', 'based on', 'according'
    ])
    
    print(f"\n📊 Analysis:")
    if is_asking_questions:
        print("   ❌ WRONG: AI is asking for requirements (treated as recommendation)")
        print("   The AI should have answered with info about upcoming Tata cars")
    elif has_info:
        print("   ✅ CORRECT: AI answered with information (treated as query)")
    else:
        print("   ⚠️  UNCLEAR: Check the response above")
        
    if cars and len(cars) > 0:
        print(f"   📋 Cars shown: {len(cars)}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "="*70)
