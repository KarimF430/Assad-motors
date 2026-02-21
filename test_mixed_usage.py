import requests
import json
import time

base_url = "http://localhost:5001/api/ai-chat"
session_id = f"mixed-test-{int(time.time())}"

print("🕵️‍♂️ MIXED USAGE LOOP TEST")
print("="*60)

# 1. Budget
q1 = "10 lakhs"
print(f"\n1️⃣  User: '{q1}'")
r1 = requests.post(base_url, json={
    "message": q1,
    "sessionId": session_id,
    "conversationHistory": []
}, timeout=20).json()
print(f"   🤖 AI: {r1['reply']}")

# 2. Seating
q2 = "3"
print(f"\n2️⃣  User: '{q2}'")
history = [{"role": "user", "content": q1}, {"role": "ai", "content": r1['reply']}]
r2 = requests.post(base_url, json={
    "message": q2,
    "sessionId": session_id,
    "conversationHistory": history
}, timeout=20).json()
print(f"   🤖 AI: {r2['reply']}")

# 3. Usage (The Problem Step)
q3 = "mixed"
print(f"\n3️⃣  User: '{q3}'")
history.extend([{"role": "user", "content": q2}, {"role": "ai", "content": r2['reply']}])
r3 = requests.post(base_url, json={
    "message": q3,
    "sessionId": session_id,
    "conversationHistory": history
}, timeout=20).json()
print(f"   🤖 AI: {r3['reply']}")

# Verification
if "Where will you mostly drive" in r3['reply']:
    print("\n❌ FAIL: AI is stuck in loop asking about usage.")
else:
    print("\n✅ PASS: AI moved forward (likely asking about fuel or results).")

print("\n" + "="*60)
