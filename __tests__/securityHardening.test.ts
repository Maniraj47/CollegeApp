import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '..');

describe('security hardening regressions', () => {
  test('firestore rules do not allow global public write access', () => {
    const rules = fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8');
    expect(rules).not.toContain('allow read, write: if true;');
  });

  test('real users constants file was removed', () => {
    expect(fs.existsSync(path.join(repoRoot, 'src/constants/realUsers.ts'))).toBe(false);
  });

  test('shell-quote override is pinned to a safe version', () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
    expect(packageJson.overrides?.['shell-quote']).toBe('^1.11.0');
  });
});
