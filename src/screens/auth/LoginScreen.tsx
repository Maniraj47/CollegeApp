import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '../../services/googleSignin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebaseConfig';

GoogleSignin.configure({
  webClientId: '182883918097-r0q0p9sfaavq4f2t3dvhtc2e8cd5t655.apps.googleusercontent.com', 
  iosClientId: '182883918097-u736b15ls1nuulqd7gm1d8b4f2ebeu1p.apps.googleusercontent.com',
});

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  primary: '#003ec7',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outlineVariant: '#c3c5d9',
};

const LoginScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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

      let idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token or use Expo Go auth
      let uid = '';
      let displayName = 'University Student';
      let userEmail = email;

      if (idToken === 'mock-expo-go-id-token') {
        uid = auth.currentUser?.uid || signInResult.data?.user?.id || 'demo-student-uid-001';
        displayName = auth.currentUser?.displayName || signInResult.data?.user?.name || 'Demo Student';
      } else {
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, googleCredential);
        uid = userCredential.user.uid;
        displayName = userCredential.user.displayName || 'Google User';
        userEmail = userCredential.user.email || '';
      }

      // Check if this is a new user and create a Firestore document if so
      const userDocRef = doc(firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid,
          name: displayName,
          email: userEmail,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Google Login failed');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}><Text style={styles.logoIconText}>🎓</Text></View>
          <Text style={styles.logoText}>College Hub</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome to College Hub</Text>
          <Text style={styles.subtitle}>Sign in with your university Google account to connect with your campus.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.form}>
          <Pressable style={styles.googleBtn} onPress={handleGoogleLogin} disabled={loading}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>{loading ? 'Signing in...' : 'Sign in with Google'}</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' },
  
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  logoIcon: { width: 48, height: 48, backgroundColor: C.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoIconText: { fontSize: 24 },
  logoText: { fontSize: 24, fontWeight: '800', color: C.primary },
  
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 8 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant, lineHeight: 22 },
  errorText: { color: 'red', marginTop: 12, fontSize: 14 },
  
  form: { gap: 24, marginTop: 16 },
  
  googleBtn: { backgroundColor: C.surfaceLowest, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: 'rgba(0,0,0,0.1)', shadowOpacity: 1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, borderWidth: 1, borderColor: C.outlineVariant },
  googleIcon: { fontSize: 20, fontWeight: '800', marginRight: 12, color: '#DB4437' },
  googleBtnText: { color: C.onSurface, fontSize: 16, fontWeight: '700' },
});

export default LoginScreen;
