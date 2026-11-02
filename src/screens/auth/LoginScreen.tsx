import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '../../services/googleSignin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

GoogleSignin.configure({
  webClientId: '182883918097-r0q0p9sfaavq4f2t3dvhtc2e8cd5t655.apps.googleusercontent.com', 
  iosClientId: '182883918097-u736b15ls1nuulqd7gm1d8b4f2ebeu1p.apps.googleusercontent.com',
});

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#edf2f7',
  primary: '#003ec7',
  primaryDark: '#00298a',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outlineVariant: '#c3c5d9',
  accent: '#0284c7',
};

const LoginScreen = ({ navigation }: any) => {
  const { loginAsDemoStudent } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      setError('');
      await loginAsDemoStudent();
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const signInResult = await GoogleSignin.signIn();
      const email = signInResult.data?.user?.email || '';

      // Allow .edu emails or saveetha.com emails
      if (!email.toLowerCase().endsWith('.edu') && !email.toLowerCase().endsWith('@saveetha.com')) {
        await GoogleSignin.signOut();
        throw new Error('Please use a valid university email (.edu or @saveetha.com).');
      }

      const idToken = signInResult.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // If running in Expo Go sandbox/mock mode, activate demo university student session immediately
      if (idToken === 'mock-expo-go-id-token') {
        await loginAsDemoStudent();
        return;
      }

      // Standalone / Native build: Firebase credential sign-in
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const uid = userCredential.user.uid;
      const displayName = userCredential.user.displayName || 'University Student';
      const userEmail = userCredential.user.email || '';

      // Check if this is a new user and create a Firestore document if so
      const userDocRef = doc(firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid,
          name: displayName,
          displayName,
          email: userEmail,
          onboardingCompleted: true,
          createdAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (err: any) {
      console.warn('[LoginScreen] handleGoogleLogin error:', err);
      // In Expo Go, offer smooth demo fallback if native flow fails
      setError(err?.message || 'Google Login failed. Tap Demo Preview to continue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}><Text style={styles.logoIconText}>🎓</Text></View>
          <Text style={styles.logoText}>College Hub</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome to College Hub</Text>
          <Text style={styles.subtitle}>Sign in with your university account to connect with your campus.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.form}>
          <Pressable 
            style={[styles.googleBtn, loading && styles.btnDisabled]} 
            onPress={handleGoogleLogin} 
            disabled={loading || demoLoading}
          >
            {loading ? (
              <ActivityIndicator color={C.primary} style={{ marginRight: 8 }} />
            ) : (
              <Text style={styles.googleIcon}>G</Text>
            )}
            <Text style={styles.googleBtnText}>
              {loading ? 'Connecting...' : 'Sign in with Google'}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR EXPO GO PREVIEW</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Quick 1-Tap Student Demo Button */}
          <Pressable 
            style={[styles.demoBtn, demoLoading && styles.btnDisabled]} 
            onPress={handleDemoLogin} 
            disabled={loading || demoLoading}
          >
            <View style={styles.demoIconWrap}>
              <Text style={styles.demoBtnIcon}>⚡</Text>
            </View>
            <View style={styles.demoBtnContent}>
              <View style={styles.demoTitleRow}>
                <Text style={styles.demoBtnTitle}>Instant Student Demo Login</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>1-TAP</Text></View>
              </View>
              <Text style={styles.demoBtnSub}>
                {demoLoading ? 'Loading campus preview...' : 'Explore feed, directory, marketplace & chat'}
              </Text>
            </View>
          </Pressable>

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don't have an account? </Text>
            <Pressable onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.registerLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 32 },
  
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 36 },
  logoIcon: { width: 48, height: 48, backgroundColor: C.primary, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  logoIconText: { fontSize: 24 },
  logoText: { fontSize: 26, fontWeight: '800', color: C.primary },
  
  header: { marginBottom: 28 },
  title: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant, lineHeight: 22 },
  errorText: { color: '#dc2626', marginTop: 12, fontSize: 14, fontWeight: '500' },
  
  form: { gap: 16, marginTop: 8 },
  
  googleBtn: { 
    backgroundColor: C.surfaceLowest, 
    height: 56, 
    borderRadius: 28, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: 'rgba(0,0,0,0.08)', 
    shadowOpacity: 1, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 }, 
    borderWidth: 1, 
    borderColor: C.outlineVariant 
  },
  googleIcon: { fontSize: 20, fontWeight: '800', marginRight: 12, color: '#DB4437' },
  googleBtnText: { color: C.onSurface, fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 12, fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.8 },

  demoBtn: {
    backgroundColor: '#003ec7',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#003ec7',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  demoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBtnIcon: { fontSize: 22 },
  demoBtnContent: { flex: 1 },
  demoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  demoBtnTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  badge: {
    backgroundColor: '#ffb703',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: '#000000', fontSize: 10, fontWeight: '800' },
  demoBtnSub: { color: '#e0e7ff', fontSize: 12, fontWeight: '500' },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  registerPrompt: { fontSize: 15, color: C.onSurfaceVariant },
  registerLink: { fontSize: 15, color: C.primary, fontWeight: '700' },
});

export default LoginScreen;
