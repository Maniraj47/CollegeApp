# College Hub Web - Selenium E2E Automation Testing

This directory contains the End-to-End (E2E) Selenium automation test suite and test matrix for the College Hub web frontend.

## 📁 Directory Structure

```
selenium-tests/
├── tests/
│   └── login-tests.js                    # Selenium WebDriver E2E test suite (POM architecture)
├── CollegeHub_Login_Test_Cases_300.xlsx  # Comprehensive Excel workbook with 315 test cases & summary
├── login-tests-summary.xlsx              # Duplicate summary workbook
├── generate-test-matrix-excel.js         # Generator script for the 315+ test cases workbook
├── screenshots/                          # Automated screenshot captures on failure
└── README.md                             # Documentation & execution guide
```

---

## 🚀 Quick Start & Execution

### 1. Start the College Hub Web App
In your terminal, start the local Vite development server:
```bash
npm run web
```
The application will be running at `http://localhost:5173`.

### 2. Run the Selenium Test Suite
In a separate terminal window:
```bash
npm run test:selenium
```

### 3. Run in Headless Mode (CI/CD Pipeline)
```bash
npm run test:selenium:headless
```

### 4. Run Against a Custom Staging/Production URL
```bash
APP_URL=https://your-collegeapp.web.app npm run test:selenium
```

### 5. Regenerate the Excel Test Matrix
```bash
npm run test:matrix:excel
```

---

## 📊 Excel Test Case Matrix Overview

The generated workbook **`CollegeHub_Login_Test_Cases_300.xlsx`** contains **315 detailed test cases** structured into two sheets:

### Sheet 1: `Test Summary & Metrics`
- **Executive Test Summary**: Framework, target environment, and requirement compliance status.
- **Category Breakdown**: Test counts categorized into 11 testing domains.
- **Priority Distribution**: P0 (Critical - 119), P1 (High - 127), P2 (Medium - 69).
- **Execution Matrix**: Status tracking across supported browsers (Chrome, Firefox, Safari, Edge, Mobile Web).
- **Step-by-step Setup Guide**.

### Sheet 2: `Login Test Cases (315)`
Every single test case includes:
1. `Test Case ID` (`TC_AUTH_001` through `TC_AUTH_315`)
2. `Module / Feature`
3. `Category`
4. `Test Scenario / Objective`
5. `Pre-Conditions`
6. `Step-by-Step Execution Instructions`
7. `Test Data / Input`
8. `Expected Result`
9. `Priority` (P0 / P1 / P2)
10. `Execution Type` (Automated Selenium E2E)
11. `Status` (Automated)
12. `Component Under Test`

---

## 🧪 Test Suites Covered in `login-tests.js`

1. **DOM Structure & HTML Rendering**: Page mounting, title, meta viewport, font links, and CSS reset.
2. **UI, Visual Design & Branding**: Color tokens, geometry (56px pill button), branding texts, graduation emoji.
3. **Form Elements & Button States**: Interactive states, pointer cursors, click debouncing, and disabled indicators.
4. **Google Authentication & OAuth Handshake**: Web popup shims, user UID/email/name extraction, and Firestore document synchronization.
5. **University Domain Validation**: Strict whitelist validation permitting `.edu` and `@saveetha.com` while rejecting public domains (`@gmail.com`, `@yahoo.com`, `@outlook.com`).
6. **Negative Testing & Error Handling**: Exception banner messages, popup cancellation recovery, and token failure alerts.
7. **Session Storage & LocalStorage**: Token persistence, multi-tab synchronization, and secure logout transitions.
8. **Keyboard Navigation & Accessibility (WCAG 2.1)**: Tab indexing, Enter/Space activation, contrast ratios, and screen reader semantics.
9. **Responsive Design & Cross-Device Viewports**: Mobile (375x667, 390x844), Tablet (768x1024), and Desktop (1920x1080).
10. **Security & Vulnerability Scenarios**: XSS protection, SQL injection resilience, and clickjacking prevention.
11. **Performance & Network Conditions**: DOM load benchmarks, offline handling, and rapid interaction stress tests.

