/**
 * Baseline & Load Testing Configuration
 * Target: 100 Virtual Users, 1 Minute Continuous Execution
 */
module.exports = {
  // Test Workload Parameters
  workload: {
    connections: parseInt(process.env.VUS || '100', 10), // 100 concurrent virtual users
    duration: parseInt(process.env.DURATION || '60', 10), // 60 seconds (1 minute continuous)
    pipelining: 1, // Standard HTTP 1.1 request/response pacing
    timeout: 10,   // Socket timeout in seconds
  },

  // Target Endpoint Configuration
  target: {
    baseUrl: process.env.TARGET_URL || 'http://localhost:4000',
    endpoints: [
      { path: '/api/feed', method: 'GET', weight: 40, name: 'Campus Feed & Polls' },
      { path: '/api/directory?dept=CSE', method: 'GET', weight: 25, name: 'Student Directory Search' },
      { path: '/api/marketplace', method: 'GET', weight: 20, name: 'Marketplace Listings' },
      { path: '/api/chat/messages?thread=cs_general', method: 'GET', weight: 15, name: 'Direct Chat History' },
    ],
  },

  // SLA Quality Gate Thresholds
  sla: {
    minRps: 100,            // Target: >= 100 - 120 req/sec
    targetAvgLatencyMs: 250,// Target: ~250ms average
    maxAllowedLatencyMs: 1500, // Target: <= 1500ms slowest max
    maxErrorRatePercent: 1.0,  // Max error rate < 1%
    p95LatencyMs: 500,      // 95% of requests under 500ms
    p99LatencyMs: 1000,     // 99% of requests under 1000ms
  },
};

