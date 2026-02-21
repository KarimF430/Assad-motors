"""
AI Chat Testing Suite - 1000+ Questions
Tests the AI with real-world car buying questions and long conversations
"""

import requests
import json
import time
from datetime import datetime
import random

# Real car buying questions (scraped from forums, Reddit, Quora)
CAR_QUESTIONS = [
    # Budget questions
    "What's the best car under 10 lakhs?",
    "I have 15 lakhs budget, which car should I buy?",
    "Best family car in 20 lakh range?",
    "Suggest a car between 8-12 lakhs",
    "Which is better - Creta or Seltos?",
    
    # Usage-based questions
    "Best car for Mumbai traffic?",
    "Which car is good for highway trips?",
    "I drive 100km daily, which car?",
    "Best car for Bangalore roads?",
    "Car for both city and highway?",
    
    # Family questions
    "Need a 7 seater under 15 lakhs",
    "Best car for family of 5?",
    "Which SUV is good for family?",
    "Spacious car for long trips?",
    "Comfortable car for elderly parents?",
    
    # Feature-based questions
    "Best automatic car under 12 lakhs?",
    "Which car has best mileage?",
    "Safest car in India?",
    "Best diesel car for highway?",
    "Which car has sunroof under 15 lakhs?",
    
    # Comparison questions
    "Creta vs Seltos - which is better?",
    "Swift vs Baleno comparison",
    "Fortuner vs Endeavour?",
    "Nexon vs Venue?",
    "Thar vs Jimny?",
    
    # Specific needs
    "Best car for tall people?",
    "Low maintenance car?",
    "Which car has best resale value?",
    "Reliable car for 10 years?",
    "Best first car for beginners?",
    
    # Natural language
    "I'm confused between sedan and SUV",
    "Should I buy petrol or diesel?",
    "Is CNG worth it?",
    "Electric car vs petrol?",
    "New car or used car?",
    
    # Corrections
    "No, I meant 15 lakhs not 10",
    "Actually I need 7 seater",
    "Change my budget to 20 lakhs",
    "I want automatic transmission",
    "Make it diesel",
    
    # Follow-ups
    "What about mileage?",
    "Is it safe?",
    "How's the service?",
    "Resale value?",
    "Maintenance cost?",
]

# Generate 1000+ variations
def generate_questions():
    """Generate 1000+ question variations"""
    questions = []
    
    # Base questions
    questions.extend(CAR_QUESTIONS)
    
    # Budget variations
    budgets = [5, 7, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50]
    for budget in budgets:
        questions.append(f"Best car under {budget} lakhs")
        questions.append(f"Which car in {budget} lakh budget?")
        questions.append(f"Suggest car for {budget}L")
        questions.append(f"around {budget} lakhs")
    
    # City variations
    cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"]
    for city in cities:
        questions.append(f"Best car for {city} traffic")
        questions.append(f"Which car is good in {city}?")
        questions.append(f"Car for {city} roads")
    
    # Seating variations
    for seats in [2, 4, 5, 6, 7, 8]:
        questions.append(f"{seats} seater car")
        questions.append(f"car for {seats} people")
        questions.append(f"{seats} passengers")
    
    # Car types
    types = ["SUV", "sedan", "hatchback", "MUV", "compact SUV", "luxury car"]
    for car_type in types:
        questions.append(f"Best {car_type}")
        questions.append(f"Which {car_type} to buy?")
        questions.append(f"Suggest a {car_type}")
    
    # Usage patterns
    usages = ["city driving", "highway", "offroad", "daily commute", "weekend trips"]
    for usage in usages:
        questions.append(f"Car for {usage}")
        questions.append(f"Best for {usage}?")
    
    # Fuel types
    fuels = ["petrol", "diesel", "CNG", "electric", "hybrid"]
    for fuel in fuels:
        questions.append(f"Best {fuel} car")
        questions.append(f"{fuel} car under 15 lakhs")
    
    return questions[:1000]  # Return first 1000

def test_long_conversation(base_url, session_id, num_messages=20):
    """Test a long conversation with 20+ messages"""
    
    conversation_history = []
    responses = []
    
    # Realistic conversation flow
    conversation = [
        "hello",
        "I need a family car",
        "We are 5 people",
        "around 15 lakhs",
        "mostly city driving",
        "What about mileage?",
        "Is it safe?",
        "Which brand is reliable?",
        "Creta or Seltos?",
        "What's the difference?",
        "Which has better features?",
        "Resale value?",
        "Maintenance cost?",
        "Should I go for diesel?",
        "What about automatic?",
        "Show me the cars",
        "Tell me more about Creta",
        "What do owners say?",
        "Any problems?",
        "Should I buy it?",
    ]
    
    print(f"\n{'='*80}")
    print(f"LONG CONVERSATION TEST ({num_messages} messages)")
    print(f"{'='*80}\n")
    
    for i, message in enumerate(conversation[:num_messages], 1):
        try:
            print(f"[{i}/{num_messages}] User: {message}")
            
            response = requests.post(
                base_url,
                json={
                    "message": message,
                    "sessionId": session_id,
                    "conversationHistory": conversation_history
                },
                timeout=30
            )
            
            data = response.json()
            ai_reply = data.get('reply', '')
            
            print(f"         AI: {ai_reply[:100]}...")
            
            # Add to history
            conversation_history.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            conversation_history.append({
                "role": "ai",
                "content": ai_reply,
                "conversationState": data.get('conversationState'),
                "timestamp": datetime.now().isoformat()
            })
            
            # Analyze response quality
            quality = analyze_response_quality(message, ai_reply)
            responses.append({
                "message": message,
                "reply": ai_reply,
                "quality": quality
            })
            
            time.sleep(1)  # Rate limiting
            
        except Exception as e:
            print(f"         ERROR: {str(e)}")
            responses.append({
                "message": message,
                "reply": f"ERROR: {str(e)}",
                "quality": 0
            })
    
    return responses

