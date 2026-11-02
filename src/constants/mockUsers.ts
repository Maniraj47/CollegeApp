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
    uid: 'demo-student-01',
    id: 'demo-student-01',
    displayName: 'Demo Student One',
    name: 'Demo Student One',
    email: 'student.one@example.edu',
    photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo+Student+One',
    photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo+Student+One',
    department: 'Computer Science',
    year: '4th Year',
    regNo: 'CS-2026-001',
    role: 'student',
  },
  {
    uid: 'demo-student-02',
    id: 'demo-student-02',
    displayName: 'Demo Student Two',
    name: 'Demo Student Two',
    email: 'student.two@example.edu',
    photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo+Student+Two',
    photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo+Student+Two',
    department: 'Information Technology',
    year: 'Junior (3rd Year)',
    regNo: 'IT-2026-002',
    role: 'student',
  },
];
