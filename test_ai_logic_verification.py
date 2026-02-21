import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 AI LOGIC VERIFICATION TEST")
print("="*70)
print("\nTesting the rule:")
print("1. QUERIES → Answer from web/database directly")
print("2. RECOMMENDATIONS → Ask questions to narrow down")
print("="*70)

# ============================================
# SCENARIO 1: QUERIES (Should answer directly)
# ============================================
print("\n" + "="*70)
print("📊 SCENARIO 1: USER ASKS QUERIES (Should answer from web/DB)")
print("="*70)

queries = [
    {
        "question": "How is the Creta reliability?",
        "expected": "Should answer with reliability info from web/reviews"
    },
    {
        "question": "What is the mileage of Seltos?",
        "expected": "Should answer with mileage data from database"
    },
    {
        "question": "Is Creta safe?",
        "expected": "Should answer with safety ratings from database"
    },
    {
        "question": "What are the common problems in Creta?",
        "expected": "Should answer with issues from web/reviews"
    }
]

for i, test in enumerate(queries, 1):
    session_id = f"query-test-{i}-{int(time.time())}"
    print(f"\n{i}. 👤 User: '{test['question']}'")
    print(f"   Expected: {test['expected']}")
    
    try:
        response = requests.post(base_url, json={
            "message": test['question'],
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        
        # Check if AI answered directly (not asking for requirements)
        is_asking_requirements = any(keyword in reply.lower() for keyword in [
            'what\'s your budget', 'how many people', 'where will you drive',
            'what kind of car', 'tell me more about'
        ])
        
        is_direct_answer = any(keyword in reply.lower() for keyword in [
            'mileage', 'reliable', 'safety', 'rating', 'problem', 'issue',
            'owner', 'review', 'feedback', 'based on', 'according to'
        ])
        
        if is_direct_answer and not is_asking_requirements:
            print(f"   ✅ CORRECT: AI answered directly")
            print(f"   Reply: {reply[:150]}...")
        elif is_asking_requirements:
            print(f"   ❌ WRONG: AI is asking for requirements instead of answering")
            print(f"   Reply: {reply[:150]}...")
        else:
            print(f"   ⚠️  UNCLEAR: Check response")
            print(f"   Reply: {reply[:150]}...")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

# ============================================
# SCENARIO 2: RECOMMENDATIONS (Should ask questions)
# ============================================
print("\n" + "="*70)
print("🎯 SCENARIO 2: USER WANTS RECOMMENDATIONS (Should ask questions)")
print("="*70)

recommendations = [
    {
        "question": "Which is the best car under 15 lakhs?",
        "expected": "Should ask: budget confirmed, now ask seating/usage"
    },
    {
        "question": "I want to buy a car",
        "expected": "Should ask: What's your budget?"
    },
    {
        "question": "Suggest me a good SUV",
        "expected": "Should ask: What's your budget?"
    },
    {
        "question": "Help me find a car for my family",
        "expected": "Should ask: What's your budget? or How many people?"
    }
]

for i, test in enumerate(recommendations, 1):
    session_id = f"recommendation-test-{i}-{int(time.time())}"
    print(f"\n{i}. 👤 User: '{test['question']}'")
    print(f"   Expected: {test['expected']}")
    
    try:
        response = requests.post(base_url, json={
            "message": test['question'],
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        
        # Check if AI is asking for requirements
        is_asking_budget = 'budget' in reply.lower() and '?' in reply
        is_asking_seating = any(word in reply.lower() for word in ['how many', 'people', 'seating']) and '?' in reply
        is_asking_usage = any(word in reply.lower() for word in ['drive', 'city', 'highway', 'usage']) and '?' in reply
        
        is_asking_requirements = is_asking_budget or is_asking_seating or is_asking_usage
        
        # Check if AI gave direct recommendations (wrong for this scenario)
        gave_recommendations = 'cars' in response and response['cars'] and len(response['cars']) > 0
        
        if is_asking_requirements and not gave_recommendations:
            print(f"   ✅ CORRECT: AI is asking questions to narrow down")
            print(f"   Reply: {reply[:150]}...")
        elif gave_recommendations:
            print(f"   ❌ WRONG: AI gave recommendations without asking questions")
            print(f"   Reply: {reply[:150]}...")
            print(f"   Cars: {len(response['cars'])} cars shown")
        else:
            print(f"   ⚠️  UNCLEAR: Check response")
            print(f"   Reply: {reply[:150]}...")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

# ============================================
# SCENARIO 3: MULTI-TURN RECOMMENDATION FLOW
# ============================================
print("\n" + "="*70)
print("🔄 SCENARIO 3: COMPLETE RECOMMENDATION FLOW")
print("="*70)

session_id = f"flow-test-{int(time.time())}"
conversation = []

flow_steps = [
    {"user": "I want a car under 15 lakhs", "expect": "Should ask for seating or usage"},
    {"user": "For my family of 4", "expect": "Should ask for usage"},
    {"user": "Mostly city driving", "expect": "Should show car recommendations with variants"}
]

print("\nStarting conversation flow...")
for i, step in enumerate(flow_steps, 1):
    print(f"\n{i}. 👤 User: '{step['user']}'")
    print(f"   Expected: {step['expect']}")
    
    try:
        response = requests.post(base_url, json={
            "message": step['user'],
            "sessionId": session_id,
            "conversationHistory": conversation
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        cars = response.get('cars', [])
        conversation_state = response.get('conversationState', {})
        
        # Update conversation history with conversationState
        conversation.append({"role": "user", "content": step['user']})
        conversation.append({
            "role": "ai", 
            "content": reply, 
            "cars": cars,
            "conversationState": conversation_state  # Include state!
        })
        
        print(f"   🤖 AI: {reply[:150]}...")
        
        if i < len(flow_steps):  # Not the last step
            if '?' in reply:
                print(f"   ✅ AI is asking a question (correct)")
            else:
                print(f"   ⚠️  AI didn't ask a question")
        else:  # Last step
            if cars and len(cars) > 0:
                print(f"   ✅ AI showed {len(cars)} car recommendations")
                # Check if variants are mentioned
                if any('variant' in reply.lower() or car.get('name') for car in cars):
                    print(f"   ✅ Recommendations include specific variants")
                else:
                    print(f"   ⚠️  Variants might not be specific")
            else:
                print(f"   ❌ AI didn't show recommendations")
                
    except Exception as e:
        print(f"   ❌ Error: {e}")
        break

print("\n" + "="*70)
print("✅ VERIFICATION TEST COMPLETE")
print("="*70)
