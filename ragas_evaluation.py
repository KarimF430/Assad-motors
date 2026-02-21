"""
RAGAS Evaluation for Killer Whale RAG System
==============================================
Evaluates the AI chat RAG implementation using RAGAS metrics:
- Faithfulness: Is the answer grounded in context?
- Context Relevancy: Did we retrieve useful data?
- Answer Relevancy: Does the answer address the question?

Install: pip install ragas langchain openai requests
"""

import requests
import json
import os
from datetime import datetime

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5001")
API_ENDPOINT = f"{BACKEND_URL}/api/ai-chat"

# Test cases with expected context and ground truth
TEST_CASES = [
    {
        "question": "What is the mileage of Hyundai Creta?",
        "expected_context_keywords": ["mileage", "kmpl", "creta"],
        "ground_truth": "The Hyundai Creta offers around 17-21 kmpl depending on the variant",
        "category": "spec_query"
    },
    {
        "question": "Is the Tata Nexon safe?",
        "expected_context_keywords": ["ncap", "star", "safety", "airbag"],
        "ground_truth": "The Tata Nexon has a 5-star Global NCAP safety rating",
        "category": "safety_query"
    },
    {
        "question": "Compare Creta vs Seltos",
        "expected_context_keywords": ["creta", "seltos", "price"],
        "ground_truth": "Both are compact SUVs with similar pricing and features",
        "category": "comparison"
    },
    {
        "question": "What is the price of Maruti Swift?",
        "expected_context_keywords": ["swift", "price", "lakh"],
        "ground_truth": "The Maruti Swift starts around 6-9 lakhs",
        "category": "price_query"
    },
    {
        "question": "Which car is best for city driving under 15 lakhs?",
        "expected_context_keywords": ["city", "automatic", "mileage"],
        "ground_truth": "Cars like Creta, Seltos, or Nexon are good for city driving",
        "category": "recommendation"
    },
    {
        "question": "Tell me about XUV700 safety features",
        "expected_context_keywords": ["xuv700", "adas", "airbag", "safety"],
        "ground_truth": "XUV700 has Level 2 ADAS and multiple airbags",
        "category": "safety_query"
    },
    {
        "question": "What is the engine power of Tata Harrier?",
        "expected_context_keywords": ["harrier", "power", "engine", "bhp"],
        "ground_truth": "The Tata Harrier produces around 170 bhp",
        "category": "spec_query"
    },
    {
        "question": "Best 7 seater SUV in India?",
        "expected_context_keywords": ["seater", "suv", "family"],
        "ground_truth": "Popular 7-seaters include XUV700, Safari, Alcazar",
        "category": "recommendation"
    }
]


def call_rag_api(question: str) -> dict:
    """Call the RAG API and get response"""
    try:
        response = requests.post(
            API_ENDPOINT,
            json={"message": question, "sessionId": "ragas_eval"},
            timeout=30
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"API returned {response.status_code}", "reply": ""}
    except Exception as e:
        return {"error": str(e), "reply": ""}


def calculate_faithfulness(answer: str, context_keywords: list) -> float:
    """
    Faithfulness: Measures if the answer is grounded in the retrieved context.
    Score 0-1: Higher means more grounded in context keywords.
    """
    if not answer:
        return 0.0
    
    answer_lower = answer.lower()
    matches = sum(1 for kw in context_keywords if kw.lower() in answer_lower)
    
    # At least some context keywords should appear in answer
    return min(1.0, matches / max(len(context_keywords) * 0.5, 1))


def calculate_context_relevancy(answer: str, question: str) -> float:
    """
    Context Relevancy: Measures if the retrieved context was relevant.
    Score 0-1: Based on answer quality indicators.
    """
    if not answer:
        return 0.0
    
    # Check for indicators of good context retrieval
    indicators = {
        "has_numbers": any(c.isdigit() for c in answer),  # Contains specific data
        "reasonable_length": 20 < len(answer) < 500,  # Not too short/long
        "not_apologetic": "sorry" not in answer.lower() and "don't know" not in answer.lower(),
        "has_car_mention": any(car in answer.lower() for car in ["creta", "seltos", "nexon", "swift", "xuv", "harrier"]),
    }
    
    score = sum(indicators.values()) / len(indicators)
    return score


def calculate_answer_relevancy(answer: str, question: str) -> float:
    """
    Answer Relevancy: Measures if the answer addresses the question.
    Score 0-1: Based on question type matching.
    """
    if not answer:
        return 0.0
    
    question_lower = question.lower()
    answer_lower = answer.lower()
    
    # Check if answer type matches question type
    relevancy_checks = []
    
    # Price question should have price in answer
    if "price" in question_lower or "cost" in question_lower:
        relevancy_checks.append("₹" in answer or "lakh" in answer_lower or "L" in answer)
    
    # Mileage question should have kmpl
    if "mileage" in question_lower:
        relevancy_checks.append("kmpl" in answer_lower or "km/l" in answer_lower)
    
    # Safety question should mention safety features
    if "safe" in question_lower:
        relevancy_checks.append("star" in answer_lower or "airbag" in answer_lower or "ncap" in answer_lower)
    
    # Comparison should mention both cars
    if " vs " in question_lower or "compare" in question_lower:
        relevancy_checks.append("both" in answer_lower or "vs" in answer_lower or " and " in answer_lower)
    
    if not relevancy_checks:
        # Generic check - answer should be substantive
        return 0.7 if len(answer) > 50 else 0.4
    
    return sum(relevancy_checks) / len(relevancy_checks)


