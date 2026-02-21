import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"indian-user-{int(time.time())}"

print("🇮🇳 THE ULTIMATE INDIAN CAR BUYER SIMULATION (50 Turns)")
print("="*60)

# The 50 Questions Journey
questions = [
    "Hi, I am looking to buy a new car.",
    "My budget is flexible, around 15-18 lakhs.",
    "We are a family of 4, living in Mumbai.",
    "I want an SUV, high ground clearance is needed for potholes.",
    "Mostly city driving, but once a month trip to Lonavala.",
    "So petrol engine preferred.",
    "How is the mileage of Creta in Mumbai traffic?",
    "Is it better than Seltos mileage?",
    "What about safety? I heard Creta has only 3 stars.",
    "Seltos has ADAS, is it actually useful in Indian traffic?",
    "Does ADAS brake suddenly? That scares me.",
    "My dad sits in the back, he has back pain. Which suspension is softer?",
    "Comparison with Grand Vitara Hybrid?",
    "But Hybrid boot space is less, right? Will luggage for 4 fit?",
    "How much is the service cost difference between Hyundai and Maruti?",
    "Resale value after 5 years? I change cars often.",
    "I heard DCT gearbox heats up in bumper-to-bumper traffic. Is that true?",
    "Should I go for IVT/CVT instead for city?",
    "Is IVT rubberband effect very noticeable on highway?",
    "Which one has better AC? Mumbai summers are terrible.",
    "Does Creta have ventilated seats in my budget?",
    "Which variant of Creta fits my 18L budget best?",
    "What features will I miss if I don't take the top model?",
    "Is the Bose sound system worth the extra money?",
    "What about Honda Elevate? Is it good?",
    "Is Honda service expensive compared to Hyundai?",
    "Elevate looks boxy, does it have good road presence?",
    "Compare ground clearance of Creta vs Elevate.",
    "I have a dog, which one has better upholstery durability?",
    "Sunroof is a must for my kids.",
    "Panoramic or normal sunroof in Elevate?",
    "Does Grand Vitara have panoramic?",
    "What is the waiting period for Creta right now?",
    "Can I get a discount if I buy in December?",
    "Calculate EMI for 10 lakhs loan for 5 years.",
    "What interest rate are you assuming?",
    "Is it better to buy now or wait for 2025 models?",
    "Any upcoming facelifts I should know about?",
    "Should I wait for Creta EV?",
    "What is the expected range of Creta EV?",
    "Charging stations in Mumbai are enough?",
    "Back to petrol, what about XUV700? Can I get it in 18L?",
    "Is XUV700 too big for Mumbai traffic?",
    "What is the real world mileage of XUV700 petrol?",
    "That's too low for me.",
    "So between Creta IVT and Grand Vitara Hybrid, pick one for me.",
    "Why did you pick that one?",
    "Give me the top 3 reasons.",
    "Final verdict: Which specific variant should I book tomorrow?",
    "Thanks, that helps."
]

history = []

for i, q in enumerate(questions):
    print(f"\n[{i+1}/50] 👤 User: {q}")
    
    try:
        start_time = time.time()
        response = requests.post(base_url, json={
            "message": q,
            "sessionId": session_id,
            "conversationHistory": history
        }, timeout=45).json()
        duration = time.time() - start_time
        
        reply = response.get('reply', 'Error: No reply')
        cars = response.get('cars', [])
        
        print(f"      🤖 AI ({duration:.1f}s): {reply[:200]}..." if len(reply) > 200 else f"      🤖 AI ({duration:.1f}s): {reply}")
        
        if cars:
            print(f"         🚗 Recommended: {[f'{c['brand']} {c['name']}' for c in cars[:2]]}")

        # Update history
        history.append({"role": "user", "content": q})
        history.append({"role": "ai", "content": reply})
        
        # Small delay to be nice to the server
        time.sleep(0.5)

    except Exception as e:
        print(f"      ❌ Error: {e}")

print("\n" + "="*60)
print("✅ Simulation Complete")
