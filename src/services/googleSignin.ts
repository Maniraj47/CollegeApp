import { NativeModules, Platform } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Check if native RNGoogleSignin module is actually linked in the current runtime
const hasNativeGoogleSignin = Boolean(NativeModules?.RNGoogleSignin);

let NativeGoogleSignin: any = null;
if (hasNativeGoogleSignin) {
  try {
    const pkg = require('@react-native-google-signin/google-signin');
    NativeGoogleSignin = pkg.GoogleSignin;
  } catch (e) {
    NativeGoogleSignin = null;
  }
}

class GoogleSigninService {
  private isConfigured = false;

  configure(options: any = {}) {
    this.isConfigured = true;
    if (NativeGoogleSignin && typeof NativeGoogleSignin.configure === 'function') {
      try {
        NativeGoogleSignin.configure(options);
      } catch (err) {
        console.warn('[GoogleSignin] Native configure error, falling back to Expo Go mock', err);
      }
    }
  }

  async hasPlayServices(options: any = {}) {
    if (NativeGoogleSignin && typeof NativeGoogleSignin.hasPlayServices === 'function') {
      try {
        return await NativeGoogleSignin.hasPlayServices(options);
      } catch (err) {
        return true;
      }
    }
    return true;
  }

  async signIn() {
    if (NativeGoogleSignin && typeof NativeGoogleSignin.signIn === 'function') {
      return await NativeGoogleSignin.signIn();
    }

    // Expo Go / Sandbox fallback: Ensure a university student account is logged in via Firebase
    console.log('[GoogleSignin] Running in Expo Go / Sandbox: logging in demo university student.');
    const demoEmail = 'student.one@example.edu';
    const demoPassword = 'CollegeHubDemoPass2026!';

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
    } catch (e: any) {
      if (e?.code === 'auth/user-not-found' || e?.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
        } catch (_) {}
      }
    }

    return {
      data: {
        idToken: 'mock-expo-go-id-token',
        user: {
          id: auth.currentUser?.uid || 'demo-student-uid-001',
          name: auth.currentUser?.displayName || 'Demo Student',
          email: demoEmail,
          photo: 'https://example.com/avatar/student-one.png',
          familyName: 'Student',
          givenName: 'Demo',
        },
      },
    };
  }

  async signOut() {
    if (NativeGoogleSignin && typeof NativeGoogleSignin.signOut === 'function') {
      try {
        await NativeGoogleSignin.signOut();
      } catch (_) {}
    }
  }

  async isSignedIn() {
    if (NativeGoogleSignin && typeof NativeGoogleSignin.isSignedIn === 'function') {
      return await NativeGoogleSignin.isSignedIn();
    }
    return Boolean(auth.currentUser);
  }
}

export const GoogleSignin = new GoogleSigninService();
export default GoogleSignin;

