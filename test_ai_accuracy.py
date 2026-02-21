#!/usr/bin/env python3
"""
AI Car Consultant Accuracy Test Suite
=====================================
Tests the AI chat API with 100+ queries to measure accuracy.

Run: python test_ai_accuracy.py
"""

import requests
import json
import time
from dataclasses import dataclass
from typing import List, Optional
from concurrent.futures import ThreadPoolExecutor

# Configuration
API_URL = "http://localhost:5001/api/ai-chat"
TIMEOUT = 30

@dataclass
class TestCase:
    """Single test case for AI evaluation"""
    query: str
    expected_cars: List[str]  # Car names that MUST appear in results
    category: str
    description: str = ""

@dataclass
class TestResult:
    """Result of running a test case"""
    test: TestCase
    passed: bool
    returned_cars: List[str]
    first_car: str
    response_time: float
    error: Optional[str] = None

# ============================================
# TEST CASES (100+ queries)
# ============================================

TEST_CASES = [
    # ==========================================
    # CATEGORY 1: Car Name Recognition (30 tests)
    # ==========================================
    TestCase("tell me about swift", ["Swift"], "car_name", "Basic Swift query"),
    TestCase("maruti swift details", ["Swift"], "car_name", "Swift with brand"),
    TestCase("swift price", ["Swift"], "car_name", "Swift price query"),
    TestCase("info on nexon", ["Nexon"], "car_name", "Nexon query"),
    TestCase("tata nexon features", ["Nexon"], "car_name", "Nexon with brand"),
    TestCase("creta specifications", ["Creta"], "car_name", "Creta specs"),
    TestCase("hyundai creta review", ["Creta"], "car_name", "Creta review"),
    TestCase("seltos details", ["Seltos"], "car_name", "Seltos query"),
    TestCase("venue price in delhi", ["Venue"], "car_name", "Venue query"),
    TestCase("brezza mileage", ["Brezza"], "car_name", "Brezza mileage"),
    TestCase("baleno features", ["Baleno"], "car_name", "Baleno query"),
    TestCase("i20 specifications", ["i20"], "car_name", "i20 query"),
    TestCase("sonet price", ["Sonet"], "car_name", "Sonet query"),
    TestCase("carens details", ["Carens"], "car_name", "Carens query"),
    TestCase("innova crysta price", ["Innova"], "car_name", "Innova query"),
    TestCase("fortuner specs", ["Fortuner"], "car_name", "Fortuner query"),
    TestCase("city sedan", ["City"], "car_name", "City query"),
    TestCase("elevate features", ["Elevate"], "car_name", "Elevate query"),
    TestCase("amaze price", ["Amaze"], "car_name", "Amaze query"),
    TestCase("thar off road", ["Thar"], "car_name", "Thar query"),
    TestCase("scorpio specs", ["Scorpio"], "car_name", "Scorpio query"),
    TestCase("xuv700 features", ["XUV700"], "car_name", "XUV700 query"),
    TestCase("xuv300 price", ["XUV300"], "car_name", "XUV300 query"),
    TestCase("harrier review", ["Harrier"], "car_name", "Harrier query"),
    TestCase("safari details", ["Safari"], "car_name", "Safari query"),
    TestCase("punch specs", ["Punch"], "car_name", "Punch query"),
    TestCase("tiago price", ["Tiago"], "car_name", "Tiago query"),
    TestCase("altroz features", ["Altroz"], "car_name", "Altroz query"),
    TestCase("grand vitara hybrid", ["Grand Vitara"], "car_name", "Grand Vitara query"),
    TestCase("ertiga 7 seater", ["Ertiga"], "car_name", "Ertiga query"),
    
    # ==========================================
    # CATEGORY 2: Comparisons (20 tests)
    # ==========================================
    TestCase("creta vs nexon", ["Creta", "Nexon"], "comparison", "Popular comparison"),
    TestCase("nexon vs creta which is better", ["Creta", "Nexon"], "comparison", "Comparison with question"),
    TestCase("seltos vs creta", ["Seltos", "Creta"], "comparison", "Korean rivals"),
    TestCase("swift vs baleno", ["Swift", "Baleno"], "comparison", "Hatchback comparison"),
    TestCase("brezza vs venue", ["Brezza", "Venue"], "comparison", "Sub-compact SUV"),
    TestCase("xuv700 vs safari", ["XUV700", "Safari"], "comparison", "Premium SUV"),
    TestCase("harrier vs xuv700", ["Harrier", "XUV700"], "comparison", "Tata vs Mahindra"),
    TestCase("i20 vs altroz", ["i20", "Altroz"], "comparison", "Premium hatchback"),
    TestCase("city vs verna", ["City", "Verna"], "comparison", "Sedan comparison"),
    TestCase("fortuner vs endeavour", ["Fortuner"], "comparison", "Full-size SUV"),
    TestCase("thar vs jimny", ["Thar", "Jimny"], "comparison", "Off-roader"),
    TestCase("punch vs exter", ["Punch", "Exter"], "comparison", "Entry SUV"),
    TestCase("sonet vs venue", ["Sonet", "Venue"], "comparison", "Sub-4m SUV"),
    TestCase("scorpio vs thar", ["Scorpio", "Thar"], "comparison", "Mahindra internal"),
    TestCase("innova vs carens", ["Innova", "Carens"], "comparison", "MPV comparison"),
    TestCase("ertiga vs carens", ["Ertiga", "Carens"], "comparison", "7 seater MPV"),
    TestCase("dzire vs aura", ["Dzire", "Aura"], "comparison", "Entry sedan"),
    TestCase("tiago vs swift", ["Tiago", "Swift"], "comparison", "Budget hatchback"),
    TestCase("nexon ev vs punch ev", ["Nexon"], "comparison", "Tata EVs"),
    TestCase("creta vs seltos vs venue", ["Creta", "Seltos", "Venue"], "comparison", "Triple comparison"),
    
    # ==========================================
    # CATEGORY 3: Budget Queries (15 tests)
    # ==========================================
    TestCase("best car under 10 lakh", [], "budget", "Under 10L"),
    TestCase("suv under 15 lakh", [], "budget", "SUV budget"),
    TestCase("cars under 8 lakh", [], "budget", "Under 8L"),
    TestCase("best car under 20 lakh", [], "budget", "Under 20L"),
    TestCase("cheapest suv in india", [], "budget", "Cheapest SUV"),
    TestCase("affordable 7 seater", [], "budget", "Budget 7 seater"),
    TestCase("best car for 12 lakh budget", [], "budget", "12L budget"),
    TestCase("hatchback under 7 lakh", [], "budget", "Budget hatchback"),
    TestCase("sedan under 15 lakh", [], "budget", "Budget sedan"),
    TestCase("automatic car under 10 lakh", [], "budget", "Budget automatic"),
    TestCase("car under 5 lakh", [], "budget", "Under 5L"),
    TestCase("suv between 10 to 15 lakh", [], "budget", "Range query"),
    TestCase("best value for money car", [], "budget", "VFM query"),
    TestCase("affordable family car", [], "budget", "Family budget"),
    TestCase("low maintenance car under 10 lakh", [], "budget", "Maintenance + budget"),
    
    # ==========================================
    # CATEGORY 4: Safety Queries (10 tests)
    # ==========================================
    TestCase("safest car in india", ["Nexon"], "safety", "Safety query"),
    TestCase("5 star safety rating cars", ["Nexon", "Punch"], "safety", "NCAP query"),
    TestCase("safest suv under 15 lakh", ["Nexon"], "safety", "Safe + budget"),
    TestCase("best car for highway driving", [], "safety", "Highway safety"),
    TestCase("cars with airbags", [], "safety", "Airbag query"),
    TestCase("safest hatchback", ["Altroz", "Punch"], "safety", "Safe hatchback"),
    TestCase("tata safety rating", ["Nexon", "Punch", "Altroz"], "safety", "Brand safety"),
    TestCase("adas features car", ["XUV700"], "safety", "ADAS query"),
    TestCase("car with best crash rating", ["Nexon"], "safety", "Crash rating"),
    TestCase("ncap 5 star cars india", ["Nexon", "Punch"], "safety", "NCAP specific"),
    
    # ==========================================
    # CATEGORY 5: Typo Handling (15 tests)
    # ==========================================
    TestCase("creat price", ["Creta"], "typo", "Creta typo"),
    TestCase("nexn features", ["Nexon"], "typo", "Nexon typo"),
    TestCase("swft mileage", ["Swift"], "typo", "Swift typo"),
    TestCase("selto vs creta", ["Seltos", "Creta"], "typo", "Seltos typo"),
    TestCase("brezz details", ["Brezza"], "typo", "Brezza typo"),
    TestCase("balenoo features", ["Baleno"], "typo", "Baleno typo"),
    TestCase("fortunner price", ["Fortuner"], "typo", "Fortuner typo"),
    TestCase("hundai creta", ["Creta"], "typo", "Hyundai typo"),
    TestCase("mahendra xuv700", ["XUV700"], "typo", "Mahindra typo"),
    TestCase("kiya seltos", ["Seltos"], "typo", "Kia typo"),
    TestCase("inoova crysta", ["Innova"], "typo", "Innova typo"),
    TestCase("xv700 price", ["XUV700"], "typo", "XUV700 shortcut"),
    TestCase("scorpeo classic", ["Scorpio"], "typo", "Scorpio typo"),
    TestCase("tata harieer", ["Harrier"], "typo", "Harrier typo"),
    TestCase("alltroz review", ["Altroz"], "typo", "Altroz typo"),
    
    # ==========================================
    # CATEGORY 6: Brand Queries (10 tests)
    # ==========================================
    TestCase("best tata cars", ["Nexon", "Punch", "Harrier", "Safari"], "brand", "Tata brand"),
    TestCase("maruti cars list", ["Swift", "Brezza", "Baleno"], "brand", "Maruti brand"),
    TestCase("hyundai suv options", ["Creta", "Venue", "Alcazar"], "brand", "Hyundai SUVs"),
    TestCase("kia cars in india", ["Seltos", "Sonet", "Carens"], "brand", "Kia brand"),
    TestCase("mahindra suv lineup", ["XUV700", "Thar", "Scorpio"], "brand", "Mahindra SUVs"),
    TestCase("honda cars price", ["City", "Amaze", "Elevate"], "brand", "Honda brand"),
    TestCase("toyota cars india", ["Innova", "Fortuner"], "brand", "Toyota brand"),
    TestCase("best maruti suv", ["Brezza", "Grand Vitara"], "brand", "Maruti SUV"),
    TestCase("tata electric cars", ["Nexon"], "brand", "Tata EV"),
    TestCase("most popular hyundai car", ["Creta"], "brand", "Popular Hyundai"),
]

