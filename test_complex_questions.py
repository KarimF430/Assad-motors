"""
Advanced AI Testing - Complex Indian Car Buyer Questions
Tests insurance, safety, reliability, loans, and non-car questions
"""

import requests
import json
import time
from datetime import datetime

base_url = "http://localhost:5001/api/ai-chat"

# Complex real-world questions Indian car buyers ask
COMPLEX_QUESTIONS = [
    # Insurance questions
    "What will be the insurance cost?",
    "Which insurance company is best for cars?",
    "How to reduce insurance premium?",
    "Is zero depreciation worth it?",
    "What's covered in comprehensive insurance?",
    
    # Safety questions
    "Is it safe for my family?",
    "How many airbags does it have?",
    "What's the NCAP rating?",
    "Does it have ABS and ESP?",
    "Is it safe in accidents?",
    
    # Reliability questions
    "Is it reliable for 10 years?",
    "What are common problems?",
    "Does it break down often?",
    "How's Hyundai's reliability?",
    "Will it last long?",
    
    # Maintenance questions
    "What's the maintenance cost?",
    "How expensive are spare parts?",
    "Service cost per year?",
    "Is service network good?",
    "How often does it need service?",
    
    # Resale value questions
    "What's the resale value after 5 years?",
    "Does it hold value well?",
    "Easy to sell later?",
    "Which car has better resale?",
    "Depreciation rate?",
    
    # Loan/Finance questions
    "What will be the EMI?",
    "How much down payment needed?",
    "Which bank gives best car loan?",
    "Interest rate for car loans?",
    "Can I get 100% finance?",
    
    # Ownership experience
    "What do owners say?",
    "Any complaints from owners?",
    "Real-world mileage?",
    "Common issues reported?",
    "Owner satisfaction rating?",
    
    # Comparison questions
    "Creta vs Seltos - which is better?",
    "What's the difference between them?",
    "Which has better features?",
    "Which is more reliable?",
    "Which should I buy?",
    
    # Mileage questions
    "What's the mileage?",
    "Real-world fuel efficiency?",
    "City vs highway mileage?",
    "Is diesel better for mileage?",
    "Running cost per month?",
    
    # Features questions
    "Does it have sunroof?",
    "What features does it have?",
    "Is touchscreen good?",
    "Does it have wireless charging?",
    "360 camera available?",
    
    # Non-car questions (should handle gracefully)
    "What's the weather today?",
    "Tell me a joke",
    "Who won the cricket match?",
    "What's 2+2?",
    "How are you?",
]

def test_complex_conversation():
    """Test a realistic complex conversation"""
    
    print("🧪 ADVANCED AI TESTING - Complex Questions")
    print("="*80)
    print(f"Started at: {datetime.now().strftime('%H:%M:%S')}\n")
    
    conversation_history = []
    session_id = "complex-test"
    
    # Realistic conversation with complex questions
    conversation = [
        "hello",
        "I need a family SUV",
        "5 people",
        "15 lakhs budget",
        "city driving in Mumbai",
        # Now complex follow-up questions
        "What's the mileage?",
        "Is it safe?",
        "What will be the insurance cost?",
        "How's the maintenance cost?",
        "What's the resale value?",
        "Creta vs Seltos?",
        "Which is more reliable?",
        "What do owners say?",
        "Any common problems?",
        "What will be the EMI?",
        "Does it have sunroof?",
        "Is service network good?",
        "Should I buy Creta?",
        "Tell me about warranty",
        "Final recommendation?",
    ]
    
    results = []
    
    for i, message in enumerate(conversation, 1):
        try:
            print(f"\n[{i}/20] 👤 User: {message}")
            
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
            has_cars = 'cars' in data and len(data['cars']) > 0
            
            print(f"         🤖 AI: {ai_reply[:200]}...")
            if has_cars:
                print(f"         🚗 Cars: {len(data['cars'])} recommendations")
            
            # Add to history
            conversation_history.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            conversation_history.append({
                "role": "ai",
                "content": ai_reply,
                "cars": data.get('cars'),
                "conversationState": data.get('conversationState'),
                "timestamp": datetime.now().isoformat()
            })
            
            # Analyze quality
            quality = analyze_complex_response(message, ai_reply, i > 5)
            results.append({
                "message": message,
                "reply": ai_reply,
                "quality": quality,
                "has_cars": has_cars,
                "is_follow_up": i > 5
            })
            
            time.sleep(1)
            
        except Exception as e:
            print(f"         ❌ ERROR: {str(e)}")
            results.append({
                "message": message,
                "reply": f"ERROR: {str(e)}",
                "quality": 0,
                "has_cars": False
            })
    
    # Analysis
    print(f"\n{'='*80}")
    print("📊 RESULTS ANALYSIS")
    print(f"{'='*80}\n")
    
    total = len(results)
    follow_ups = [r for r in results if r.get('is_follow_up')]
    
    avg_quality = sum(r['quality'] for r in results) / total
    follow_up_quality = sum(r['quality'] for r in follow_ups) / len(follow_ups) if follow_ups else 0
    
    print(f"Total messages: {total}")
    print(f"Follow-up questions: {len(follow_ups)}")
    print(f"Overall quality: {avg_quality:.1f}/10")
    print(f"Follow-up quality: {follow_up_quality:.1f}/10\n")
    
    # Category breakdown
    print("📋 Follow-up Question Performance:\n")
    for r in follow_ups:
        status = "✅" if r['quality'] >= 7 else "⚠️" if r['quality'] >= 5 else "❌"
        print(f"{status} {r['message']}")
        print(f"   Quality: {r['quality']}/10")
        print(f"   Response: {r['reply'][:100]}...\n")
    
    # Save report
    with open('complex_test_report.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total': total,
                'follow_ups': len(follow_ups),
                'avg_quality': avg_quality,
                'follow_up_quality': follow_up_quality
            },
            'conversation': results
        }, f, indent=2)
    
    print(f"\n✅ Report saved to: complex_test_report.json")
    print(f"{'='*80}\n")

def analyze_complex_response(question, response, is_follow_up):
    """Analyze quality of complex question responses"""
    score = 5
    
    lowerQ = question.lower()
    lowerR = response.lower()
    
    # Length check
    if 50 <= len(response) <= 500:
        score += 1
    
    # Specific data check
    if is_follow_up:
        # Check for specific information
        if any(word in lowerR for word in ['₹', 'lakh', 'kmpl', '%', 'year']):
            score += 2  # Has specific data
        
        # Check for structured response
        if '•' in response or '-' in response or '\n' in response:
            score += 1  # Well formatted
        
        # Check for actionable info
        if any(word in lowerR for word in ['tip', 'recommend', 'suggest', 'should']):
            score += 1
    
    # Engagement check
    if '?' in response:
        score += 0.5
    
    return min(10, score)

if __name__ == "__main__":
    test_complex_conversation()
