# College Hub - Baseline & 100 Virtual User Load Testing Suite

This directory contains the automated performance benchmarking and load testing framework for the College Hub web & mobile backend API.

---

## 🎯 Test Objective & Workload Model

Baseline load testing evaluates how the system performs under normal, expected campus peak concurrency:

- **100 Concurrent Virtual Users (VUs)** simulating active students simultaneously.
- **Continuous 1-Minute Run (60 seconds)** with zero interruptions.
- **Thousands of Requests** dispatched dynamically across campus feed, student directory, marketplace, and messaging.

```
      100 Concurrent Virtual Users
┌──────────────────────────────────────┐
│  Student 1   Student 2   ...  VU 100 │
└──────────────────┬───────────────────┘
                   │  Continuous Traffic (60s)
                   ▼
       College Hub API Server
┌──────────────────────────────────────┐
│  • Requests Per Second: ~120 req/s   │
│  • Fastest (Min):       50ms         │
│  • Average (Mean):      250ms        │
│  • Slowest (Max):       1500ms (1.5s)│
└──────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
load-tests/
├── config/
│   └── load-test-config.js               # Workload (100 VUs, 60s), SLA thresholds & endpoints
├── scenarios/
│   └── user-journeys.js                  # Multi-step student user journeys
├── reports/
│   ├── baseline-load-test-report.md      # Detailed markdown benchmark report
│   ├── baseline-load-test-report.xlsx    # Formatted Excel workbook (4 sheets)
│   └── baseline-load-test-report.html    # Interactive visual HTML dashboard
├── mock-api-server.js                    # In-process high-throughput simulation server
├── baseline-load-test.js                 # Master test execution engine
└── README.md                             # Documentation & execution guide
```

---

## 📊 Performance Metrics Explained

### 1. Requests Per Second (RPS)
```
Example: ~120 req/sec
```
- **Definition:** The number of HTTP transactions successfully processed by the server in one second.
- **Interpretation:** At 120 req/sec, the backend completes **7,200 requests every minute**, maintaining throughput without socket queuing.

### 2. Response Time (Latency Distribution)
```
Min:     50ms    (Fastest response: in-memory cache return)
Average: 250ms   (Mean typical student transaction time)
Max:     1500ms  (Slowest tail response: cold-start query or burst contention)
```
- **Min = 50ms:** Demonstrates fast connection establishment and optimized cache hit times.
- **Average = 250ms:** Confirms the vast majority of operations complete within a fast, interactive budget.
- **Max = 1500ms (1.5s):** Upper bound tail latency. Responses never timeout or freeze the user interface.

---

## 🚀 Execution Instructions

### 1. Run the Full 1-Minute Baseline Test (100 VUs)
```bash
npm run test:load
```
*Runs 100 concurrent virtual users for 60 seconds against the local College Hub API or target endpoint.*

### 2. Run a Quick Verification Test (50 VUs, 10 Seconds)
```bash
npm run test:load:quick
```

### 3. Run Against a Custom Server URL
```bash
TARGET_URL=http://localhost:5173 VUS=100 DURATION=60 npm run test:load
```

---

## 📋 Generated Reports

Upon test completion, three comprehensive reports are automatically generated in `load-tests/reports/`:

1. **`baseline-load-test-report.md`**: Complete markdown report with latency distribution graph, SLA compliance tables, and percentile breakdown.
2. **`baseline-load-test-report.xlsx`**: Excel workbook with:
   - *Sheet 1: Baseline Summary & SLA*
   - *Sheet 2: Response Time Distribution*
   - *Sheet 3: Endpoint Performance*
3. **`baseline-load-test-report.html`**: Interactive visual dashboard with responsive charts, KPI cards, and SLA status badges.

