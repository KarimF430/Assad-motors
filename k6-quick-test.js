import http from 'k6/http';
import { check, sleep } from 'k6';

// Quick smoke test - 5 minutes with 20 users/second
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up
    { duration: '3m', target: 20 },   // Sustained load
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const BACKEND_URL = __ENV.BACKEND_URL || 'http://localhost:5001';

export default function () {
  // Homepage
  let response = http.get(`${BASE_URL}/`);
  check(response, { 'homepage OK': (r) => r.status === 200 });
  sleep(1);
  
  // API calls
  response = http.get(`${BACKEND_URL}/api/brands`);
  check(response, { 'brands API OK': (r) => r.status === 200 });
  sleep(1);
  
  response = http.get(`${BACKEND_URL}/api/models`);
  check(response, { 'models API OK': (r) => r.status === 200 });
  sleep(1);
  
  response = http.get(`${BACKEND_URL}/api/popular-comparisons`);
  check(response, { 'comparisons API OK': (r) => r.status === 200 });
  sleep(2);
}

export function setup() {
  console.log('🚀 Quick Smoke Test - 5 minutes');
  console.log(`🌐 Frontend: ${BASE_URL}`);
  console.log(`⚙️  Backend: ${BACKEND_URL}`);
}
