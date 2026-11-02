import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';
import { REAL_FIREBASE_USERS, RealUser } from '../../constants/mockUsers';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHigh: '#e6e8ea',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  outlineVariant: '#c3c5d9',
  success: '#22c55e',
};

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [campusStudents, setCampusStudents] = useState<RealUser[]>(REAL_FIREBASE_USERS);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const myUid = user?.uid || '';

  // Sync real users from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'users'), (snap) => {
        if (!snap.empty) {
          const fetched = snap.docs.map((docSnap) => ({
            uid: docSnap.id,
            id: docSnap.id,
            displayName: docSnap.data().displayName || docSnap.data().name || 'Student',
            email: docSnap.data().email || '',
            photoURL: docSnap.data().photoUrl || docSnap.data().photoURL || '',
            department: docSnap.data().department || 'Computer Science',
            year: docSnap.data().year || 'Student',
            regNo: docSnap.data().regNo || '',
          })) as RealUser[];

          const merged = [...REAL_FIREBASE_USERS];
          fetched.forEach((f) => {
            const idx = merged.findIndex((m) => m.uid === f.uid);
            if (idx >= 0) merged[idx] = { ...merged[idx], ...f };
            else merged.push(f);
          });
          setCampusStudents(merged);
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn('Error fetching users in ChatScreen:', err);
    }
  }, []);

  // Listen to Firestore messages involving the current user
  useEffect(() => {
    if (!myUid) return;
    try {
      const q = query(
        collection(firestore, 'messages'),
        where('participants', 'array-contains', myUid)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setRecentMessages(fetched);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Error listening to messages:', err);
    }
  }, [myUid]);

  // Filter out currently logged-in user to show real peers to chat with
  const availablePeers = campusStudents.filter((s) => s.uid !== myUid);

  // Group latest message per partner
  const latestMessageMap = new Map<string, any>();
  recentMessages.forEach((msg: any) => {
    const partnerId = msg.senderId === myUid ? msg.recipientId : msg.senderId;
    if (partnerId) {
      latestMessageMap.set(partnerId, msg);
    }
  });

  const filteredPeers = availablePeers.filter((student) => {
    const name = student.displayName || '';
    const dept = student.department || '';
    const email = student.email || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBtn} />
        <Text style={styles.headerTitle}>College Hub</Text>
        <Pressable style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri:
                user?.photoURL ||
                'https://lh3.googleusercontent.com/a/ACg8ocIWCiFhxdRry7YHBoqbZnxRk5lGqdHUYm8vixKrUUrLdM7hQQ=s96-c',
            }}
            style={styles.profileAvatar}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.screenTitle}>Messages</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search campus peers..."
              placeholderTextColor={C.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.chatList}>
          {filteredPeers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>👥</Text>
              <Text style={styles.emptyTitle}>No other students found</Text>
              <Text style={styles.emptySubtitle}>
                Registered students like Mani Raj will appear here once connected.
              </Text>
            </View>
          ) : (
            filteredPeers.map((peer) => {
              const lastMsg = latestMessageMap.get(peer.uid);
              const previewText = lastMsg ? lastMsg.text : `Tap to chat with ${peer.displayName.split(' ')[0]}`;
              const timeText = lastMsg?.createdAt?.toDate
                ? new Date(lastMsg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Active';

              return (
                <Pressable
                  key={peer.uid}
                  style={styles.chatRow}
                  onPress={() =>
                    navigation.navigate('ChatDetail', {
                      chat: {
                        id: peer.uid,
                        recipientId: peer.uid,
                        user: peer.displayName,
                        name: peer.displayName,
                        avatar: peer.photoURL,
                        department: peer.department,
                        verified: true,
                        online: true,
                      },
                    })
                  }
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{
                        uri:
                          peer.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${peer.displayName}`,
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.onlineDot} />
                  </View>

                  <View style={styles.chatInfo}>
                    <View style={styles.chatRowTop}>
                      <View style={styles.nameRow}>
                        <Text style={styles.chatName}>{peer.displayName}</Text>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>✓</Text>
                        </View>
                      </View>
                      <Text style={styles.chatTime}>{timeText}</Text>
                    </View>

                    <Text style={styles.deptText}>{peer.department} • {peer.year}</Text>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {previewText}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
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
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: C.surfaceHigh,
  },
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.onSurface },
  profileBtn: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  profileAvatar: { width: 36, height: 36, borderRadius: 18 },

  content: { flex: 1 },
  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: C.onSurface, letterSpacing: -0.5, marginBottom: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainer,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: C.onSurface },

  chatList: { paddingHorizontal: 16, paddingBottom: 24 },
  chatRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: C.surfaceContainer,
  },
  avatarContainer: { position: 'relative', marginRight: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: C.success,
    borderWidth: 2,
    borderColor: C.surfaceLowest,
  },

  chatInfo: { flex: 1, justifyContent: 'center' },
  chatRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chatName: { fontSize: 16, fontWeight: '700', color: C.onSurface },
  badge: {
    backgroundColor: C.primaryContainer,
    borderRadius: 8,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  chatTime: { fontSize: 12, color: C.outline },
  deptText: { fontSize: 12, color: C.primary, fontWeight: '600', marginBottom: 2 },
  chatMessage: { fontSize: 13, color: C.onSurfaceVariant },

  emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.onSurface, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: C.onSurfaceVariant, textAlign: 'center', maxWidth: 260 },
});

export default ChatScreen;
