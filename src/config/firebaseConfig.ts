import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBovGDlfb_jv8w1NKRXPjw-OmuKWwmDHeo',
  authDomain: 'college-app-8ebac.firebaseapp.com',
  projectId: 'college-app-8ebac',
  storageBucket: 'college-app-8ebac.firebasestorage.app',
  messagingSenderId: '182883918097',
  appId: '1:182883918097:ios:756bea2a5366e4e98decb0'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