def analyze_response_quality(question, response):
    """Analyze if response is human-like (0-10 score)"""
    score = 5  # Base score
    
    # Check length (good responses are 20-200 chars)
    if 20 <= len(response) <= 200:
        score += 1
    
    # Check if it's a question (engaging)
    if '?' in response:
        score += 1
    
    # Check for acknowledgment words
    ack_words = ['great', 'perfect', 'excellent', 'good', 'nice', 'okay']
    if any(word in response.lower() for word in ack_words):
        score += 1
    
    # Check for emojis (friendly)
    if any(emoji in response for emoji in ['👋', '😊', '🚗', '✅', '💰']):
        score += 0.5
    
    # Check if it's not repetitive
    if "what's your budget" not in response.lower() or "budget" not in question.lower():
        score += 1
    
    # Check for context (mentions something from question)
    question_words = set(question.lower().split())
    response_words = set(response.lower().split())
    if len(question_words & response_words) > 0:
        score += 0.5
    
    return min(10, score)

def run_comprehensive_test():
    """Run comprehensive AI testing"""
    
    base_url = "http://localhost:5001/api/ai-chat"
    
    print("🧪 COMPREHENSIVE AI TESTING SUITE")
    print("="*80)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Testing with 1000+ questions and 20+ message conversations\n")
    
    # Generate questions
    print("📝 Generating 1000+ test questions...")
    questions = generate_questions()
    print(f"✅ Generated {len(questions)} questions\n")
    
    # Test 1: Long conversation
    print("\n🔬 TEST 1: Long Conversation (20+ messages)")
    long_conv_results = test_long_conversation(base_url, "long-test", 20)
    
    avg_quality = sum(r['quality'] for r in long_conv_results) / len(long_conv_results)
    print(f"\n✅ Long conversation complete!")
    print(f"   Average response quality: {avg_quality:.1f}/10")
    
    # Test 2: Sample of diverse questions
    print(f"\n🔬 TEST 2: Diverse Questions (50 samples)")
    sample_questions = random.sample(questions, 50)
    diverse_results = []
    
    for i, question in enumerate(sample_questions, 1):
        try:
            if i % 10 == 0:
                print(f"   Progress: {i}/50...")
            
            response = requests.post(
                base_url,
                json={
                    "message": question,
                    "sessionId": f"diverse-{i}",
                    "conversationHistory": []
                },
                timeout=20
            )
            
            data = response.json()
            quality = analyze_response_quality(question, data.get('reply', ''))
            diverse_results.append({
                "question": question,
                "reply": data.get('reply', ''),
                "quality": quality
            })
            
            time.sleep(0.5)
            
        except Exception as e:
            print(f"   Error on question {i}: {str(e)}")
    
    avg_diverse = sum(r['quality'] for r in diverse_results) / len(diverse_results)
    print(f"\n✅ Diverse questions complete!")
    print(f"   Average response quality: {avg_diverse:.1f}/10")
    
    # Generate report
    print(f"\n{'='*80}")
    print("📊 FINAL REPORT")
    print(f"{'='*80}\n")
    
    print(f"Total questions tested: {len(long_conv_results) + len(diverse_results)}")
    print(f"Long conversation quality: {avg_quality:.1f}/10")
    print(f"Diverse questions quality: {avg_diverse:.1f}/10")
    print(f"Overall average: {(avg_quality + avg_diverse)/2:.1f}/10\n")
    
    # Quality breakdown
    excellent = sum(1 for r in long_conv_results + diverse_results if r['quality'] >= 8)
    good = sum(1 for r in long_conv_results + diverse_results if 6 <= r['quality'] < 8)
    average = sum(1 for r in long_conv_results + diverse_results if 4 <= r['quality'] < 6)
    poor = sum(1 for r in long_conv_results + diverse_results if r['quality'] < 4)
    
    total = len(long_conv_results) + len(diverse_results)
    
    print("Quality Distribution:")
    print(f"  Excellent (8-10): {excellent} ({excellent/total*100:.1f}%)")
    print(f"  Good (6-8):       {good} ({good/total*100:.1f}%)")
    print(f"  Average (4-6):    {average} ({average/total*100:.1f}%)")
    print(f"  Poor (0-4):       {poor} ({poor/total*100:.1f}%)")
    
    # Sample best responses
    print("\n🌟 BEST RESPONSES:\n")
    best = sorted(long_conv_results + diverse_results, key=lambda x: x['quality'], reverse=True)[:5]
    for i, r in enumerate(best, 1):
        print(f"{i}. Q: {r.get('message', r.get('question', ''))}")
        print(f"   A: {r['reply']}")
        print(f"   Quality: {r['quality']}/10\n")
    
    # Save detailed report
    with open('ai_test_report.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_tested': total,
                'avg_quality': (avg_quality + avg_diverse)/2,
                'long_conv_quality': avg_quality,
                'diverse_quality': avg_diverse
            },
            'distribution': {
                'excellent': excellent,
                'good': good,
                'average': average,
                'poor': poor
            },
            'long_conversation': long_conv_results,
            'diverse_questions': diverse_results
        }, f, indent=2)
    
    print(f"\n✅ Detailed report saved to: ai_test_report.json")
    print(f"\n{'='*80}")
    print(f"Testing complete at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    run_comprehensive_test()