# ============================================
# TEST RUNNER
# ============================================

def run_test(test: TestCase) -> TestResult:
    """Run a single test case"""
    start_time = time.time()
    
    try:
        response = requests.post(
            API_URL,
            json={"message": test.query, "sessionId": f"test-{hash(test.query)}"},
            timeout=TIMEOUT
        )
        response_time = time.time() - start_time
        
        if response.status_code != 200:
            return TestResult(
                test=test,
                passed=False,
                returned_cars=[],
                first_car="",
                response_time=response_time,
                error=f"HTTP {response.status_code}"
            )
        
        data = response.json()
        cars = data.get("cars", [])
        returned_cars = [car.get("name", "") for car in cars]
        first_car = returned_cars[0] if returned_cars else ""
        
        # Check if expected cars are in results
        if test.expected_cars:
            # For car name tests, first result must match
            if test.category == "car_name":
                expected_lower = [c.lower() for c in test.expected_cars]
                passed = first_car.lower() in expected_lower
            # For comparisons, all expected cars must be in results
            elif test.category == "comparison":
                returned_lower = [c.lower() for c in returned_cars]
                passed = all(exp.lower() in returned_lower for exp in test.expected_cars)
            # For typos, check if any expected car appears
            elif test.category == "typo":
                returned_lower = [c.lower() for c in returned_cars]
                passed = any(exp.lower() in returned_lower for exp in test.expected_cars)
            # For safety/brand, check if at least one expected car appears
            else:
                returned_lower = [c.lower() for c in returned_cars]
                passed = any(exp.lower() in returned_lower for exp in test.expected_cars)
        else:
            # For budget queries, just check we got some results
            passed = len(returned_cars) > 0
        
        return TestResult(
            test=test,
            passed=passed,
            returned_cars=returned_cars[:5],
            first_car=first_car,
            response_time=response_time
        )
        
    except Exception as e:
        return TestResult(
            test=test,
            passed=False,
            returned_cars=[],
            first_car="",
            response_time=time.time() - start_time,
            error=str(e)
        )

