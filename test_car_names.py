import requests
import json

base_url = "http://localhost:5001/api/ai-chat"

print("🧪 TESTING: Car Name Recognition (Honda Amaze, City, etc.)")
print("="*70)

test_cases = [
    {
        "q": "honda amaze or city?",
        "expected": "query",
        "description": "Comparison between two cars"
    },
    {
        "q": "honda amaze",
        "expected": "query",
        "description": "Asking about Honda Amaze"
    },
    {
        "q": "city car",
        "expected": "query",
        "description": "Asking about Honda City (should NOT extract 'city' as usage)"
    },
    {
        "q": "tell me about creta",
        "expected": "query",
        "description": "Asking about Creta"
    },
    {
        "q": "i need a car for city driving",
        "expected": "recommendation",
        "description": "Generic need (should extract 'city' as usage)"
    },
    {
        "q": "suggest me a family car",
        "expected": "recommendation",
        "description": "Clear recommendation request"
    }
]

passed = 0
failed = 0

for i, test in enumerate(test_cases, 1):
    question = test['q']
    expected = test['expected']
    description = test['description']
    
    print(f"\n{i}. 👤 User: '{question}'")
    print(f"   📝 Test: {description}")
    print(f"   🎯 Expected: {expected.upper()}")
    
    try:
        response = requests.post(base_url, json={
            "message": question,
            "sessionId": f"car-name-test-{i}",
            "conversationHistory": []
        }, timeout=30).json()
        
        reply = response.get('reply', '')
        cars = response.get('cars', [])
        needs_more_info = response.get('needsMoreInfo', False)
        
        # Determine actual behavior
        if cars and len(cars) > 0:
            actual = "recommendation"
            result = f"Showed {len(cars)} cars"
        elif needs_more_info or any(keyword in reply.lower() for keyword in ['budget', 'seating', 'how many']):
            actual = "recommendation"
            result = "Asking for requirements"
        else:
            actual = "query"
            result = reply[:80] + "..." if len(reply) > 80 else reply
        
        print(f"   🤖 AI: {result}")
        
        # Check if correct
        if actual == expected:
            print(f"   ✅ PASS")
            passed += 1
        else:
            print(f"   ❌ FAIL (Got {actual.upper()})")
            failed += 1
            
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
        failed += 1

print("\n" + "="*70)
print(f"\n📊 RESULTS:")
print(f"   ✅ Passed: {passed}/{len(test_cases)}")
print(f"   ❌ Failed: {failed}/{len(test_cases)}")

if passed == len(test_cases):
    print(f"\n🎉 PERFECT! All tests passed!")
elif passed >= len(test_cases) * 0.8:
    print(f"\n👍 GOOD! Most tests passed")
else:
    print(f"\n⚠️  NEEDS IMPROVEMENT")

print("\n" + "="*70)
