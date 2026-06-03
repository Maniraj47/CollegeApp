import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
  secondary: '#a04100',
};

const LoginScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>🎓</Text></View>
            <Text style={styles.logoText}>College Hub</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your details to access your account.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="student@university.edu"
                  placeholderTextColor={C.outline}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity><Text style={styles.forgotText}>Forgot Password?</Text></TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={C.outline}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.eyeIcon}><Text>👁️</Text></TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to campus? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' },
  
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  logoIcon: { width: 48, height: 48, backgroundColor: C.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoIconText: { fontSize: 24 },
  logoText: { fontSize: 24, fontWeight: '800', color: C.primary },
  
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 8 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant },
  
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: C.onSurface },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceLowest, borderRadius: 8, borderWidth: 1, borderColor: C.outlineVariant, height: 48 },
  inputIcon: { paddingHorizontal: 12, fontSize: 16, color: C.outline },
  input: { flex: 1, height: '100%', fontSize: 16, color: C.onSurface },
  eyeIcon: { paddingHorizontal: 12 },
  
  loginBtn: { backgroundColor: C.primary, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: C.primary, shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
  loginBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(195,197,217,0.3)' },
  footerText: { fontSize: 16, color: C.onSurfaceVariant },
  signupText: { fontSize: 16, color: C.secondary, fontWeight: '700' },
});

export default LoginScreen;
