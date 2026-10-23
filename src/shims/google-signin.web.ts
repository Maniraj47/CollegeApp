// Shim for @react-native-google-signin/google-signin on Web
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAuth } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export interface User {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export interface SignInResult {
  data: {
    idToken: string | null;
    user: User;
  } | null;
}

class GoogleSigninMock {
  private configured = false;

  configure(options: any = {}) {
    this.configured = true;
  }

  async hasPlayServices(options: any = {}) {
    return true;
  }

  async signIn(): Promise<SignInResult> {
    try {
      const provider = new GoogleAuthProvider();
      // On web we can use Firebase popup directly!
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return {
        data: {
          idToken,
          user: {
            id: user.uid,
            name: user.displayName,
            email: user.email || '',
            photo: user.photoURL,
            familyName: null,
            givenName: null,
          },
        },
      };
    } catch (err: any) {
      console.warn('[GoogleSignin web shim] Popup sign-in error or closed:', err);
      throw err;
    }
  }

  async signOut() {
    try {
      await auth.signOut();
    } catch (e) {
      // Ignore
    }
  }

  async getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      id: user.uid,
      name: user.displayName,
      email: user.email || '',
      photo: user.photoURL,
    };
  }

  async getTokens() {
    const user = auth.currentUser;
    const idToken = user ? await user.getIdToken() : '';
    return { idToken, accessToken: idToken };
  }
}

export const GoogleSignin = new GoogleSigninMock();
export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
export default GoogleSignin;
