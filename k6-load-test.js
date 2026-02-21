import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');
const pageLoadTime = new Trend('page_load_time');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// Test configuration for 500k daily users (≈20 users/second)
export const options = {
  stages: [
    // Ramp up
    { duration: '2m', target: 5 },      // Warm up: 5 users
    { duration: '5m', target: 10 },     // Gradual increase: 10 users
    { duration: '5m', target: 20 },     // Target load: 20 users/second
    
    // Sustained load
    { duration: '30m', target: 20 },    // Maintain 20 users/second
    
    // Peak load testing
    { duration: '5m', target: 40 },     // Spike test: 2x normal load
    { duration: '5m', target: 20 },     // Back to normal
    
    // Stress test
    { duration: '5m', target: 60 },     // 3x normal load
    { duration: '5m', target: 20 },     // Recovery
    
    // Ramp down
    { duration: '5m', target: 0 },      // Cool down
  ],
  
  thresholds: {
    // 95% of requests should complete within 2 seconds
    http_req_duration: ['p(95)<2000'],
    
    // Error rate should be less than 1%
    errors: ['rate<0.01'],
    
    // 99% of requests should succeed
    http_req_failed: ['rate<0.01'],
    
    // API response time should be under 1 second for 90% of requests
    api_response_time: ['p(90)<1000'],
    
    // Page load time should be under 3 seconds for 95% of requests
    page_load_time: ['p(95)<3000'],
  },
};

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const BACKEND_URL = __ENV.BACKEND_URL || 'http://localhost:5001';

// Test data - sample car brands and models
const testData = {
  brands: ['honda', 'maruti', 'hyundai', 'tata', 'mahindra', 'toyota'],
  models: ['city', 'swift', 'creta', 'nexon', 'scorpio', 'fortuner'],
  budgets: ['5-10', '10-15', '15-20', '20-30'],
  searchQueries: [
    'best suv under 15 lakh',
    'honda city price',
    'electric cars in india',
    'family car 7 seater',
    'fuel efficient sedan',
  ],
};

// Helper function to randomly select from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Simulate user behavior patterns
function userJourney() {
  const scenario = Math.random();
  
  if (scenario < 0.3) {
    // 30% - Homepage browsing
    homepageBrowsing();
  } else if (scenario < 0.5) {
    // 20% - Search journey
    searchJourney();
  } else if (scenario < 0.7) {
    // 20% - Brand exploration
    brandExploration();
  } else if (scenario < 0.85) {
    // 15% - Model details viewing
    modelDetailsView();
  } else {
    // 15% - Comparison journey
    comparisonJourney();
  }
}

