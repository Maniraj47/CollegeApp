import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHigh: '#e6e8ea',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onPrimaryContainer: '#dfe3ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
};

const INITIAL_STUDENTS = [
  { id: '1', name: 'Sarah Jenkins', major: 'Computer Science', studentId: '2024-001248', verified: true, action: 'Connect' },
  { id: '2', name: 'Marcus Torres', major: 'Business Administration', studentId: '2021-008932', verified: true, action: 'Message' },
  { id: '3', name: 'Aisha Patel', major: 'Graphic Design', studentId: '2023-004451', verified: true, action: 'Connect' },
  { id: '4', name: 'Liam Chen', major: 'Mechanical Engineering', studentId: '2024-009210', verified: true, action: 'Connect' },
];

const DirectoryScreen = () => {
  const navigation = useNavigation<any>();
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Students');

  const handleAction = (id: string, action: string) => {
    if (action === 'Connect') {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, action: 'Request Sent' } : s));
    } else if (action === 'Message') {
      const student = students.find(s => s.id === id);
      navigation.navigate('ChatDetail', { chat: { name: student?.name || 'Student' } });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.major.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'Engineering') {
      matchesFilter = ['Computer Science', 'Mechanical Engineering'].includes(student.major);
    } else if (activeFilter === 'Arts & Science') {
      matchesFilter = ['Graphic Design', 'Business Administration'].includes(student.major);
    }
    
    return matchesSearch && matchesFilter;
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => Alert.alert('Friend Requests', 'Sarah T. and 2 others want to connect with you.')}>
          <Text style={styles.iconTxt}>🔔</Text>
        </Pressable>
        <Text style={styles.headerTitle}>College Hub</Text>
        <Pressable style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }} style={styles.profileAvatar} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.screenTitle}>Student Directory</Text>
          <Text style={styles.screenSub}>Connect with verified peers across campus.</Text>
          
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search by name, major or ID..."
              placeholderTextColor={C.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <Pressable 
              style={[styles.filterChip, activeFilter === 'All Students' && styles.filterChipActive]}
              onPress={() => setActiveFilter('All Students')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'All Students' && styles.filterChipTextActive]}>All Students</Text>
            </Pressable>
            <Pressable 
              style={[styles.filterChip, activeFilter === 'Engineering' && styles.filterChipActive]}
              onPress={() => setActiveFilter('Engineering')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'Engineering' && styles.filterChipTextActive]}>Engineering</Text>
            </Pressable>
            <Pressable 
              style={[styles.filterChip, activeFilter === 'Arts & Science' && styles.filterChipActive]}
              onPress={() => setActiveFilter('Arts & Science')}
            >
              <Text style={[styles.filterChipText, activeFilter === 'Arts & Science' && styles.filterChipTextActive]}>Arts & Science</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {filteredStudents.length > 0 ? filteredStudents.map(student => (
            <View key={student.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.studentName}>{student.name}</Text>
                {student.verified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>}
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🏫</Text>
                  <Text style={styles.infoText}>{student.major}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🪪</Text>
                  <Text style={styles.infoId}>ID: {student.studentId}</Text>
                </View>
              </View>
              
              <Pressable 
                style={[
                  styles.actionBtn, 
                  student.action === 'Connect' ? styles.btnConnect : 
                  student.action === 'Request Sent' ? styles.btnRequestSent : 
                  styles.btnMessage
                ]}
                onPress={() => handleAction(student.id, student.action)}
                disabled={student.action === 'Request Sent'}
              >
                <Text style={[
                  styles.actionBtnText, 
                  student.action === 'Connect' ? styles.btnConnectText : 
                  student.action === 'Request Sent' ? styles.btnRequestSentText :
                  styles.btnMessageText
                ]}>
                  {student.action === 'Connect' ? '➕ Connect' : 
                   student.action === 'Request Sent' ? '✓ Request Sent' :
                   '💬 Message'}
                </Text>
              </Pressable>
            </View>
          )) : (
            <Text style={{ textAlign: 'center', marginTop: 32, color: C.outline }}>No students found matching your criteria.</Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 52, 
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.primaryContainer, letterSpacing: -0.5 },
  profileBtn: { width: 32, height: 32 },
  profileAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: C.primaryContainer },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  iconTxt: { fontSize: 18 },
  
  content: { paddingBottom: 24 },
  
  listHeader: { padding: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: C.onSurface, marginBottom: 4 },
  screenSub: { fontSize: 16, color: C.onSurfaceVariant, marginBottom: 16 },
  
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceLowest, borderRadius: 28, height: 52, paddingHorizontal: 16, borderWidth: 1, borderColor: C.outlineVariant, marginBottom: 16 },
  searchIcon: { fontSize: 18, color: C.outline, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: C.onSurface },
  
  filterScroll: { flexDirection: 'row' },
  filterChip: { backgroundColor: C.surfaceLowest, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.outlineVariant, marginRight: 8 },
  filterChipActive: { backgroundColor: C.primaryContainer, borderColor: C.primaryContainer },
  filterChipText: { fontSize: 14, fontWeight: '600', color: C.onSurfaceVariant },
  filterChipTextActive: { color: C.onPrimaryContainer },
  
  grid: { paddingHorizontal: 16, gap: 16 },
  card: { backgroundColor: C.surfaceLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.surfaceContainer, shadowColor: C.primary, shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  studentName: { fontSize: 20, fontWeight: '700', color: C.onSurface },
  verifiedBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  verifiedText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  
  cardBody: { gap: 8, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoIcon: { fontSize: 16 },
  infoText: { fontSize: 15, color: C.onSurfaceVariant },
  infoId: { fontSize: 12, color: C.outline, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  actionBtn: { paddingVertical: 12, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  btnConnect: { backgroundColor: C.primaryContainer },
  btnConnectText: { color: C.onPrimaryContainer, fontSize: 16, fontWeight: '600' },
  btnRequestSent: { backgroundColor: C.surfaceContainer, borderColor: C.outlineVariant },
  btnRequestSentText: { color: C.outline, fontSize: 16, fontWeight: '600' },
  btnMessage: { backgroundColor: C.surfaceLowest, borderColor: C.outlineVariant },
  btnMessageText: { color: C.onSurface, fontSize: 16, fontWeight: '600' },
});

export default DirectoryScreen;
