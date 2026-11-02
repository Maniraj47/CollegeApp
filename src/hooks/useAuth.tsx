import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';
import { User as AppUser } from '../types/firebaseModels';

interface AuthContextUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

type AuthState = {
  user: AuthContextUser | null;
  userData: AppUser | null;
  loading: boolean;
  loginAsDemoStudent: () => Promise<void>;
  logout: () => Promise<void>;
};

const DEFAULT_DEMO_USER: AppUser = {
  id: 'demo-student-uid-001',
  email: 'student.one@example.edu',
  displayName: 'Aarav Patel',
  role: 'student',
  regNo: '21BCE1042',
  department: 'CSE',
  year: '3rd Year',
  onboardingCompleted: true,
  photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AaravPatel',
  settings: {
    notificationsEnabled: true,
    theme: 'light',
  },
  createdAt: new Date() as any,
};

const AuthContext = createContext<AuthState>({
  user: null,
  userData: null,
  loading: true,
  loginAsDemoStudent: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextUser | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Safety timer to prevent splash screen hanging
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          });
        } else {
          // If we are currently using the demo student session, don't clear it
          setUser((prev) => (prev?.uid === DEFAULT_DEMO_USER.id ? prev : null));
          setUserData((prev) => (prev?.id === DEFAULT_DEMO_USER.id ? prev : null));
          setLoading(false);
        }
      },
      (error) => {
        console.warn('[useAuth] onAuthStateChanged error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      if (user.uid === DEFAULT_DEMO_USER.id) {
        setUserData(DEFAULT_DEMO_USER);
        setLoading(false);
        return;
      }

      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribeDoc = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as AppUser);
          } else {
            setUserData(null);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('[useAuth] onSnapshot error:', error);
          setLoading(false);
        }
      );
      return () => unsubscribeDoc();
    }
  }, [user?.uid]);

  const loginAsDemoStudent = async () => {
    setLoading(true);
    const demoUser: AuthContextUser = {
      uid: DEFAULT_DEMO_USER.id,
      email: DEFAULT_DEMO_USER.email,
      displayName: DEFAULT_DEMO_USER.displayName,
      photoURL: DEFAULT_DEMO_USER.photoUrl,
    };
    setUser(demoUser);
    setUserData(DEFAULT_DEMO_USER);
    setLoading(false);

    // Opportunistically persist demo user document into Firestore
    try {
      const userDocRef = doc(firestore, 'users', DEFAULT_DEMO_USER.id);
      await setDoc(
        userDocRef,
        {
          uid: DEFAULT_DEMO_USER.id,
          id: DEFAULT_DEMO_USER.id,
          name: DEFAULT_DEMO_USER.displayName,
          displayName: DEFAULT_DEMO_USER.displayName,
          email: DEFAULT_DEMO_USER.email,
          department: DEFAULT_DEMO_USER.department,
          year: DEFAULT_DEMO_USER.year,
          regNo: DEFAULT_DEMO_USER.regNo,
          onboardingCompleted: true,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('[useAuth] Demo user Firestore sync skipped:', e);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('[useAuth] Sign out error:', e);
    }
    setUser(null);
    setUserData(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, userData, loading, loginAsDemoStudent, logout }),
    [user, userData, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