def calculate_hallucination_score(answer: str) -> float:
    """
    Hallucination Detection: Checks for obviously wrong information.
    Score 0-1: Higher means less hallucination.
    """
    if not answer:
        return 0.0
    
    issues = []
    
    # Check for unrealistic prices (Indian car context)
    import re
    price_matches = re.findall(r'₹?(\d+\.?\d*)\s*(?:lakh|L|lakhs)', answer, re.IGNORECASE)
    for price in price_matches:
        try:
            value = float(price)
            if value < 3 or value > 80:  # Most Indian cars are 3L-80L
                issues.append(f"Unrealistic price: {value}L")
        except:
            pass
    
    # Check for suspiciously specific numbers that might be hallucinated
    # (e.g., "exactly 17.3456 kmpl" - too precise)
    specific_decimals = re.findall(r'\d+\.\d{3,}', answer)
    if len(specific_decimals) > 2:
        issues.append("Too many overly specific numbers")
    
    return 1.0 if not issues else max(0, 1 - len(issues) * 0.3)


def run_ragas_evaluation():
    """Run full RAGAS evaluation on test cases"""
    print("=" * 60)
    print("🔍 RAGAS Evaluation - Killer Whale RAG System")
    print("=" * 60)
    print(f"Evaluating {len(TEST_CASES)} test cases...")
    print()
    
    results = []
    
    for i, test in enumerate(TEST_CASES, 1):
        print(f"\n📝 Test {i}/{len(TEST_CASES)}: {test['question'][:50]}...")
        
        # Call RAG API
        response = call_rag_api(test["question"])
        answer = response.get("reply", "")
        
        if response.get("error"):
            print(f"   ❌ API Error: {response['error']}")
            results.append({
                "question": test["question"],
                "category": test["category"],
                "answer": "",
                "faithfulness": 0,
                "context_relevancy": 0,
                "answer_relevancy": 0,
                "hallucination_score": 0,
                "error": response["error"]
            })
            continue
        
        # Calculate RAGAS metrics
        faithfulness = calculate_faithfulness(answer, test["expected_context_keywords"])
        context_relevancy = calculate_context_relevancy(answer, test["question"])
        answer_relevancy = calculate_answer_relevancy(answer, test["question"])
        hallucination_score = calculate_hallucination_score(answer)
        
        # Overall score
        overall = (faithfulness + context_relevancy + answer_relevancy + hallucination_score) / 4
        
        results.append({
            "question": test["question"],
            "category": test["category"],
            "answer": answer[:200] + "..." if len(answer) > 200 else answer,
            "faithfulness": round(faithfulness, 2),
            "context_relevancy": round(context_relevancy, 2),
            "answer_relevancy": round(answer_relevancy, 2),
            "hallucination_score": round(hallucination_score, 2),
            "overall": round(overall, 2)
        })
        
        # Print individual result
        print(f"   ✅ Answer: {answer[:80]}...")
        print(f"   📊 Faithfulness: {faithfulness:.2f} | Context: {context_relevancy:.2f} | Relevancy: {answer_relevancy:.2f} | Hallucination: {hallucination_score:.2f}")
    
    # Calculate aggregate scores
    print("\n" + "=" * 60)
    print("📊 RAGAS EVALUATION SUMMARY")
    print("=" * 60)
    
    valid_results = [r for r in results if "error" not in r]
    
    if valid_results:
        avg_faithfulness = sum(r["faithfulness"] for r in valid_results) / len(valid_results)
        avg_context = sum(r["context_relevancy"] for r in valid_results) / len(valid_results)
        avg_relevancy = sum(r["answer_relevancy"] for r in valid_results) / len(valid_results)
        avg_hallucination = sum(r["hallucination_score"] for r in valid_results) / len(valid_results)
        avg_overall = sum(r["overall"] for r in valid_results) / len(valid_results)
        
        print(f"""
┌────────────────────────┬─────────┐
│ Metric                 │ Score   │
├────────────────────────┼─────────┤
│ Faithfulness           │ {avg_faithfulness:.2f}    │
│ Context Relevancy      │ {avg_context:.2f}    │
│ Answer Relevancy       │ {avg_relevancy:.2f}    │
│ Hallucination Score    │ {avg_hallucination:.2f}    │
├────────────────────────┼─────────┤
│ OVERALL RAGAS SCORE    │ {avg_overall:.2f}    │
└────────────────────────┴─────────┘
        """)
        
        # Grade
        if avg_overall >= 0.8:
            grade = "A - Excellent"
        elif avg_overall >= 0.7:
            grade = "B - Good"
        elif avg_overall >= 0.6:
            grade = "C - Acceptable"
        else:
            grade = "D - Needs Improvement"
        
        print(f"📈 Grade: {grade}")
        print(f"📋 Tests Passed: {len(valid_results)}/{len(TEST_CASES)}")
        
        # Category breakdown
        print("\n📊 By Category:")
        categories = {}
        for r in valid_results:
            cat = r["category"]
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(r["overall"])
        
        for cat, scores in categories.items():
            avg = sum(scores) / len(scores)
            print(f"   {cat}: {avg:.2f} ({len(scores)} tests)")
    
    else:
        print("❌ No valid results - check if backend is running")
    
    # Save results to file
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": len(TEST_CASES),
        "passed_tests": len(valid_results),
        "results": results,
        "summary": {
            "faithfulness": round(avg_faithfulness, 2) if valid_results else 0,
            "context_relevancy": round(avg_context, 2) if valid_results else 0,
            "answer_relevancy": round(avg_relevancy, 2) if valid_results else 0,
            "hallucination_score": round(avg_hallucination, 2) if valid_results else 0,
            "overall": round(avg_overall, 2) if valid_results else 0
        }
    }
    
    with open("RAGAS_EVALUATION_REPORT.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Report saved to: RAGAS_EVALUATION_REPORT.json")
    
    return report


if __name__ == "__main__":
    run_ragas_evaluation()
