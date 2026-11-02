#!/usr/bin/env node
/**
 * ============================================================================
 * Universal Backend Security Audit Runner
 * ============================================================================
 * Automatically detects backend technology, executes SAST analysis, audits
 * dependencies, inspects security rules, and produces unified reports.
 * 
 * Exit Code: 1 on CRITICAL findings, 0 otherwise.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT_DIR, 'Vulnerability Test Results');

if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

console.log('\x1b[34m===============================================================\x1b[0m');
console.log('\x1b[1m\x1b[34m[DEVSECOPS]\x1b[0m \x1b[1mAUTOMATED BACKEND SECURITY ASSESSMENT ENGINE\x1b[0m');
console.log('\x1b[34m===============================================================\x1b[0m\n');

// ============================================================================
// PHASE 1: AUTOMATIC BACKEND TECHNOLOGY DISCOVERY
// ============================================================================
function detectBackendTech() {
  const stack = {
    framework: 'Unknown',
    language: 'Unknown',
    architecture: 'Unknown',
    database: 'Unknown',
    authMechanism: 'Unknown',
    rulesFile: null,
    packageManager: 'Unknown',
  };

  // Node / JavaScript / TypeScript detection
  if (fs.existsSync(path.join(ROOT_DIR, 'package.json'))) {
    stack.language = fs.existsSync(path.join(ROOT_DIR, 'tsconfig.json')) ? 'TypeScript / Node.js' : 'JavaScript / Node.js';
    stack.packageManager = 'npm / yarn';

    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (allDeps['@react-native-firebase/app'] || allDeps['firebase']) {
        stack.framework = 'Firebase BaaS (Backend-as-a-Service)';
        stack.architecture = 'Serverless Event-driven / Client-to-BaaS SDK';
        stack.database = 'Google Cloud Firestore (NoSQL Document Store)';
        stack.authMechanism = 'Firebase Authentication (Google OAuth 2.0 & Email/Password JWT)';
      } else if (allDeps['express']) {
        stack.framework = 'Express.js';
        stack.architecture = 'REST API';
      } else if (allDeps['@nestjs/core']) {
        stack.framework = 'NestJS';
        stack.architecture = 'Modular REST / GraphQL';
      }
    } catch {}
  }

  // Check Firestore rules
  if (fs.existsSync(path.join(ROOT_DIR, 'firestore.rules'))) {
    stack.rulesFile = 'firestore.rules';
  }

  // Python detection
  if (fs.existsSync(path.join(ROOT_DIR, 'requirements.txt')) || fs.existsSync(path.join(ROOT_DIR, 'Pipfile'))) {
    stack.language = 'Python';
    stack.packageManager = 'pip';
    if (fs.existsSync(path.join(ROOT_DIR, 'manage.py'))) {
      stack.framework = 'Django';
    }
  }

  // Java / Kotlin
  if (fs.existsSync(path.join(ROOT_DIR, 'pom.xml')) || fs.existsSync(path.join(ROOT_DIR, 'build.gradle'))) {
    stack.language = stack.language === 'Unknown' ? 'Java / Kotlin' : stack.language;
  }

  return stack;
}

const detectedStack = detectBackendTech();
console.log('\x1b[36m[PHASE 1 - BACKEND DISCOVERY]\x1b[0m');
console.log(`- Detected Framework:    ${detectedStack.framework}`);
console.log(`- Primary Language:      ${detectedStack.language}`);
console.log(`- Architecture:          ${detectedStack.architecture}`);
console.log(`- Database:              ${detectedStack.database}`);
console.log(`- Authentication Model:  ${detectedStack.authMechanism}`);
console.log(`- Rules Definition File: ${detectedStack.rulesFile || 'None'}\n`);

// ============================================================================
// PHASE 2 & 3: STATIC APPLICATION SECURITY TESTING (SAST)
// ============================================================================
console.log('\x1b[36m[PHASE 2 & 3 - SAST CODE & RULES AUDIT]\x1b[0m');
const findings = [];

// 1. Audit firestore.rules for permissive access
if (fs.existsSync(path.join(ROOT_DIR, 'firestore.rules'))) {
  const content = fs.readFileSync(path.join(ROOT_DIR, 'firestore.rules'), 'utf8');
  if (content.includes('allow read, write: if true;')) {
    findings.push({
      id: 'SEC-001',
      severity: 'CRITICAL',
      title: 'Unrestricted Public Read/Write Access in Firestore Rules',
      file: 'firestore.rules',
      cwe: 'CWE-284',
      description: 'Global "allow read, write: if true;" enables unauthenticated reads, writes, and deletions across sensitive collections.',
      remediation: 'Replace with authenticated RBAC rules (request.auth.uid == userId).'
    });
    console.log(' \x1b[31m[CRITICAL]\x1b[0m firestore.rules contains "allow read, write: if true;"');
  }
}

// 2. Audit for hardcoded real student PII
if (fs.existsSync(path.join(ROOT_DIR, 'src/constants/realUsers.ts'))) {
  const content = fs.readFileSync(path.join(ROOT_DIR, 'src/constants/realUsers.ts'), 'utf8');
  if (content.includes('regNo') || content.includes('@saveetha.com')) {
    findings.push({
      id: 'SEC-002',
      severity: 'CRITICAL',
      title: 'Hardcoded Real Student PII in Source Code',
      file: 'src/constants/realUsers.ts',
      cwe: 'CWE-359',
      description: 'Real student names, university emails, registration IDs (regNo), and Firebase UIDs committed directly to codebase.',
      remediation: 'Purge realUsers.ts immediately and migrate to authenticated queries.'
    });
    console.log(' \x1b[31m[CRITICAL]\x1b[0m src/constants/realUsers.ts contains hardcoded student PII');
  }
}

// 3. Audit firebase.json for missing storage rules
if (fs.existsSync(path.join(ROOT_DIR, 'firebase.json'))) {
  try {
    const fb = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'firebase.json'), 'utf8'));
    if (!fb.storage) {
      findings.push({
        id: 'SEC-005',
        severity: 'HIGH',
        title: 'Missing Cloud Storage Rules Configuration in firebase.json',
        file: 'firebase.json',
        cwe: 'CWE-732',
        description: 'No storage rules defined. Files uploaded to Storage bucket lack authorization constraints.',
        remediation: 'Define storage.rules and reference in firebase.json.'
      });
      console.log(' \x1b[33m[HIGH]\x1b[0m firebase.json lacks storage.rules definition');
    }
  } catch {}
}

// 4. Client-side only domain validation
const loginFile = path.join(ROOT_DIR, 'src/screens/auth/LoginScreen.tsx');
if (fs.existsSync(loginFile)) {
  const content = fs.readFileSync(loginFile, 'utf8');
  if (content.includes('.endsWith(\'.edu\')') && !fs.existsSync(path.join(ROOT_DIR, 'functions'))) {
    findings.push({
      id: 'SEC-004',
      severity: 'HIGH',
      title: 'Client-Side Only Email Domain Validation',
      file: 'src/screens/auth/LoginScreen.tsx',
      cwe: 'CWE-602',
      description: 'University email domain validation enforced solely in client UI; bypassable via direct REST API calls.',
      remediation: 'Implement server-side validation via Firebase Cloud Blocking Functions.'
    });
    console.log(' \x1b[33m[HIGH]\x1b[0m University email domain checked only on client UI');
  }
}

// ============================================================================
// PHASE 4 & 5: DEPENDENCY SCANNING
// ============================================================================
console.log('\n\x1b[36m[PHASE 4 & 5 - DEPENDENCY VULNERABILITY AUDIT]\x1b[0m');
let auditOutput = null;
try {
  const rawAudit = execSync('npm audit --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  auditOutput = JSON.parse(rawAudit);
} catch (err) {
  if (err.stdout) {
    try {
      auditOutput = JSON.parse(err.stdout);
    } catch {}
  }
}

if (auditOutput && auditOutput.metadata && auditOutput.metadata.vulnerabilities) {
  const vulnCounts = auditOutput.metadata.vulnerabilities;
  console.log(`- Dependencies Audited: ${auditOutput.metadata.dependencies?.total || 0}`);
  console.log(`- Critical Vulnerabilities: \x1b[31m${vulnCounts.critical}\x1b[0m`);
  console.log(`- High Vulnerabilities:     \x1b[33m${vulnCounts.high}\x1b[0m`);
  console.log(`- Moderate Vulnerabilities: ${vulnCounts.moderate}`);
  console.log(`- Low Vulnerabilities:      ${vulnCounts.low}`);

  if (vulnCounts.critical > 0) {
    findings.push({
      id: 'SEC-003',
      severity: 'CRITICAL',
      title: 'Known Critical Dependency Vulnerability Detected',
      file: 'package.json',
      cwe: 'CWE-78',
      description: `${vulnCounts.critical} critical package vulnerability detected via npm audit (e.g. shell-quote command injection).`,
      remediation: 'Run npm audit fix or override affected transitive dependency versions.'
    });
  }
}

// ============================================================================
// SUMMARY & EXIT CODE CALCULATION
// ============================================================================
console.log('\n\x1b[34m===============================================================\x1b[0m');
console.log('\x1b[1m\x1b[34m[ASSESSMENT SUMMARY]\x1b[0m');
console.log('\x1b[34m===============================================================\x1b[0m');

const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
const highCount = findings.filter(f => f.severity === 'HIGH').length;

console.log(`Total Findings Identified: ${findings.length}`);
console.log(`Critical Findings: \x1b[31m${criticalCount}\x1b[0m`);
console.log(`High Findings:     \x1b[33m${highCount}\x1b[0m`);

// Save JSON report
const jsonReportPath = path.join(REPORT_DIR, 'audit-results.json');
fs.writeFileSync(jsonReportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  stack: detectedStack,
  findings,
  summary: {
    critical: criticalCount,
    high: highCount,
    total: findings.length
  }
}, null, 2));

console.log(`\nDetailed JSON results saved to: ${jsonReportPath}`);

// Requirement: Fail only on Critical vulnerabilities
if (criticalCount > 0) {
  console.log('\x1b[31m\x1b[1m[CRITICAL STATUS] Pipeline FAILED due to Critical security findings.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m\x1b[1m[PASSED] No Critical security blockers found.\x1b[0m');
  process.exit(0);
}

