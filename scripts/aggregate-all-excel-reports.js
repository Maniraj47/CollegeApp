/**
 * Aggregates all 4 test Excel workbooks into a clean distribution directory
 * for local inspection and GitHub Actions Artifacts packaging.
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.join(ROOT_DIR, 'all-test-excel-reports');

console.log('Collecting and packaging all 4 test Excel workbooks...');

// Target output structure
const DEST_FOLDERS = {
  selenium: path.join(BUNDLE_DIR, '1-Selenium-Web-E2E'),
  appium: path.join(BUNDLE_DIR, '2-Appium-Mobile-E2E'),
  security: path.join(BUNDLE_DIR, '3-Security-DevSecOps'),
  load: path.join(BUNDLE_DIR, '4-Baseline-Load-Testing'),
};

// Ensure all subdirectories exist
Object.values(DEST_FOLDERS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const filesToCopy = [
  // 1. Selenium Tests
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
  // 2. Appium Tests
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
  // 3. Security Tests
  {
    src: path.join(ROOT_DIR, 'Vulnerability Test Results/endpoint-inventory.xlsx'),
    dest: path.join(DEST_FOLDERS.security, 'endpoint-inventory.xlsx'),
    name: 'Security Endpoint Inventory & Authorization Matrix',
  },
  {
    src: path.join(ROOT_DIR, 'Vulnerability Test Results/findings.xlsx'),
    dest: path.join(DEST_FOLDERS.security, 'findings.xlsx'),
    name: 'Security Vulnerability Findings & Risk Summary',
  },
  // 4. Load Tests
  {
    src: path.join(ROOT_DIR, 'load-tests/reports/baseline-load-test-report.xlsx'),
    dest: path.join(DEST_FOLDERS.load, 'baseline-load-test-report.xlsx'),
    name: 'Baseline Load Test Report (100 VUs / 1 Min / RPS / Latency)',
  },
  // 5. Master Comprehensive 300+ Test Cases Workbook
  {
    src: path.join(ROOT_DIR, 'CollegeApp_Master_Test_Cases_Summary_and_Details_300.xlsx'),
    dest: path.join(BUNDLE_DIR, 'CollegeApp_Master_Test_Cases_Summary_and_Details_300.xlsx'),
    name: 'Master Comprehensive Quality & Test Matrix (305 Detailed TCs + Summary)',
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
console.log(`\x1b[1m\x1b[36m${BUNDLE_DIR}\x1b[0m`);
console.log('===============================================================\n');

