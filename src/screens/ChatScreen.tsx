import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const CHATS = [
  {
    id: '1',
    user: 'Sarah Jenkins',
    verified: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuFdaYdfEaYJz8AvW0oDQaC5vgM3NTfCj4IWOgXAFZ40Pqr85WUHDz2dfmhhhBFpqmYTMIlB1JMecWgjXZmn74r1crvmnBMyRrAoALeUX0H_lExFJ2cNJXKbATVZeiT7Y4Mu9uw4P9hiEYoX1BPLPCGTH7uF6nZInC_aVh9lyr-MMafctslypOiYFp9XEtCEJ7-szJrcajZ2NdhGFHvST0FqgMvFJSzMaVOGeRmPMGVQwW7WjMOOQ_a9GaI5SZgtzvMXzf_hpghtw',
    online: true,
    lastMessage: 'Yes! I booked a room in the library.',
    time: 'Just now',
    unread: 2,
  },
  {
    id: '2',
    user: 'CS101 Study Group',
    verified: false,
    isGroup: true,
    avatar1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxaFwtMitWmJWf7TnSUmuPnfZ28N-kTcMAVZQ0MKTxaNg98OiY6Vbx79eOwz50uhuUZflHCei-Lx8Y5Z_53wt27mcsVeZgtNOgAo1HuiFeABpZZQyf0YTSqTANFyjwc1KID2_DpDxoAFO2H57JGCDWvYSHmHRneW7gt87nHSeCnRrJ1l5b7HjJBqgQdStainSCDyTUpqIv05fm4_vCzIPDm3O5t0sHGeJazz5BDh-q5QU6hY5ocsuQRZ3g0bkFVTEndn6tzQe858I',
    avatar2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Y012q6joA2_ndgdSct3nP_YRsTUamPlBQzDITBklhIxqx4eA954q-O-TaUUpfVXd5OmcIWIpKIPaT4zQRHDLZeG4k98yxqaUTVfAsepGbVG7aucsTEOnN5IeUU6XhgdlQZrBhV88Ct-gJw57U0YFxmKhTqQEa2KOak8ll82z3zk0D4VuWvFxst0HJp85nvAROdayfBBLl6u3i8dsd0UwuRq9QHfcCldQgMkulJM2931V6wS4OaVvSTnuP_oLp4fxzelaBWhMVVg',
    lastMessage: 'Mike: Who has the notes for chapter 4?',
    time: '10:42 AM',
    unread: 0,
  },
  {
    id: '3',
    user: 'Alex Thorne',
    verified: false,
    trusted: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqThkcJQwPdtgZuvdVi8PIyMUWOp2ujP_y6qzwk0qmaM3i1qbV0mKWzbFWmuFs21dNaNb5HzoVHFbODDIDIwyFRS_ZsjBpxoT3IiiEfgaEHsGWmGbJMrlVy75gxbz6NtDWC-dxTiK3Jc2JP1VMS3qqghSzaLfk1zQYZMfxWFNK0nLkmUps7G0F9Si3Z9G4nworwPCAQxmzjghLD3f4mt03WDIXZJ1gqLNMgSuQX2IWJPGh1JxbCs-FGxei7dB5h8kTGumMqWebSTQ',
    lastMessage: 'Thanks for meeting up!',
    time: 'Yesterday',
    unread: 0,
  }
];

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconTxt}>🔍</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>College Hub</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJc3xDBmo98RsRK2PTlhNNYj8KmDfYydwoSyCd2mSajdF5MeTnbIY3lr3pLLH6UWm5oNu9vz5WHiSIAfD1Ye5uWDBjNpNm6hTeHddoiTV2BpftQtLWfvJPJ4scMsfvPAXQPJTFBHaEr8h17Zt0tapxPx-x-nBSbLy2rkpEatysogbjNzDKi8hN4PUlWtyjpO_8wtxAecJb6uzPelvnCRJDFHDhlDJDBFKwDbE6ILv1o1gIlLR8R_kt7GEJ-q4Vi3ToRd1GCoterWc' }}
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.screenTitle}>Messages</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={C.onSurfaceVariant}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.chatList}>
          {CHATS.map((chat) => (
            <TouchableOpacity key={chat.id} style={[styles.chatRow, chat.unread > 0 && styles.chatRowActive]}>
              {chat.unread > 0 && <View style={styles.activeIndicator} />}
              
              <View style={styles.avatarContainer}>
                {chat.isGroup ? (
                  <View style={styles.groupAvatar}>
                    <Image source={{ uri: chat.avatar1 }} style={[styles.gAvatar, { top: 0, left: 0 }]} />
                    <Image source={{ uri: chat.avatar2 }} style={[styles.gAvatar, { bottom: 0, right: 0 }]} />
                  </View>
                ) : (
                  <>
                    <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                    {chat.online && <View style={styles.onlineDot} />}
                  </>
                )}
              </View>
              
              <View style={styles.chatInfo}>
                <View style={styles.chatRowTop}>
                  <View style={styles.nameRow}>
                    <Text style={styles.chatName}>{chat.user}</Text>
                    {chat.verified && <View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View>}
                  </View>
                  <Text style={[styles.chatTime, chat.unread > 0 && { color: C.primary }]}>{chat.time}</Text>
                </View>
                
                {chat.trusted && (
                  <View style={styles.trustedBadge}>
                    <Text style={styles.trustedText}>🔥 TRUSTED</Text>
                  </View>
                )}
                
                <Text style={styles.chatMessage} numberOfLines={1}>{chat.lastMessage}</Text>
              </View>
              
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.primaryContainer, letterSpacing: -0.5 },
  profileBtn: { width: 32, height: 32 },
  profileAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: C.primaryContainer },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  iconTxt: { fontSize: 18 },
  
  content: { flex: 1, backgroundColor: C.surfaceLowest },
  
  listHeader: { padding: 20, paddingBottom: 10 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: C.onSurface, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.background, borderRadius: 24, height: 48, paddingHorizontal: 16 },
  searchIcon: { fontSize: 18, color: C.outline, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: C.onSurface },
  
  chatList: { flexGrow: 1, paddingBottom: 40 },
  chatRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.background },
  chatRowActive: { backgroundColor: 'rgba(0,62,199,0.05)' },
  activeIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: C.primary, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: C.success, borderWidth: 2, borderColor: C.surfaceLowest },
  
  groupAvatar: { width: 56, height: 56, position: 'relative' },
  gAvatar: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.surfaceLowest },
  
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: C.onSurface },
  badge: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  chatTime: { fontSize: 12, color: C.outline },
  
  trustedBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(254,107,0,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 4 },
  trustedText: { fontSize: 9, color: '#fe6b00', fontWeight: '700' },
  
  chatMessage: { fontSize: 14, color: C.outline, paddingRight: 20 },
  
  unreadBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  unreadText: { color: 'white', fontSize: 12, fontWeight: '700' },
});

export default ChatScreen;
