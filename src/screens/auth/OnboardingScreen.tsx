import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, setDoc } from 'firebase/firestore';
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

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'BIO-TECH'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const CustomSelect = ({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (v: string) => void }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: value ? C.onSurface : '#9ca3af', fontSize: 16 }}>
              {value || `Select ${label}`}
            </Text>
          </View>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.modalOption}
                onPress={() => {
                  onSelect(opt);
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, value === opt && { color: C.primary, fontWeight: '700' }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
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
      // Use setDoc with merge: true instead of updateDoc
      // This guarantees it will create the document if it doesn't exist yet!
      await setDoc(userRef, {
        uid: user!.uid,
        email: user!.email,
        displayName: name.trim(),
        regNo: regNo.trim().toUpperCase(),
        department: department.trim(),
        year: year.trim(),
        onboardingCompleted: true,
      }, { merge: true });
      
      // onSnapshot listener in useAuth will automatically advance navigation
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

          <CustomSelect
            label="Department"
            value={department}
            options={DEPARTMENTS}
            onSelect={setDepartment}
          />

          <CustomSelect
            label="Year of Study"
            value={year}
            options={YEARS}
            onSelect={setYear}
          />

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
    borderWidth: 1,
    borderColor: C.outlineVariant,
    fontSize: 16,
    color: C.onSurface,
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: C.onSurface, textAlign: 'center' },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalOptionText: { fontSize: 16, color: C.onSurface, textAlign: 'center' },
});

export default OnboardingScreen;