// Test Scenario 1: Homepage Browsing
function homepageBrowsing() {
  const startTime = Date.now();
  
  // Load homepage
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'homepage loaded': (r) => r.status === 200,
    'homepage has content': (r) => r.body.includes('Find Your Perfect Car'),
  }) || errorRate.add(1);
  
  pageLoadTime.add(Date.now() - startTime);
  sleep(2); // User reads content
  
  // Fetch popular cars
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, {
    'popular cars loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  sleep(1);
  
  // Fetch popular comparisons
  response = http.get(`${BACKEND_URL}/api/popular-comparisons`);
  check(response, {
    'popular comparisons loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  
  if (response.status === 200) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }
  
  sleep(3); // User scrolls through homepage
}

// Test Scenario 2: Search Journey
function searchJourney() {
  const query = randomItem(testData.searchQueries);
  const startTime = Date.now();
  
  // Perform AI search
  let response = http.get(`${BASE_URL}/ai-search?q=${encodeURIComponent(query)}`);
  check(response, {
    'search page loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  pageLoadTime.add(Date.now() - startTime);
  sleep(2);
  
  // Fetch search results (simulated)
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, {
    'search results loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  
  if (response.status === 200) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }
  
  sleep(4); // User reviews results
}

// Test Scenario 3: Brand Exploration
function brandExploration() {
  const brand = randomItem(testData.brands);
  const startTime = Date.now();
  
  // Load brand page
  let response = http.get(`${BASE_URL}/${brand}-cars`);
  check(response, {
    'brand page loaded': (r) => r.status === 200 || r.status === 404, // 404 is ok for test
  }) || errorRate.add(1);
  
  pageLoadTime.add(Date.now() - startTime);
  sleep(2);
  
  // Fetch brands from API
  response = http.get(`${BACKEND_URL}/api/brands`);
  check(response, {
    'brands API responded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  sleep(1);
  
  // Fetch models for brand
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, {
    'models API responded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  
  if (response.status === 200) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }
  
  sleep(3); // User browses models
}

// Test Scenario 4: Model Details View
function modelDetailsView() {
  const brand = randomItem(testData.brands);
  const model = randomItem(testData.models);
  const startTime = Date.now();
  
  // Load model page
  let response = http.get(`${BASE_URL}/${brand}-cars/${model}`);
  check(response, {
    'model page loaded': (r) => r.status === 200 || r.status === 404,
  }) || errorRate.add(1);
  
  pageLoadTime.add(Date.now() - startTime);
  sleep(3);
  
  // Fetch model details
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, {
    'model details loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  sleep(2);
  
  // Fetch variants
  response = http.get(`${BACKEND_URL}/api/variants`);
  check(response, {
    'variants loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  
  if (response.status === 200) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }
  
  sleep(5); // User reads details
}

// Test Scenario 5: Comparison Journey
function comparisonJourney() {
  const startTime = Date.now();
  
  // Load comparison page
  let response = http.get(`${BASE_URL}/compare`);
  check(response, {
    'compare page loaded': (r) => r.status === 200 || r.status === 404,
  }) || errorRate.add(1);
  
  pageLoadTime.add(Date.now() - startTime);
  sleep(2);
  
  // Fetch popular comparisons
  response = http.get(`${BACKEND_URL}/api/popular-comparisons`);
  check(response, {
    'comparisons loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  sleep(1);
  
  // Fetch models for comparison
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, {
    'comparison models loaded': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  apiResponseTime.add(response.timings.duration);
  
  if (response.status === 200) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }
  
  sleep(4); // User compares cars
}

// Main test function
export default function () {
  userJourney();
  
  // Random think time between actions (1-3 seconds)
  sleep(Math.random() * 2 + 1);
}

// Setup function - runs once at the start
export function setup() {
  console.log('🚀 Starting K6 Load Test');
  console.log(`📊 Target: 500k daily users (~20 users/second)`);
  console.log(`🌐 Frontend URL: ${BASE_URL}`);
  console.log(`⚙️  Backend URL: ${BACKEND_URL}`);
  console.log('⏱️  Test Duration: ~67 minutes');
  console.log('');
  
  // Verify services are running
  const frontendCheck = http.get(BASE_URL);
  const backendCheck = http.get(`${BACKEND_URL}/api/brands`);
  
  if (frontendCheck.status !== 200) {
    console.error('❌ Frontend is not responding!');
  } else {
    console.log('✅ Frontend is ready');
  }
  
  if (backendCheck.status !== 200) {
    console.error('❌ Backend is not responding!');
  } else {
    console.log('✅ Backend is ready');
  }
  
  console.log('');
}

// Teardown function - runs once at the end
export function teardown(data) {
  console.log('');
  console.log('🏁 Load Test Complete!');
  console.log('📈 Check the summary above for detailed metrics');
}

// Handle summary - custom reporting
export function handleSummary(data) {
  const totalRequests = data.metrics.http_reqs.values.count;
  const failedRequests = data.metrics.http_req_failed.values.rate * totalRequests;
  const avgDuration = data.metrics.http_req_duration.values.avg;
  const p95Duration = data.metrics.http_req_duration.values['p(95)'];
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('                    TEST SUMMARY                       ');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total Requests:        ${totalRequests.toFixed(0)}`);
  console.log(`Successful Requests:   ${(totalRequests - failedRequests).toFixed(0)}`);
  console.log(`Failed Requests:       ${failedRequests.toFixed(0)}`);
  console.log(`Error Rate:            ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  console.log(`Avg Response Time:     ${avgDuration.toFixed(2)}ms`);
  console.log(`P95 Response Time:     ${p95Duration.toFixed(2)}ms`);
  console.log('═══════════════════════════════════════════════════════');
  
  return {
    'summary.json': JSON.stringify(data, null, 2),
  };
}
