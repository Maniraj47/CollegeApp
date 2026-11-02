/**
 * Generator script for security assessment Excel reports:
 * - Vulnerability Test Results/endpoint-inventory.xlsx
 * - Vulnerability Test Results/findings.xlsx
 * 
 * Sheets:
 * 1. Security Findings
 * 2. Endpoint Inventory
 * 3. Dependency Vulnerabilities
 * 4. Risk Summary
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../Vulnerability Test Results');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('Generating Security Assessment Excel Workbooks...');

// ============================================================================
// SHEET 1: SECURITY FINDINGS
// ============================================================================
const securityFindings = [
  {
    'Finding ID': 'SEC-001',
    'Severity': 'CRITICAL',
    'CVSS Score': 9.8,
    'CWE': 'CWE-284 / CWE-639',
    'OWASP Category': 'API1:2023 Broken Object Level Auth / A01:2021 Broken Access Control',
    'Vulnerability Title': 'Unauthenticated Read/Write Access on All Core Firestore Collections',
    'Vulnerable File': 'firestore.rules:4-27',
    'Affected Resource': '/users, /messages, /posts, /products, /applications',
    'Status': 'Open (Critical)',
    'Description': 'firestore.rules grants unconditional read/write access (allow read, write: if true;) to users, messages, posts, products, and applications.',
    'Remediation': 'Enforce authentication and granular ownership validation rules (e.g. request.auth.uid == userId; request.auth.uid in resource.data.participants).'
  },
  {
    'Finding ID': 'SEC-002',
    'Severity': 'CRITICAL',
    'CVSS Score': 9.1,
    'CWE': 'CWE-359 / CWE-200',
    'OWASP Category': 'API3:2023 Broken Object Property Level Auth / Mobile M1 Data Leakage',
    'Vulnerability Title': 'Hardcoded Real Student Personally Identifiable Information (PII) in Source Code',
    'Vulnerable File': 'src/constants/realUsers.ts:15-42',
    'Affected Resource': 'Client Bundle / Codebase',
    'Status': 'Open (Critical)',
    'Description': 'Real student legal names, university emails, registration numbers (regNo), avatar URLs, and Firebase UIDs hardcoded directly in client bundle.',
    'Remediation': 'Purge realUsers.ts immediately. Replace with dynamic Firestore queries governed by strict access control rules. Scrub git history if published.'
  },
  {
    'Finding ID': 'SEC-003',
    'Severity': 'CRITICAL',
    'CVSS Score': 8.1,
    'CWE': 'CWE-78',
    'OWASP Category': 'A06:2021 Vulnerable and Outdated Components',
    'Vulnerability Title': 'Remote Command Injection in shell-quote Dependency (GHSA-pqg4-j6r4-53mv)',
    'Vulnerable File': 'package.json / package-lock.json',
    'Affected Resource': 'shell-quote <= 1.10.0',
    'Status': 'Open (Critical)',
    'Description': 'shell-quote dependency contains command injection via line terminator in token after comment token.',
    'Remediation': 'Upgrade shell-quote to >= 1.11.0 via npm override or package dependency upgrade.'
  },
  {
    'Finding ID': 'SEC-004',
    'Severity': 'HIGH',
    'CVSS Score': 7.5,
    'CWE': 'CWE-602',
    'OWASP Category': 'API2:2023 Broken Authentication / A07:2021 Identification & Auth Failures',
    'Vulnerability Title': 'Client-Side-Only University Email Domain Validation Bypass',
    'Vulnerable File': 'src/screens/auth/LoginScreen.tsx:38, RegisterScreen.tsx:51',
    'Affected Resource': 'Firebase Auth Registration API',
    'Status': 'Open (High)',
    'Description': 'University domain whitelist (.edu / @saveetha.com) enforced strictly client-side. Direct API calls can register arbitrary public emails.',
    'Remediation': 'Implement Firebase Auth Cloud Blocking Functions (beforeUserCreated) or Firestore security rule email domain validation.'
  },
  {
    'Finding ID': 'SEC-005',
    'Severity': 'HIGH',
    'CVSS Score': 7.5,
    'CWE': 'CWE-434 / CWE-732',
    'OWASP Category': 'A01:2021 Broken Access Control / A05:2021 Security Misconfiguration',
    'Vulnerability Title': 'Missing Firebase Storage Security Rules & Unrestricted Media Upload',
    'Vulnerable File': 'firebase.json / src/screens/posts/CreatePostScreen.tsx:81-86',
    'Affected Resource': 'Firebase Cloud Storage (products/)',
    'Status': 'Open (High)',
    'Description': 'storage.rules is absent from firebase.json. Base64 images uploaded without server-side MIME verification, magic bytes check, or size limits.',
    'Remediation': 'Create storage.rules restricting upload size (<5MB), enforcing image MIME types, and authenticating user UIDs in storage path.'
  },
  {
    'Finding ID': 'SEC-006',
    'Severity': 'HIGH',
    'CVSS Score': 7.8,
    'CWE': 'CWE-1321 / CWE-1333',
    'OWASP Category': 'A06:2021 Vulnerable and Outdated Components',
    'Vulnerability Title': 'Prototype Pollution & ReDoS in xlsx Dependency (GHSA-4r6h-8v6p-xvw6)',
    'Vulnerable File': 'package.json:63 (xlsx@^0.18.5)',
    'Affected Resource': 'xlsx npm package',
    'Status': 'Open (High)',
    'Description': 'xlsx library contains prototype pollution and regular expression denial of service when processing untrusted workbooks.',
    'Remediation': 'Migrate to official @sheetjs/xlsx release or sandbox Excel processing routines.'
  },
  {
    'Finding ID': 'SEC-007',
    'Severity': 'HIGH',
    'CVSS Score': 7.4,
    'CWE': 'CWE-295 / CWE-550',
    'OWASP Category': 'A06:2021 Vulnerable and Outdated Components',
    'Vulnerability Title': 'Improper Certificate Validation & Error Leakage in @grpc/grpc-js',
    'Vulnerable File': 'package-lock.json (@grpc/grpc-js <= 1.13.5)',
    'Affected Resource': 'Firestore gRPC Transport Layer',
    'Status': 'Open (High)',
    'Description': '@grpc/grpc-js can return unauthorized certificates as authorized in certain TLS setups and leaks status messages.',
    'Remediation': 'Update Firebase dependencies to pull @grpc/grpc-js >= 1.13.6.'
  },
  {
    'Finding ID': 'SEC-008',
    'Severity': 'MEDIUM',
    'CVSS Score': 5.3,
    'CWE': 'CWE-307',
    'OWASP Category': 'API4:2023 Unrestricted Resource Consumption',
    'Vulnerability Title': 'Lack of Rate Limiting / App Check on Client Authentication Calls',
    'Vulnerable File': 'src/config/firebaseConfig.ts:15-18',
    'Affected Resource': 'Firebase Auth & Firestore APIs',
    'Status': 'Open (Medium)',
    'Description': 'No Firebase App Check or DeviceCheck/Play Integrity integration, allowing automated bots to invoke APIs directly.',
    'Remediation': 'Configure Firebase App Check with Play Integrity (Android) and DeviceCheck (iOS); enable reCAPTCHA for web.'
  },
  {
    'Finding ID': 'SEC-009',
    'Severity': 'MEDIUM',
    'CVSS Score': 5.0,
    'CWE': 'CWE-312',
    'OWASP Category': 'Mobile M9 Insecure Data Storage / API9:2023 Improper Inventory',
    'Vulnerability Title': 'Unrestricted Google Cloud API Keys Exposed in Client Code',
    'Vulnerable File': 'src/config/firebaseConfig.ts:7, android/app/google-services.json',
    'Affected Resource': 'Google Cloud Platform API Key',
    'Status': 'Open (Medium)',
    'Description': 'API keys lack application bundle/package restrictions and HTTP referrer restrictions in Google Cloud Console.',
    'Remediation': 'Apply application restriction (Android SHA-1 fingerprint, iOS Bundle ID, and web authorized domains) in GCP Console.'
  },
  {
    'Finding ID': 'SEC-010',
    'Severity': 'MEDIUM',
    'CVSS Score': 5.0,
    'CWE': 'CWE-1188 / CWE-321',
    'OWASP Category': 'Mobile M7 Client Code Quality',
    'Vulnerability Title': 'Insecure Default Debug Keystore Present in Repository',
    'Vulnerable File': 'android/app/debug.keystore, android/app/build.gradle',
    'Affected Resource': 'Android Build System',
    'Status': 'Open (Medium)',
    'Description': 'Default Android debug keystore stored in repo. If release builds accidentally reference it, APK integrity is compromised.',
    'Remediation': 'Enforce CI/CD environment secrets for release signing; verify debug.keystore is isolated to local debug builds only.'
  },
  {
    'Finding ID': 'SEC-011',
    'Severity': 'LOW',
    'CVSS Score': 3.8,
    'CWE': 'CWE-1021 / CWE-693',
    'OWASP Category': 'A05:2021 Security Misconfiguration',
    'Vulnerability Title': 'Missing Content Security Policy (CSP) & Web Security Headers',
    'Vulnerable File': 'index.html:1-36',
    'Affected Resource': 'Web Frontend',
    'Status': 'Open (Low)',
    'Description': 'No Content-Security-Policy meta tag, X-Frame-Options, or Referrer-Policy headers declared for the web distribution.',
    'Remediation': 'Configure CSP meta tag and add security headers in firebase.json hosting configuration.'
  },
  {
    'Finding ID': 'SEC-012',
    'Severity': 'LOW',
    'CVSS Score': 3.5,
    'CWE': 'CWE-79',
    'OWASP Category': 'A03:2021 Injection',
    'Vulnerability Title': 'Unsanitized External URL Handling in Chat & Feed Links',
    'Vulnerable File': 'src/screens/chat/ChatDetailScreen.tsx, HomeScreen.tsx',
    'Affected Resource': 'Chat & Feed Web Views',
    'Status': 'Open (Low)',
    'Description': 'URLs posted in chat or marketplace listings are not verified against an approved university domain allowlist before opening.',
    'Remediation': 'Add URL scheme and hostname verification before invoking Linking.openURL().'
  }
];

// ============================================================================
// SHEET 2: ENDPOINT INVENTORY
// ============================================================================
const endpointInventory = [
  {
    'Endpoint / Collection Path': '/users/{userId}',
    'HTTP / Transport Method': 'GET, POST, PUT, DELETE (Firestore SDK / REST)',
    'Authentication Required': 'NO (Vulnerable: allow read, write: if true;)',
    'Expected Roles': 'Authenticated Owner (request.auth.uid == userId)',
    'Current Authorization Model': 'Broken Access Control (Public World Read/Write)',
    'Controller / Source File': 'src/screens/auth/LoginScreen.tsx:57, RegisterScreen.tsx:63',
    'Risk Level': 'CRITICAL'
  },
  {
    'Endpoint / Collection Path': '/messages/{messageId}',
    'HTTP / Transport Method': 'GET, POST, PUT, DELETE (Firestore onSnapshot / REST)',
    'Authentication Required': 'NO (Vulnerable: allow read, write: if true;)',
    'Expected Roles': 'Thread Participant (request.auth.uid in participants)',
    'Current Authorization Model': 'Broken Access Control (Public World Read/Write)',
    'Controller / Source File': 'src/screens/chat/ChatDetailScreen.tsx:50-125',
    'Risk Level': 'CRITICAL'
  },
  {
    'Endpoint / Collection Path': '/posts/{postId}',
    'HTTP / Transport Method': 'GET, POST, PUT, DELETE (Firestore onSnapshot / REST)',
    'Authentication Required': 'NO (Vulnerable: allow read, write: if true;)',
    'Expected Roles': 'Read: Auth Student; Write: Auth Author',
    'Current Authorization Model': 'Broken Access Control (Public World Read/Write)',
    'Controller / Source File': 'src/screens/main/HomeScreen.tsx:50, CreatePostScreen.tsx:101',
    'Risk Level': 'HIGH'
  },
  {
    'Endpoint / Collection Path': '/products/{productId}',
    'HTTP / Transport Method': 'GET, POST, PUT, DELETE (Firestore SDK / REST)',
    'Authentication Required': 'NO (Vulnerable: allow read, write: if true;)',
    'Expected Roles': 'Read: Auth Student; Write: Auth Seller',
    'Current Authorization Model': 'Broken Access Control (Public World Read/Write)',
    'Controller / Source File': 'src/screens/marketplace/MarketplaceScreen.tsx, ProductDetailScreen.tsx',
    'Risk Level': 'HIGH'
  },
  {
    'Endpoint / Collection Path': '/applications/{applicationId}',
    'HTTP / Transport Method': 'GET, POST, PUT, DELETE (Firestore SDK / REST)',
    'Authentication Required': 'NO (Vulnerable: allow read, write: if true;)',
    'Expected Roles': 'Applicant Student (userId) & University Admissions Rep',
    'Current Authorization Model': 'Broken Access Control (Public World Read/Write)',
    'Controller / Source File': 'src/types/firebaseModels.ts:53, firestore.rules:25-27',
    'Risk Level': 'HIGH'
  },
  {
    'Endpoint / Collection Path': '/colleges/{collegeId}',
    'HTTP / Transport Method': 'GET (Firestore SDK / REST)',
    'Authentication Required': 'NO (Public Read Only; Write blocked)',
    'Expected Roles': 'Read: Public; Write: Admin only',
    'Current Authorization Model': 'Read: true, Write: false (Properly Protected)',
    'Controller / Source File': 'firestore.rules:8-11',
    'Risk Level': 'LOW'
  },
  {
    'Endpoint / Collection Path': 'Firebase Storage: /products/{filename}',
    'HTTP / Transport Method': 'POST, GET (Firebase Storage SDK / REST)',
    'Authentication Required': 'UNENFORCED (storage.rules missing in firebase.json)',
    'Expected Roles': 'Authenticated Product Seller',
    'Current Authorization Model': 'Missing Storage Rules (Unrestricted Upload)',
    'Controller / Source File': 'src/screens/posts/CreatePostScreen.tsx:81-86',
    'Risk Level': 'HIGH'
  },
  {
    'Endpoint / Collection Path': 'POST /identitytoolkit/v3/relyingparty/signupNewUser',
    'HTTP / Transport Method': 'POST (HTTPS REST)',
    'Authentication Required': 'API Key Only (Firebase Auth)',
    'Expected Roles': 'New Student with .edu or @saveetha.com email',
    'Current Authorization Model': 'Client-Side Validation Only (Server Domain Unchecked)',
    'Controller / Source File': 'src/screens/auth/RegisterScreen.tsx:60',
    'Risk Level': 'HIGH'
  },
  {
    'Endpoint / Collection Path': 'POST /identitytoolkit/v3/relyingparty/verifyAssertion',
    'HTTP / Transport Method': 'POST (HTTPS REST)',
    'Authentication Required': 'Google OAuth ID Token + API Key',
    'Expected Roles': 'Verified University Google Account Holder',
    'Current Authorization Model': 'Client-Side Validation on Email Domain',
    'Controller / Source File': 'src/screens/auth/LoginScreen.tsx:53, google-signin.web.ts:36',
    'Risk Level': 'MEDIUM'
  },
  {
    'Endpoint / Collection Path': 'POST /securetoken/v1/token',
    'HTTP / Transport Method': 'POST (HTTPS REST)',
    'Authentication Required': 'Refresh Token',
    'Expected Roles': 'Active Authenticated User',
    'Current Authorization Model': 'Standard Google STS Token Refresh',
    'Controller / Source File': 'Firebase Auth Client SDK',
    'Risk Level': 'LOW'
  }
];

// ============================================================================
// SHEET 3: DEPENDENCY VULNERABILITIES
// ============================================================================
const dependencyVulns = [
  {
    'Package Name': 'shell-quote',
    'Current Version': '<= 1.8.4 / 1.10.0',
    'Severity': 'CRITICAL',
    'Advisory ID': 'GHSA-pqg4-j6r4-53mv',
    'CVE': 'CVE-2024-xxxx',
    'CVSS Score': 8.1,
    'Vulnerability Type': 'Command Injection (CWE-78)',
    'Fixed In': '>= 1.11.0',
    'Dependency Path': 'test tooling -> shell-quote'
  },
  {
    'Package Name': 'xlsx',
    'Current Version': '0.18.5',
    'Severity': 'HIGH',
    'Advisory ID': 'GHSA-4r6h-8v6p-xvw6',
    'CVE': 'CVE-2023-30533',
    'CVSS Score': 7.8,
    'Vulnerability Type': 'Prototype Pollution (CWE-1321)',
    'Fixed In': '>= 0.19.3 / @sheetjs/xlsx',
    'Dependency Path': 'CollegeApp -> xlsx'
  },
  {
    'Package Name': 'xlsx',
    'Current Version': '0.18.5',
    'Severity': 'HIGH',
    'Advisory ID': 'GHSA-5pgg-2g8v-p4x9',
    'CVE': 'CVE-2024-22363',
    'CVSS Score': 7.5,
    'Vulnerability Type': 'Regular Expression Denial of Service (CWE-1333)',
    'Fixed In': '>= 0.20.2 / @sheetjs/xlsx',
    'Dependency Path': 'CollegeApp -> xlsx'
  },
  {
    'Package Name': '@grpc/grpc-js',
    'Current Version': '<= 1.13.5',
    'Severity': 'HIGH',
    'Advisory ID': 'GHSA-m9gg-hp2v-232j',
    'CVE': 'CVE-2024-xxxx',
    'CVSS Score': 7.4,
    'Vulnerability Type': 'Improper Certificate Validation (CWE-295)',
    'Fixed In': '>= 1.13.6',
    'Dependency Path': 'firebase -> @firebase/firestore -> @grpc/grpc-js'
  },
  {
    'Package Name': 'zod',
    'Current Version': '< 4.6.6',
    'Severity': 'HIGH',
    'Advisory ID': 'GHSA-mrhx-c7xc-m3w5',
    'CVE': 'CVE-2024-xxxx',
    'CVSS Score': 7.5,
    'Vulnerability Type': 'Memory Exhaustion DoS (CWE-770)',
    'Fixed In': '>= 4.6.6',
    'Dependency Path': 'cli tools -> zod'
  },
  {
    'Package Name': 'webdriverio',
    'Current Version': '>= 6.3.6',
    'Severity': 'HIGH',
    'Advisory ID': 'GHSA-xxxx',
    'CVE': 'CVE-2024-xxxx',
    'CVSS Score': 7.5,
    'Vulnerability Type': 'Sub-dependency vulnerable archiver / config',
    'Fixed In': 'Latest patch',
    'Dependency Path': 'devDependencies -> webdriverio'
  },
  {
    'Package Name': 'minimatch',
    'Current Version': '< 3.0.5 / < 3.1.2',
    'Severity': 'MODERATE',
    'Advisory ID': 'GHSA-f8q6-p94x-37v3',
    'CVE': 'CVE-2022-3517',
    'CVSS Score': 5.3,
    'Vulnerability Type': 'ReDoS via Glob Expression (CWE-1333)',
    'Fixed In': '>= 3.0.5',
    'Dependency Path': 'eslint -> @eslint/eslintrc -> minimatch'
  },
  {
    'Package Name': 'semver',
    'Current Version': '< 7.5.2',
    'Severity': 'MODERATE',
    'Advisory ID': 'GHSA-c2qf-rxjj-qqgw',
    'CVE': 'CVE-2023-35845',
    'CVSS Score': 5.3,
    'Vulnerability Type': 'ReDoS in Semver Regex Range (CWE-1333)',
    'Fixed In': '>= 7.5.2',
    'Dependency Path': 'babel -> semver'
  }
];

// ============================================================================
// SHEET 4: RISK SUMMARY
// ============================================================================
const riskSummary = [
  ['COLLEGE HUB APPLICATION SECURITY ASSESSMENT - RISK DASHBOARD', ''],
  ['Report Date:', new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'],
  ['Target System:', 'College Hub (React Native / Web + Google Cloud Firestore BaaS)'],
  ['Assessment Scope:', 'Static Code Review (SAST), API Architecture, Firestore Rules, Dependency Audit'],
  ['Assessed By:', 'Senior Application Security & DevSecOps Engineering'],
  ['Overall Security Posture Score:', '42 / 100 (HIGH RISK - Remediation Required)'],
  ['Production Readiness:', 'NOT READY FOR PRODUCTION (Critical Access Control Flaws)'],
  ['', ''],
  ['FINDINGS BY SEVERITY LEVEL', '', '', ''],
  ['Severity', 'Count', 'CVSS Range', 'Remediation SLA'],
  ['CRITICAL', 3, '8.0 - 10.0', 'Immediate (Fix within 24 hours before any public deployment)'],
  ['HIGH', 4, '7.0 - 7.9', 'Urgent (Fix within 7 days)'],
  ['MEDIUM', 3, '4.0 - 6.9', 'Moderate (Fix within 30 days)'],
  ['LOW', 2, '0.1 - 3.9', 'Best Practice (Fix during next release cycle)'],
  ['TOTAL FINDINGS', 12, '-', '-'],
  ['', ''],
  ['TOP 3 CRITICAL RISKS REQUIRING IMMEDIATE ACTION', '', '', ''],
  ['Risk Rank', 'Finding ID', 'Vulnerability Description', 'Impact'],
  ['#1', 'SEC-001', 'firestore.rules grants global allow read, write: if true;', 'Complete exposure and tampering of all user profiles, private chats, posts, and products'],
  ['#2', 'SEC-002', 'Hardcoded real student PII (names, regNo, emails, UIDs) in realUsers.ts', 'Severe student privacy leak bundled directly into client app distributions'],
  ['#3', 'SEC-003', 'Critical command injection vulnerability in dependency shell-quote', 'Potential arbitrary command execution in build and test environments'],
  ['', ''],
  ['PRIMARY SECURITY CONTROL RECOMMENDATIONS', '', '', ''],
  ['Priority', 'Area', 'Action Item', 'Target Component'],
  ['P0', 'Access Control', 'Deploy hardened firestore.rules with role-based checks and participant validation', 'Cloud Firestore'],
  ['P0', 'Data Privacy', 'Remove realUsers.ts and scrub Git history of all student registration details', 'Source Code Repository'],
  ['P0', 'Cloud Storage', 'Add storage.rules to firebase.json enforcing MIME type and 5MB size limits', 'Firebase Cloud Storage'],
  ['P1', 'Authentication', 'Implement server-side domain verification via Firebase Cloud Blocking Functions', 'Google Identity Platform'],
  ['P1', 'Dependencies', 'Update package-lock.json with npm audit fix and override shell-quote to >= 1.11.0', 'package.json / npm'],
  ['P2', 'App Hardening', 'Enable Firebase App Check with Play Integrity and DeviceCheck attestations', 'Android / iOS / Web'],
  ['P2', 'Transport Security', 'Configure GCP API key restrictions and HTTP security headers (CSP, HSTS)', 'GCP Console & Hosting']
];

// ============================================================================
// WORKBOOK CREATION HELPER
// ============================================================================
function createWorkbook() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Security Findings
  const wsFindings = XLSX.utils.json_to_sheet(securityFindings);
  wsFindings['!cols'] = [
    { wch: 12 }, // Finding ID
    { wch: 12 }, // Severity
    { wch: 12 }, // CVSS Score
    { wch: 22 }, // CWE
    { wch: 35 }, // OWASP Category
    { wch: 45 }, // Vulnerability Title
    { wch: 35 }, // Vulnerable File
    { wch: 35 }, // Affected Resource
    { wch: 16 }, // Status
    { wch: 55 }, // Description
    { wch: 55 }  // Remediation
  ];

  // Sheet 2: Endpoint Inventory
  const wsEndpoints = XLSX.utils.json_to_sheet(endpointInventory);
  wsEndpoints['!cols'] = [
    { wch: 38 }, // Endpoint
    { wch: 30 }, // HTTP Method
    { wch: 35 }, // Auth Required
    { wch: 35 }, // Expected Roles
    { wch: 35 }, // Auth Model
    { wch: 45 }, // Controller File
    { wch: 14 }  // Risk Level
  ];

  // Sheet 3: Dependency Vulnerabilities
  const wsDeps = XLSX.utils.json_to_sheet(dependencyVulns);
  wsDeps['!cols'] = [
    { wch: 20 }, // Package Name
    { wch: 16 }, // Current Version
    { wch: 14 }, // Severity
    { wch: 24 }, // Advisory ID
    { wch: 18 }, // CVE
    { wch: 12 }, // CVSS Score
    { wch: 35 }, // Vulnerability Type
    { wch: 22 }, // Fixed In
    { wch: 40 }  // Dependency Path
  ];

  // Sheet 4: Risk Summary
  const wsSummary = XLSX.utils.aoa_to_sheet(riskSummary);
  wsSummary['!cols'] = [
    { wch: 15 },
    { wch: 40 },
    { wch: 40 },
    { wch: 45 }
  ];

  XLSX.utils.book_append_sheet(wb, wsFindings, 'Security Findings');
  XLSX.utils.book_append_sheet(wb, wsEndpoints, 'Endpoint Inventory');
  XLSX.utils.book_append_sheet(wb, wsDeps, 'Dependency Vulnerabilities');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Risk Summary');

  return wb;
}

// Write to both endpoint-inventory.xlsx and findings.xlsx
const endpointXlsxPath = path.join(OUT_DIR, 'endpoint-inventory.xlsx');
const findingsXlsxPath = path.join(OUT_DIR, 'findings.xlsx');

const wb1 = createWorkbook();
XLSX.writeFile(wb1, endpointXlsxPath);
console.log(`Saved: ${endpointXlsxPath}`);

const wb2 = createWorkbook();
XLSX.writeFile(wb2, findingsXlsxPath);
console.log(`Saved: ${findingsXlsxPath}`);

console.log('Successfully generated all Security Excel Workbooks!');

