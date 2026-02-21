
import client from 'prom-client';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'killer-whale-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// --- Custom Metrics ---

// 1. Backend API Latency Histogram
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 5, 10] // 0.1s, 0.5s, 1s, 5s, 10s
});
register.registerMetric(httpRequestDurationMicroseconds);

// 2. Frontend Web Vitals Histogram
// We will receive these from the client-side
export const frontendWebVitals = new client.Histogram({
    name: 'frontend_web_vitals',
    help: 'Frontend Web Vitals (LCP, CLS, FID, FCP, TTFB)',
    labelNames: ['metric_name'],
    buckets: [0.1, 0.5, 1, 2, 3, 5, 10]
});
register.registerMetric(frontendWebVitals);

export { register };
