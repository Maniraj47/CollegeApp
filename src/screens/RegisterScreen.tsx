import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
};

const RegisterScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>🎓</Text></View>
            <Text style={styles.logoText}>College Hub</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Create an account</Text>
              <Text style={styles.subtitle}>Sign up with your university email to get started.</Text>
            </View>

            <View style={styles.form}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Jane Doe"
                    placeholderTextColor={C.outlineVariant}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>College Email (.edu)</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="student@university.edu"
                    placeholderTextColor={C.outlineVariant}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.infoText}>ℹ️ Must end in .edu for campus verification</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={C.outlineVariant}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={C.outlineVariant}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxText}>
                  I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </View>

              <Pressable style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Create Account ➔</Text>
              </Pressable>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={() => navigation?.navigate('Login')}>
                  <Text style={styles.loginLink}>Log in</Text>
                </Pressable>
              </View>
            </View>
          </View>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Help Center</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Contact Campus Rep</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, justifyContent: 'center', paddingVertical: 24 },
  
  headerContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' },
  logoIcon: { backgroundColor: C.primaryContainer, padding: 8, borderRadius: 12 },
  logoIconText: { fontSize: 24 },
  logoText: { fontSize: 28, fontWeight: '800', color: C.primary },
  
  card: { backgroundColor: C.surfaceLowest, borderRadius: 16, padding: 24, shadowColor: C.primary, shadowOpacity: 0.06, shadowRadius: 24, shadowOffset: { width: 0, height: 4 }, borderWidth: 1, borderColor: '#e6e8ea' },
  
  cardHeader: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: C.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant },
  
  form: { gap: 16 },
  inputGroup: { gap: 4 },
  label: { fontSize: 12, fontWeight: '600', color: C.onSurfaceVariant, marginLeft: 4 },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceContainer, borderRadius: 8, height: 48 },
  inputIcon: { paddingHorizontal: 12, fontSize: 16, color: C.outline },
  input: { flex: 1, height: '100%', fontSize: 16, color: C.onSurface },
  infoText: { fontSize: 11, color: C.primary, marginLeft: 4, marginTop: 4 },
  
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: C.outline, backgroundColor: C.surfaceLowest, marginTop: 2 },
  checkboxText: { flex: 1, fontSize: 14, color: C.onSurfaceVariant, lineHeight: 20 },
  linkText: { color: C.primary, fontWeight: '600' },
  
  submitBtn: { backgroundColor: C.primary, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: 'rgba(0,0,0,0.1)', shadowOpacity: 1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { fontSize: 16, color: C.onSurfaceVariant },
  loginLink: { fontSize: 16, color: C.primary, fontWeight: '600' },
  
  footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 },
  footerLink: { fontSize: 12, color: C.outline, fontWeight: '600' },
  footerDot: { fontSize: 12, color: C.outlineVariant },
});

export default RegisterScreen;
