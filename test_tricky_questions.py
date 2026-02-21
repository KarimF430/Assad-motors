import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 TRICKY QUESTIONS TEST - LLM Intent Classification")
print("="*70)

# Tricky questions that mix query and recommendation keywords
tricky_questions = [
    {
        "question": "Can you suggest upcoming Tata cars under 15 lakhs?",
        "expected_intent": "query",
        "reason": "User wants INFO about upcoming cars (not asking AI to suggest based on requirements)"
    },
    {
        "question": "What are the best cars under 10 lakhs?",
        "expected_intent": "query",
        "reason": "User wants a LIST/INFO, not personalized recommendation"
    },
    {
        "question": "Suggest me a car for city driving",
        "expected_intent": "recommendation",
        "reason": "User wants AI to suggest based on their requirement (city driving)"
    },
    {
        "question": "Tell me about upcoming launches in India",
        "expected_intent": "query",
        "reason": "User wants information about launches"
    },
    {
        "question": "Which car should I buy for my family?",
        "expected_intent": "recommendation",
        "reason": "User wants personalized suggestion"
    },
    {
        "question": "Can you suggest the mileage of Creta?",
        "expected_intent": "query",
        "reason": "'Suggest' here means 'tell me', not 'recommend a car'"
    },
    {
        "question": "What is the best mileage car?",
        "expected_intent": "query",
        "reason": "Asking for information, not personalized recommendation"
    },
    {
        "question": "Help me find a reliable SUV",
        "expected_intent": "recommendation",
        "reason": "User wants AI to help find/suggest based on requirement (reliable SUV)"
    },
    {
        "question": "Show me cars with good safety ratings",
        "expected_intent": "query",
        "reason": "User wants to SEE/KNOW cars with good safety, not get personalized suggestions"
    },
    {
        "question": "I want to buy a car, help me",
        "expected_intent": "recommendation",
        "reason": "User wants personalized help in buying"
    },
    {
        "question": "What are the problems in Seltos?",
        "expected_intent": "query",
        "reason": "User wants information about problems"
    },
    {
        "question": "Suggest me upcoming electric cars",
        "expected_intent": "query",
        "reason": "'Suggest' means 'tell me about', wants info on upcoming EVs"
    },
    {
        "question": "Which is better: Creta or Seltos?",
        "expected_intent": "query",
        "reason": "Comparison question, wants information"
    },
    {
        "question": "Find me a car under 20 lakhs",
        "expected_intent": "recommendation",
        "reason": "User wants AI to find/suggest based on budget"
    },
    {
        "question": "What's the waiting period for Nexon?",
        "expected_intent": "query",
        "reason": "User wants specific information"
    }
]

correct = 0
total = len(tricky_questions)

for i, test in enumerate(tricky_questions, 1):
    session_id = f"tricky-test-{i}-{int(time.time())}"
    
    print(f"\n{i}. 👤 User: '{test['question']}'")
    print(f"   Expected Intent: {test['expected_intent'].upper()}")
    print(f"   Reason: {test['reason']}")
    
    try:
        response = requests.post(base_url, json={
            "message": test['question'],
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        
        # Detect actual behavior
        is_asking_questions = any(keyword in reply.lower() for keyword in [
            'how many people', 'where will you', 'what\'s your budget',
            'seating', 'usage'
        ]) and '?' in reply
        
        has_info = any(keyword in reply.lower() for keyword in [
            'based on', 'according', 'news', 'rating', 'mileage', 
            'safety', 'problem', 'issue', 'waiting', 'launch'
        ]) or len(reply) > 100
        
        # Determine actual intent
        if is_asking_questions:
            actual_intent = "recommendation"
        elif has_info:
            actual_intent = "query"
        else:
            actual_intent = "unclear"
        
        # Check if correct
        is_correct = actual_intent == test['expected_intent']
        
        if is_correct:
            correct += 1
            print(f"   ✅ CORRECT: AI treated as {actual_intent.upper()}")
        else:
            print(f"   ❌ WRONG: AI treated as {actual_intent.upper()} (expected {test['expected_intent'].upper()})")
        
        print(f"   Reply: {reply[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    time.sleep(0.5)  # Small delay to avoid rate limits

print("\n" + "="*70)
print(f"📊 RESULTS: {correct}/{total} correct ({int(correct/total*100)}%)")
print("="*70)

if correct == total:
    print("🎉 PERFECT! AI correctly classified ALL tricky questions!")
elif correct >= total * 0.8:
    print("✅ GOOD! AI correctly classified most questions (80%+)")
elif correct >= total * 0.6:
    print("⚠️  OKAY: AI needs improvement (60-80% accuracy)")
else:
    print("❌ NEEDS WORK: AI is struggling with intent classification (<60%)")
