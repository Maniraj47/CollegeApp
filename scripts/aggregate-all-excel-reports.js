/**
 * ============================================================================
 * College Hub - All Test Excel Reports Aggregator & Packager
 * ============================================================================
 * Aggregates all 4 test Excel workbooks into `all-test-excel-reports/`
 * for local inspection and GitHub Actions Artifacts packaging.
 *
 * All 4 suites feature >= 300 test cases each (315 TCs each = 1,260 TCs total).
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.join(ROOT_DIR, 'all-test-excel-reports');

console.log('Collecting and packaging all 4 test Excel workbooks (1,260+ Test Cases)...');

// Target output structure matching the 4 CI jobs
const DEST_FOLDERS = {
  selenium: path.join(BUNDLE_DIR, '1-Selenium-Web-E2E'),
  appium: path.join(BUNDLE_DIR, '2-Appium-Mobile-E2E'),
  load: path.join(BUNDLE_DIR, '3-k6-Baseline-Load'),
  security: path.join(BUNDLE_DIR, '4-Security-DevSecOps'),
};

// Ensure all subdirectories exist
Object.values(DEST_FOLDERS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const filesToCopy = [
  // 1. Selenium Tests (315 Test Cases)
  {
    src: path.join(ROOT_DIR, 'selenium-tests/CollegeHub_Login_Test_Cases_300.xlsx'),
    dest: path.join(DEST_FOLDERS.selenium, 'CollegeHub_Login_Test_Cases_300.xlsx'),
    name: 'Selenium E2E Login Tests (315 Test Cases + Summary)',
  },
  {
    src: path.join(ROOT_DIR, 'selenium-tests/login-tests-summary.xlsx'),
    dest: path.join(DEST_FOLDERS.selenium, 'login-tests-summary.xlsx'),
    name: 'Selenium Summary Duplicate',
  },

  // 2. Appium Tests (315 Test Cases)
  {
    src: path.join(ROOT_DIR, 'appium-tests/CollegeApp_Mobile_Appium_Test_Cases_300.xlsx'),
    dest: path.join(DEST_FOLDERS.appium, 'CollegeApp_Mobile_Appium_Test_Cases_300.xlsx'),
    name: 'Appium Mobile E2E Tests (315 Test Cases + Summary)',
  },
  {
    src: path.join(ROOT_DIR, 'appium-tests/appium-tests-summary.xlsx'),
    dest: path.join(DEST_FOLDERS.appium, 'appium-tests-summary.xlsx'),
    name: 'Appium Summary Duplicate',
  },

  // 3. Load Tests (315 Test Cases)
  {
    src: path.join(ROOT_DIR, 'load-tests/reports/CollegeHub_Load_Testing_Cases_300.xlsx'),
    dest: path.join(DEST_FOLDERS.load, 'CollegeHub_Load_Testing_Cases_300.xlsx'),
    name: 'Baseline Load Testing Test Cases (315 Test Cases + SLA)',
  },
  {
    src: path.join(ROOT_DIR, 'load-tests/reports/baseline-load-test-report.xlsx'),
    dest: path.join(DEST_FOLDERS.load, 'baseline-load-test-report.xlsx'),
    name: 'Baseline Load Test Report (100 VUs / 1 Min / RPS / Latency)',
  },
  {
    src: path.join(ROOT_DIR, 'load-tests/reports/load-tests-summary.xlsx'),
    dest: path.join(DEST_FOLDERS.load, 'load-tests-summary.xlsx'),
    name: 'Load Tests Summary Duplicate',
  },

  // 4. Security Tests (315 Test Cases)
  {
    src: path.join(ROOT_DIR, 'Vulnerability Test Results/CollegeHub_Security_Test_Cases_300.xlsx'),
    dest: path.join(DEST_FOLDERS.security, 'CollegeHub_Security_Test_Cases_300.xlsx'),
    name: 'Security Assessment Test Cases (315 Test Cases + Executive Summary)',
  },
  {
    src: path.join(ROOT_DIR, 'Vulnerability Test Results/findings.xlsx'),
    dest: path.join(DEST_FOLDERS.security, 'findings.xlsx'),
    name: 'Security Vulnerability Findings & 315 Test Cases Matrix',
  },
  {
    src: path.join(ROOT_DIR, 'Vulnerability Test Results/endpoint-inventory.xlsx'),
    dest: path.join(DEST_FOLDERS.security, 'endpoint-inventory.xlsx'),
    name: 'Security Endpoint Inventory & Authorization Matrix',
  },

  // 5. Master Consolidated 1,260 Test Cases Workbook
  {
    src: path.join(ROOT_DIR, 'CollegeApp_Master_Test_Cases_Summary_and_Details_300.xlsx'),
    dest: path.join(BUNDLE_DIR, 'CollegeApp_Master_Test_Cases_Summary_and_Details_300.xlsx'),
    name: 'Master Consolidated Quality Matrix (1,260 Detailed TCs Across All 4 Suites)',
  },
];

console.log('\n===============================================================');
console.log('              ALL TEST EXCEL REPORTS BUNDLE                    ');
console.log('===============================================================');

let successCount = 0;
filesToCopy.forEach((item) => {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    try {
      const wb = XLSX.readFile(item.dest);
      console.log(`\x1b[32m[COPIED & VERIFIED]\x1b[0m ${item.name}`);
      console.log(`   └─ File:   ${path.relative(ROOT_DIR, item.dest)}`);
      console.log(`   └─ Sheets: [ ${wb.SheetNames.join(', ')} ]\n`);
      successCount++;
    } catch (e) {
      console.log(`\x1b[33m[COPIED]\x1b[0m ${item.name} (${e.message})\n`);
    }
  } else {
    console.log(`\x1b[31m[MISSING]\x1b[0m Source file not found: ${item.src}`);
  }
});

console.log('===============================================================');
console.log(`Successfully aggregated ${successCount} / ${filesToCopy.length} Excel workbooks into:`);
console.log(`📁 ${BUNDLE_DIR}\n`);