def run_all_tests(parallel: bool = False) -> List[TestResult]:
    """Run all test cases"""
    print(f"\n{'='*60}")
    print(f"🧪 AI CAR CONSULTANT ACCURACY TEST")
    print(f"{'='*60}")
    print(f"Total tests: {len(TEST_CASES)}")
    print(f"API URL: {API_URL}")
    print(f"{'='*60}\n")
    
    results = []
    
    if parallel:
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(run_test, TEST_CASES))
    else:
        for i, test in enumerate(TEST_CASES):
            print(f"[{i+1}/{len(TEST_CASES)}] Testing: {test.query[:40]}...", end=" ")
            result = run_test(test)
            status = "✅" if result.passed else "❌"
            print(f"{status} ({result.response_time:.2f}s)")
            results.append(result)
    
    return results

def print_report(results: List[TestResult]):
    """Print detailed test report"""
    
    # Calculate stats by category
    categories = {}
    for result in results:
        cat = result.test.category
        if cat not in categories:
            categories[cat] = {"passed": 0, "failed": 0, "tests": []}
        if result.passed:
            categories[cat]["passed"] += 1
        else:
            categories[cat]["failed"] += 1
        categories[cat]["tests"].append(result)
    
    # Print summary
    total_passed = sum(1 for r in results if r.passed)
    total_failed = len(results) - total_passed
    accuracy = (total_passed / len(results)) * 100
    avg_time = sum(r.response_time for r in results) / len(results)
    
    print(f"\n{'='*60}")
    print(f"📊 TEST RESULTS SUMMARY")
    print(f"{'='*60}")
    print(f"Total:    {len(results)} tests")
    print(f"Passed:   {total_passed} ✅")
    print(f"Failed:   {total_failed} ❌")
    print(f"Accuracy: {accuracy:.1f}%")
    print(f"Avg Time: {avg_time:.2f}s")
    print(f"{'='*60}\n")
    
    # Print by category
    print("📋 RESULTS BY CATEGORY:")
    print("-" * 40)
    for cat, data in categories.items():
        cat_accuracy = (data["passed"] / (data["passed"] + data["failed"])) * 100
        status = "🟢" if cat_accuracy >= 90 else "🟡" if cat_accuracy >= 70 else "🔴"
        print(f"{status} {cat:15} {data['passed']}/{data['passed']+data['failed']} ({cat_accuracy:.0f}%)")
    
    # Print failed tests
    failed = [r for r in results if not r.passed]
    if failed:
        print(f"\n{'='*60}")
        print(f"❌ FAILED TESTS ({len(failed)}):")
        print(f"{'='*60}")
        for r in failed:
            print(f"\nQuery: {r.test.query}")
            print(f"Expected: {r.test.expected_cars}")
            print(f"Got: {r.returned_cars}")
            print(f"First: {r.first_car}")
            if r.error:
                print(f"Error: {r.error}")
    
    # Save report to file
    report = {
        "total": len(results),
        "passed": total_passed,
        "failed": total_failed,
        "accuracy": accuracy,
        "avg_response_time": avg_time,
        "by_category": {
            cat: {
                "passed": data["passed"],
                "failed": data["failed"],
                "accuracy": (data["passed"] / (data["passed"] + data["failed"])) * 100
            }
            for cat, data in categories.items()
        },
        "failed_tests": [
            {
                "query": r.test.query,
                "expected": r.test.expected_cars,
                "got": r.returned_cars,
                "error": r.error
            }
            for r in failed
        ]
    }
    
    with open("AI_TEST_RESULTS.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📁 Full report saved to: AI_TEST_RESULTS.json")
    
    return accuracy

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    import sys
    
    # Check if API is running
    try:
        response = requests.get("http://localhost:5001/health", timeout=5)
    except:
        print("❌ Error: Backend server not running at localhost:5001")
        print("   Start with: cd backend && npm run dev")
        sys.exit(1)
    
    # Run tests
    results = run_all_tests(parallel=False)
    accuracy = print_report(results)
    
    # Exit code based on accuracy
    if accuracy >= 90:
        print("\n🎉 TEST PASSED: 90%+ accuracy achieved!")
        sys.exit(0)
    elif accuracy >= 70:
        print("\n⚠️ TEST WARNING: 70-90% accuracy, needs improvement")
        sys.exit(0)
    else:
        print("\n❌ TEST FAILED: Below 70% accuracy")
        sys.exit(1)
