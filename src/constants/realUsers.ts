export interface RealUser {
  uid: string;
  id?: string;
  displayName: string;
  name?: string;
  email: string;
  photoURL?: string;
  photoUrl?: string;
  department: string;
  year: string;
  regNo: string;
  role?: string;
}

export const REAL_FIREBASE_USERS: RealUser[] = [
  {
    uid: 'demo-student-uid-001',
    id: 'demo-student-uid-001',
    displayName: 'Demo Student One',
    name: 'Demo Student One',
    email: 'student.one@example.edu',
    photoURL: 'https://example.com/avatar/student-one.png',
    photoUrl: 'https://example.com/avatar/student-one.png',
    department: 'CSE',
    year: '4th Year',
    regNo: 'DEMO-001',
    role: 'student',
  },
  {
    uid: 'demo-student-uid-002',
    id: 'demo-student-uid-002',
    displayName: 'Demo Student Two',
    name: 'Demo Student Two',
    email: 'student.two@example.edu',
    photoURL: 'https://example.com/avatar/student-two.png',
    photoUrl: 'https://example.com/avatar/student-two.png',
    department: 'Information Technology',
    year: 'Junior (3rd Year)',
    regNo: 'DEMO-002',
    role: 'student',
  },
];
