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
    uid: '5pepMaY9BkWvirmjPnmLTGAXz933',
    id: '5pepMaY9BkWvirmjPnmLTGAXz933',
    displayName: 'Mani Rathan Raj Pushparaj',
    name: 'Mani Rathan Raj Pushparaj',
    email: 'manirathnamrajp2340.sse@saveetha.com',
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocIWCiFhxdRry7YHBoqbZnxRk5lGqdHUYm8vixKrUUrLdM7hQQ=s96-c',
    photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIWCiFhxdRry7YHBoqbZnxRk5lGqdHUYm8vixKrUUrLdM7hQQ=s96-c',
    department: 'CSE',
    year: '4th Year',
    regNo: '1341',
    role: 'student',
  },
  {
    uid: 'nOC1BcUoUXfM9nJ9J2JsNVXfT3r2',
    id: 'nOC1BcUoUXfM9nJ9J2JsNVXfT3r2',
    displayName: 'Mani Raj',
    name: 'Mani Raj',
    email: 'rapidsolution2024@gmail.com',
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocKkiw8PQ4Ms9_RjQOzRXfUltDyG9oj9N_YCKms4Bj_fXN1mUXY=s96-c',
    photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKkiw8PQ4Ms9_RjQOzRXfUltDyG9oj9N_YCKms4Bj_fXN1mUXY=s96-c',
    department: 'Information Technology',
    year: 'Junior (3rd Year)',
    regNo: 'IT-2024-201',
    role: 'student',
  },
];
