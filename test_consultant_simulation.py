import requests
import json
import time
import uuid

# Configuration
BASE_URL = "http://localhost:5001/api/ai-chat"
SESSION_ID = f"consultant-test-{int(time.time())}"

# The "Expert Consultant" Persona Questions
questions = [
    # --- PHASE 1: The Setup (Technical Requirements) ---
    "I'm looking for a C-segment SUV, petrol, budget 15-20L. Priorities: NVH levels, suspension maturity, and high-speed stability. What fits?",
    
    # --- PHASE 2: Mechanical Deep Dive ---
    "Between Creta and Seltos, specifically the 1.5 Turbo DCT variants, which one has better gearbox calibration for city stop-go traffic?",
    "How does the suspension setup of the Seltos facelift compare to the pre-facelift? Is it still stiff or have they softened the dampers?",
    "I'm concerned about the long-term reliability of the dry DCT gearbox in Indian heat. Any known failures in the 2024 batches?",
    "What is the real-world fuel efficiency delta between the IVT (CVT) and DCT options in this segment?",
    "Does the Creta's steering weigh up sufficiently at highway speeds (100-120 kmph) or is it still lifeless like the previous gen?",
    
    # --- PHASE 3: Interior & Comfort ---
    "Compare the rear seat under-thigh support between Creta and Grand Vitara. Which is better for tall passengers?",
    "How effective is the AC cooling in the Creta with that massive panoramic sunroof? Does it struggle in 45-degree heat?",
    "Is the plastic quality on the Seltos dashboard soft-touch or hard plastic? How does it compare to the VW Taigun?",
    "Does the Seltos Bose sound system have a dedicated subwoofer? How is the bass response compared to Creta's Bose setup?",
    
    # --- PHASE 4: Safety & Build ---
    "Beyond the star rating, tell me about the structural rigidity. Has Hyundai used more high-strength steel in the facelift?",
    "How intrusive is the ADAS in Indian traffic conditions? Can I permanently disable the Lane Keep Assist?",
    "How is the headlight throw on the Creta SX(O) for night highway drives? Is the LED setup adequate or do I need aftermarket upgrades?",
    
    # --- PHASE 5: Financials & Value ---
    "What's the resale value depreciation curve for Kia vs Hyundai after 5 years? Who holds value better?",
    "Calculate the Total Cost of Ownership (TCO) for 5 years, assuming 15k km/year running. Petrol vs Diesel.",
    "Is the service interval 10k or 15k km? And what is the average cost of a major service (40k km)?",
    
    # --- PHASE 6: The "Curveballs" (Tricky Questions) ---
    "I've heard about DPF issues in BS6 Phase 2 diesels. Is it safe to buy a diesel Seltos for 80% city usage?",
    "Why should I buy a Creta over a Scorpio-N if I drive on bad roads? Don't give me generic answers.",
    "Is the paint quality of Kia prone to chipping? I've seen reports of peeling on the bonnet.",
    "Does the 1.5 Turbo engine have any known oil consumption issues like the VW 1.5 TSI?",
    
    # --- PHASE 7: Rapid Fire Specs ---
    "Exact boot space in liters?",
    "Ground clearance unladen?",
    "Fuel tank capacity?",
    "Turning radius?",
    "Tyre profile on the top model?",
    "Does it have wireless Android Auto?",
    "Is the spare wheel an alloy or steel?",
    "Does it have a cooled glovebox?",
    "Are the rear brakes disc or drum?",
    "Is there a heads-up display?",
    
    # --- PHASE 8: Comparison Hell ---
    "Compare Creta vs Elevate on ride quality only.",
    "Compare Seltos vs Kushaq on handling dynamics.",
    "Compare Creta vs Grand Vitara on mileage.",
    "Compare Seltos vs Astor on interior luxury.",
    "Compare Creta vs XUV700 (base) on value.",
    
    # --- PHASE 9: Final Decision Making ---
    "If I prioritize peace of mind and resale, which specific variant should I pick?",
    "If I prioritize driving fun and performance, which specific variant?",
    "Is there a facelift coming in the next 6 months?",
    "Are there any year-end discounts available right now?",
    "Final verdict: Creta SX(O) IVT or Seltos GTX+ DCT? Pick one and tell me why."
]

# Add more generic questions to reach 50+
for i in range(15):
    questions.append(f"Tell me more about feature {i+1} of the Creta.")

print(f"🏎️  STARTING CONSULTANT SIMULATION ({len(questions)} Questions)")
print("="*80)

history = []

for i, q in enumerate(questions, 1):
    print(f"\n[{i}/{len(questions)}] 🗣️  User: {q}")
    
    start_time = time.time()
    try:
        # Simulate Frontend Request Structure
        payload = {
            "message": q,
            "sessionId": SESSION_ID,
            "conversationHistory": history # Frontend sends full history
        }
        
        response = requests.post(BASE_URL, json=payload, timeout=30).json()
        duration = time.time() - start_time
        
        reply = response.get('reply', 'Error: No reply')
        cars = response.get('cars', [])
        
        # Print AI Response (Truncated)
        print(f"🤖 AI ({duration:.2f}s): {reply[:150]}...")
        
        # Update History (Like Frontend does)
        # 1. Add User Message
        user_msg = {
            "id": str(uuid.uuid4()),
            "role": "user",
            "content": q,
            "timestamp": time.time()
        }
        history.append(user_msg)
        
        # 2. Add AI Message
        ai_msg = {
            "id": str(uuid.uuid4()),
            "role": "ai",
            "content": reply,
            "timestamp": time.time(),
            "cars": cars,
            "conversationState": response.get('conversationState')
        }
        history.append(ai_msg)
        
        # Simulate reading time
        time.sleep(0.5)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        break

print("\n" + "="*80)
print("🏁 SIMULATION COMPLETE")
