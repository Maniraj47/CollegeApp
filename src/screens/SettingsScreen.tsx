import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  primary: '#003ec7', // CollegeHub blue
  primaryContainer: '#e6eeff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outlineVariant: '#f0f2f5',
  danger: '#d32f2f',
};

const COMMON_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn}>
          <Text style={styles.menuIcon}>≡</Text>
        </Pressable>
        <Text style={styles.headerTitle}>CollegeHub</Text>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: COMMON_AVATAR }} style={styles.profileAvatar} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Settings</Text>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <Pressable style={styles.row} onPress={() => Alert.prompt('Change Username', 'Enter your new username:')}>
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>👤</Text>
                <Text style={styles.rowText}>Change Username</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.row} onPress={() => Alert.prompt('Change Password', 'Enter your new password:')}>
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>🔒</Text>
                <Text style={styles.rowText}>Change Password</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>🌙</Text>
                <Text style={styles.rowText}>Dark Mode</Text>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode} 
                trackColor={{ false: '#d1d5db', true: C.primary }}
                thumbColor={'#ffffff'}
              />
            </View>
            <View style={styles.divider} />
            <Pressable style={styles.row} onPress={() => Alert.alert('Notification Preferences', 'Choose how you want to be notified.')}>
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>🔔</Text>
                <Text style={styles.rowText}>Notification Preferences</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <Pressable style={styles.row} onPress={() => Alert.alert('Privacy Settings', 'Manage your privacy and security.')}>
              <View style={styles.rowLeft}>
                <Text style={styles.icon}>🛡️</Text>
                <Text style={styles.rowText}>Privacy Settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutCard} onPress={() => {
          auth().signOut().then(() => {
            Alert.alert('Logged Out', 'You have successfully logged out.');
          });
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.surfaceLowest },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: C.surfaceLowest,
  },
  iconBtn: { padding: 8, marginLeft: -8 },
  menuIcon: { fontSize: 24, color: C.onSurfaceVariant, fontWeight: '400' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.primary, letterSpacing: -0.5 },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
  },
  
  content: { padding: 20, paddingBottom: 120, backgroundColor: C.background },
  screenTitle: { fontSize: 32, fontWeight: '700', color: C.onSurface, marginBottom: 24 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: C.primary, marginBottom: 12, marginLeft: 4 },
  
  card: { backgroundColor: C.surfaceLowest, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, minHeight: 64 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  icon: { fontSize: 20, color: C.onSurfaceVariant, width: 24, textAlign: 'center' },
  rowText: { fontSize: 16, color: C.onSurface, fontWeight: '400' },
  chevron: { fontSize: 24, color: '#b0b5c1', fontWeight: '300' },
  
  divider: { height: 1, backgroundColor: '#f0f2f5', marginLeft: 56 },
  
  logoutCard: {
    backgroundColor: C.surfaceLowest,
    borderRadius: 16,
    padding: 16,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutIcon: { fontSize: 20, color: C.danger },
  logoutText: { fontSize: 16, fontWeight: '600', color: C.danger },
});

export default SettingsScreen;
