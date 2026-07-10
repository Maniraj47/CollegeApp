import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  primary: '#003ec7',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outlineVariant: '#c3c5d9',
};

const OnboardingScreen = () => {
  const { user, userData } = useAuth();
  
  const [name, setName] = useState(user?.displayName || userData?.displayName || '');
  const [regNo, setRegNo] = useState(userData?.regNo || '');
  const [department, setDepartment] = useState(userData?.department || '');
  const [year, setYear] = useState(userData?.year || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update name if it loads later
  useEffect(() => {
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user]);

  const handleCompleteSetup = async () => {
    if (!name.trim() || !regNo.trim() || !department.trim() || !year.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const userRef = doc(firestore, 'users', user!.uid);
      await updateDoc(userRef, {
        displayName: name.trim(),
        regNo: regNo.trim().toUpperCase(),
        department: department.trim(),
        year: year.trim(),
        onboardingCompleted: true,
      });
      
      // We don't need to navigate manually. 
      // The `onSnapshot` listener in `useAuth` will update `userData`, 
      // which will instantly re-render `AppNavigator` and show the MainStack!
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Complete Setup</Text>
          <Text style={styles.subtitle}>Welcome! Let's get your profile set up so you can connect with your campus.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Jane Doe"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration Number</Text>
            <TextInput
              style={styles.input}
              value={regNo}
              onChangeText={setRegNo}
              placeholder="e.g. 21BCE1234"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="e.g. Computer Science"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year of Study</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="e.g. 3rd Year"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <Pressable style={styles.btn} onPress={handleCompleteSetup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Complete Profile</Text>
            )}
          </Pressable>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant, lineHeight: 22 },
  errorText: { color: 'red', marginTop: 12, fontSize: 14 },
  
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: C.onSurfaceVariant, marginLeft: 4 },
  input: {
    height: 56,
    backgroundColor: C.surfaceLowest,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: C.onSurface,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  
  btn: {
    backgroundColor: C.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: C.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default OnboardingScreen;
