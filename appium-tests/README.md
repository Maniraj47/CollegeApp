# College Hub Mobile - Appium 2.x E2E Automation Testing

This directory contains the mobile End-to-End (E2E) Appium automation testing suite and test case matrix for the College Hub React Native mobile application across Android and iOS.

---

## 📁 Directory Structure

```
appium-tests/
├── config/
│   └── capabilities.js                   # Appium 2.x Desired Capabilities for Android & iOS
├── tests/
│   └── app-tests.js                      # Complete Appium E2E test suite (POM architecture)
├── CollegeApp_Mobile_Appium_Test_Cases_300.xlsx  # Excel workbook with 315 test cases & summary
├── appium-tests-summary.xlsx             # Duplicate summary workbook
├── generate-appium-test-matrix-excel.js  # Generator script for 315+ mobile test cases
├── screenshots/                          # Automated mobile screenshot captures on failure
└── README.md                             # Mobile automation documentation & guide
```

---

## 🚀 Quick Start & Execution

### 1. Install & Start Appium Server
Ensure Appium 2.x is installed along with the drivers:
```bash
# Start the Appium Server
npx appium
```
By default, the server listens at `http://127.0.0.1:4723/`.

### 2. Run Appium E2E Mobile Tests (Android)
```bash
npm run test:appium
```

### 3. Run Appium Tests on iOS Simulator
```bash
PLATFORM=ios npm run test:appium
```

### 4. Custom App Path or Device
```bash
ANDROID_DEVICE_NAME="Pixel_8" APP_PATH="/path/to/app-debug.apk" npm run test:appium
```

### 5. Regenerate the Mobile Excel Test Matrix
```bash
npm run test:appium:excel
```

---

## 📱 Page Object Model (POM) Architecture

The test suite in [`app-tests.js`](file:///Users/mj/Developer/CollegeApp/appium-tests/tests/app-tests.js) is architected around reusable Page Objects covering the entire user journey:

1. **`AuthPage`**: Mobile login view, Google Play Services sheet triggering, university email domain validation (`.edu` & `@saveetha.com`), and error banners.
2. **`NavigationPage`**: Animated floating bottom tab bar (`Home`, `Directory`, `Marketplace`, `Chat`, `Settings`) with spring transition assertions.
3. **`HomePage`**: Campus Poll interactive voting (Main Library, Student Union, Coffee Shop), vote percentage updates, likes, and comment sheet.
4. **`DirectoryPage`**: Student directory search, real-time name filtering, department filter chips (`CSE`, `ECE`, `EEE`, `BIO-TECH`), and student profile cards.
5. **`MarketplacePage`**: Category chips (`Books`, `Electronics`, `Stationery`, `Dorm`, `Sports`), product cards, price formatting in ₹, and `ProductDetailScreen` navigation.
6. **`ChatPage`**: Conversation thread list, unread badges, chat message composer, send button, and real-time message bubble verification.
7. **`SettingsPage`**: Student profile inspection, notifications toggle switch, dark mode toggle, campus wallet access, and secure logout flow.
8. **`Gestures` Helper**: `swipeUp` (feed scroll), `pullToRefresh` (feed reload), `hideKeyboard`, `pressBack` (Android hardware back), and `backgroundAndResume`.

---

## 📊 Excel Test Case Matrix Overview

The generated workbook **`CollegeApp_Mobile_Appium_Test_Cases_300.xlsx`** contains **315 test cases** (exceeding the 300 minimum requirement):

### Sheet 1: `Appium Summary & Metrics`
- **Executive Test Summary**: App version, platforms (Android 11–15 & iOS 15–18), framework (Appium 2.x + WebdriverIO), and requirement compliance.
- **Suite Breakdown**:
  | Module / Feature Domain | Total Cases | P0 (Critical) | P1 (High) | P2 (Medium) |
  | :--- | :---: | :---: | :---: |
  | 1. Mobile App Launch & Splash Lifecycle | 25 | 10 | 11 | 4 |
  | 2. Native Google Sign-In & Authentication | 30 | 18 | 10 | 2 |
  | 3. Student Onboarding & Profile Customization | 30 | 14 | 12 | 4 |
  | 4. Custom Animated Bottom Tab Bar Navigation | 30 | 12 | 13 | 5 |
  | 5. Campus Feed & Interactive Poll System | 35 | 14 | 15 | 6 |
  | 6. Post Creation, Media Uploads & Comments | 30 | 13 | 12 | 5 |
  | 7. Student Directory & Search Filtering | 30 | 11 | 14 | 5 |
  | 8. Campus Marketplace & Product Commerce | 35 | 14 | 15 | 6 |
  | 9. Real-time Campus Messaging & Chat | 30 | 14 | 12 | 4 |
  | 10. Mobile Gestures, Touch & Device Hardware | 20 | 9 | 8 | 3 |
  | 11. App Lifecycle, Push Notifications, Settings & Logout | 20 | 8 | 8 | 4 |
  | **TOTAL ACROSS ALL MOBILE SUITES** | **315** | **137** | **130** | **48** |
- **Platform Compatibility Matrix**: Android UiAutomator2, iOS XCUITest, emulators, simulators, and real devices.
- **Execution Guide & Prerequisites**.

### Sheet 2: `Mobile Appium Test Cases (315)`
Contains all 315 test cases (`TC_APP_001` through `TC_APP_315`) with full metadata:
1. `Test Case ID`
2. `Module / Feature`
3. `Category`
4. `Test Scenario / Objective`
5. `Pre-Conditions`
6. `Step-by-Step Execution`
7. `Test Data / Input`
8. `Expected Result`
9. `Priority` (`P0`, `P1`, `P2`)
10. `Execution Type` (`Automated (Appium)`)
11. `Status` (`Automated`)
12. `Component Under Test`

