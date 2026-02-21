import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 COMPREHENSIVE AI TEST - 60 CHALLENGING QUESTIONS")
print("="*80)

# 60 tricky, conversational questions covering all scenarios
test_cases = [
    # === QUERIES (Information Seeking) ===
    {"q": "when is tata sierra launching", "type": "query"},
    {"q": "what's the mileage of creta", "type": "query"},
    {"q": "is nexon safe for family", "type": "query"},
    {"q": "upcoming mahindra cars in 2025", "type": "query"},
    {"q": "tell me about scorpio n safety features", "type": "query"},
    {"q": "how much does fortuner cost", "type": "query"},
    {"q": "what are the problems with thar", "type": "query"},
    {"q": "compare creta vs seltos", "type": "query"},
    {"q": "which is better diesel or petrol for city", "type": "query"},
    {"q": "waiting period for xuv700", "type": "query"},
    
    # === TRICKY QUERIES (Look like recommendations but are queries) ===
    {"q": "can you suggest upcoming tata cars", "type": "query"},
    {"q": "recommend me some news about honda city", "type": "query"},
    {"q": "suggest good features in harrier", "type": "query"},
    {"q": "what do you recommend for highway driving - diesel or petrol", "type": "query"},
    {"q": "which car would you suggest has best safety", "type": "query"},
    
    # === RECOMMENDATIONS (Car Suggestions) ===
    {"q": "suggest me a car", "type": "recommendation"},
    {"q": "help me find a good suv", "type": "recommendation"},
    {"q": "which car should i buy", "type": "recommendation"},
    {"q": "recommend a family car", "type": "recommendation"},
    {"q": "best car under 10 lakhs", "type": "recommendation"},
    {"q": "i need a car for city driving", "type": "recommendation"},
    {"q": "looking for automatic transmission car", "type": "recommendation"},
    {"q": "want to buy 7 seater", "type": "recommendation"},
    {"q": "suggest suv under 15 lakhs", "type": "recommendation"},
    {"q": "help me choose between sedan and suv", "type": "recommendation"},
    
    # === VERY TRICKY (Ambiguous) ===
    {"q": "what about creta", "type": "query"},
    {"q": "tell me more", "type": "query"},
    {"q": "how is it", "type": "query"},
    {"q": "any good options", "type": "recommendation"},
    {"q": "what do you think", "type": "query"},
    {"q": "is it worth it", "type": "query"},
    {"q": "should i go for it", "type": "recommendation"},
    {"q": "what else", "type": "query"},
    
    # === CONVERSATIONAL FOLLOW-UPS ===
    {"q": "what about safety", "type": "query"},
    {"q": "how much does it cost", "type": "query"},
    {"q": "any other options", "type": "recommendation"},
    {"q": "what's the waiting period", "type": "query"},
    {"q": "is there automatic version", "type": "query"},
    {"q": "show me more", "type": "recommendation"},
    
    # === SPECIFIC TECHNICAL QUERIES ===
    {"q": "ground clearance of thar", "type": "query"},
    {"q": "boot space in ertiga", "type": "query"},
    {"q": "does venue have sunroof", "type": "query"},
    {"q": "airbags in punch", "type": "query"},
    {"q": "ncap rating of safari", "type": "query"},
    {"q": "engine power of fortuner", "type": "query"},
    {"q": "fuel tank capacity of innova", "type": "query"},
    
    # === COMPARISON QUERIES ===
    {"q": "creta or seltos which is better", "type": "query"},
    {"q": "nexon vs punch comparison", "type": "query"},
    {"q": "scorpio n vs fortuner", "type": "query"},
    {"q": "which has better mileage - city or verna", "type": "query"},
    {"q": "thar vs jimny off-road capability", "type": "query"},
    
    # === NEWS/LAUNCH QUERIES ===
    {"q": "when is new harrier facelift coming", "type": "query"},
    {"q": "tata curvv launch date", "type": "query"},
    {"q": "upcoming maruti suzuki electric cars", "type": "query"},
    {"q": "new honda elevate price", "type": "query"},
    {"q": "mahindra thar 5 door launch", "type": "query"},
    
    # === BUDGET-SPECIFIC RECOMMENDATIONS ===
    {"q": "best car under 5 lakhs", "type": "recommendation"},
    {"q": "suv under 20 lakhs", "type": "recommendation"},
    {"q": "luxury car under 50 lakhs", "type": "recommendation"},
    {"q": "cheapest 7 seater", "type": "recommendation"},
    {"q": "most affordable automatic car", "type": "recommendation"},
]

passed = 0
failed = 0
session_id = f"comprehensive-test-{int(time.time())}"

for i, test in enumerate(test_cases, 1):
    question = test['q']
    expected_type = test['type']
    
    print(f"\n{i}/60. 👤 User: '{question}'")
    print(f"      Expected: {expected_type.upper()}")
    
    try:
        response = requests.post(base_url, json={
            "message": question,
            "sessionId": session_id,
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        cars = response.get('cars', [])
        needs_more_info = response.get('needsMoreInfo', False)
        
        # Determine actual behavior
        if cars and len(cars) > 0:
            actual_type = "recommendation"
            print(f"      🤖 AI: Showed {len(cars)} cars")
        elif needs_more_info or any(keyword in reply.lower() for keyword in ['budget', 'seating', 'how many', 'what type']):
            actual_type = "recommendation"
            print(f"      🤖 AI: Asking for requirements")
        else:
            actual_type = "query"
            print(f"      🤖 AI: {reply[:100]}...")
        
        # Check if correct
        if actual_type == expected_type:
            print(f"      ✅ PASS")
            passed += 1
        else:
            print(f"      ❌ FAIL (Got {actual_type.upper()})")
            failed += 1
            
    except Exception as e:
        print(f"      ❌ ERROR: {e}")
        failed += 1
    
    # Small delay to avoid rate limiting
    time.sleep(0.5)

print("\n" + "="*80)
print(f"\n📊 RESULTS:")
print(f"   ✅ Passed: {passed}/60 ({passed/60*100:.1f}%)")
print(f"   ❌ Failed: {failed}/60 ({failed/60*100:.1f}%)")

if passed >= 50:
    print(f"\n🎉 EXCELLENT! AI is highly accurate ({passed}/60)")
elif passed >= 40:
    print(f"\n👍 GOOD! AI is performing well ({passed}/60)")
elif passed >= 30:
    print(f"\n⚠️  NEEDS IMPROVEMENT ({passed}/60)")
else:
    print(f"\n❌ POOR PERFORMANCE ({passed}/60)")

print("\n" + "="*80)
