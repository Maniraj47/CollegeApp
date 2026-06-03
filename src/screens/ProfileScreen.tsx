import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#f7f9fb',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#eceef0',
  surfaceHigh: '#e6e8ea',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  primaryFixedDim: '#b7c4ff',
  tertiaryFixedDim: '#75d1ff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  secondaryContainer: '#fe6b00',
};

const ProfileScreen = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconTxt}>⚙️</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>College Hub</Text>
        <TouchableOpacity style={styles.profileBtnSmall}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtj90Jg6V5CBvp3HVT4domW5VsKCEPoff1nIja2SjBoQuyQhDT1AxNxNGD6-xP6HaplHbS8pVQI19gZdMuPZ93q9Ts1lrTpMa7bqT6pvobHiExb_qm9VMceEcmAhrJBtV9WuapN4kDrVuehytoRds3GUFqtvjsHpdord3NtuX3cg__F6p1O_MMgS8BM6wxsH_OUILS0VMXzQPK6fBtGyV1W0_HHSiL74NTzYdpknbAdMLs5RxmrA5HVru7vfAKIFy3hmU3MPQA_0A' }} style={styles.profileAvatarSmall} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyoIK8IEET9fzTY-HHlIvzHiSH9UX-eiEHXK8mMpO3L2CH1sFKfiK0g5QqgC5m26CmhZa2j9peK70BgHRDHHePqAfTF8hhCE03RwoP7yapx0AOLBv1LggEPYUFkMAX5hev9HfYVnCrEYV6c7gfcLCiyUT-A3jgRyGaiQBL3FNb4LFfyR2i_qYdvtnkAVhn9w2tL388wJ5tdKzwghCN-XFxAOlOBVBFVYIm2PZ3nJI6O-f_VFv1j6AwComsh47b6ZPqeZgeMr6i1EQ' }}
            style={styles.coverPhoto}
          />
          <View style={styles.coverOverlay} />
        </View>
        
        {/* Profile Info Overlay */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.mainAvatarContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJKH8S8PhyfHznY713FY-f3JdvdAdCzVjl6QCKQDYGuV-zQ1B-OKun0bRoRJ1oDanmAijZeIv-jmwT7skij0Px6sehtwm4F16BUzkMB1oL6mcxnC7e1iCBJ9czlvWAIZvLXvPQYSBBp1-FCKlhvL1VPhqzHTyrZBXxmeATnz8Yau_CKWTZFwbYO-oWihJ3gQ8nxiAK-6RCfTMHWKeIu6FKrdponQRacoPlEfQFXRBkfY58vstUf1QZimd4cMJh9VFeq6uXsH1xU-I' }}
                style={styles.mainAvatar}
              />
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit Profile</Text></TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn}><Text style={styles.shareBtnIcon}>↗️</Text></TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.profileName}>Sarah Jenkins</Text>
            <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>
          </View>
          
          <Text style={styles.profileSub}>Computer Science • Junior • Class of '25</Text>
          <Text style={styles.bio}>Building apps and drinking too much matcha. Exploring the intersection of UI/UX and machine learning. Always down for a campus coffee chat! ☕️✨</Text>
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statNum}>342</Text>
              <Text style={styles.statLabel}>FOLLOWERS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statNum}>184</Text>
              <Text style={styles.statLabel}>FOLLOWING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: C.secondaryContainer }]}>12 📦</Text>
              <Text style={styles.statLabel}>TRADES</Text>
            </View>
          </View>
          
          <View style={styles.bentoBottomRow}>
            {/* Wallet */}
            <TouchableOpacity style={styles.walletCard}>
              <Text style={styles.walletIcon}>💳</Text>
              <View>
                <Text style={styles.walletLabel}>Campus Wallet</Text>
                <Text style={styles.walletAmount}>$45.50</Text>
              </View>
            </TouchableOpacity>
            
            {/* Settings */}
            <TouchableOpacity style={styles.settingsCard}>
              <Text style={styles.settingsIcon}>⚙️</Text>
              <View>
                <Text style={styles.settingsTitle}>Preferences</Text>
                <Text style={styles.settingsSub}>Account & Security</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Activity Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Active Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Saved Items</Text>
          </TouchableOpacity>
        </View>

        {/* Post */}
        <View style={styles.postCard}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0aF1s1rLqxMC_IqWIt0qPU5RLwgYTb2VQAzqsgUDwBFg_3CE60xKgURme5K8zlYu8D4q7HlAAEvUlUDn6nxTtmrNExd4kCT79W3oX9IiT0HxZDNx5ezvjq7nWUkWMv_7MucHYCg7nYn5L5jEoTZlZfhFD2eZMWL-6XZCmaKVi3wCmj8KF7R3Ir3IqaNOARTL3Af0pOmUUzDOPkEGUhaNN_7TE_JAGxNCAjAw369nPcpRVbgvZv14QAQjbkJ3qducrkCVrV2xm3cg' }}
            style={styles.postImage}
          />
          <View style={styles.pricePill}><Text style={styles.priceText}>$450</Text></View>
          
          <View style={styles.postContent}>
            <View style={styles.postHeader}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1dyIRt7c2kjVm7DMi6PLwXhl7Vk4N7rA8iHizCOqEMU0edtLY6tar0Phr60XmkKm53gmLTC4wCebBUCgsZo8xPjZDJZZhfDRYrLL_kXFkoO_xm5zSSRE0-SxkJ1mcqbm8b7BBUUqPD_w1tLWaGZbCLc-j5XL6h5QSeVUvTsVK3LpJEa-0wSeJ8aTNQhClpauRcPPolhDCJQ7e8w2tBLacT-ImWPKAItUbJAD-2USkloAMpew7Mco7Gnxw6NmIgk5bmxe-rJfB9D8' }}
                style={styles.postAvatar}
              />
              <View style={styles.postMeta}>
                <Text style={styles.postUser}>Sarah Jenkins</Text>
                <Text style={styles.postTime}>Listed 2 hours ago</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>FOR SALE</Text></View>
            </View>
            
            <Text style={styles.postTitle}>iPad Pro 11" (2022) + Pencil</Text>
            <Text style={styles.postDesc}>Upgrading to a MacBook, so selling my iPad. Used gently for note-taking in lectures. Comes with the original box and a protective case. Escrow preferred!</Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.buyBtn}>
                <Text style={styles.buyBtnText}>🛒 Buy Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.msgBtn}>
                <Text style={styles.msgBtnText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Added extra margin at the bottom */}
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
  profileBtnSmall: { width: 32, height: 32 },
  profileAvatarSmall: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: C.primaryContainer },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  iconTxt: { fontSize: 18 },
  
  content: { flexGrow: 1, paddingBottom: 20 },
  
  coverPhotoContainer: { width: '100%', height: 160, backgroundColor: C.primaryFixedDim, overflow: 'hidden' },
  coverPhoto: { width: '100%', height: '100%', opacity: 0.6 },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,82,255,0.1)' },
  
  profileSection: { paddingHorizontal: 16, marginTop: -40, zIndex: 10 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  mainAvatarContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.background, padding: 4 },
  mainAvatar: { width: '100%', height: '100%', borderRadius: 44 },
  
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  editBtn: { backgroundColor: C.surfaceContainer, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  editBtnText: { color: C.onSurface, fontWeight: '600', fontSize: 14 },
  shareBtn: { backgroundColor: C.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  shareBtnIcon: { color: 'white', fontSize: 18 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  profileName: { fontSize: 24, fontWeight: '700', color: C.onSurface },
  verifiedBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  verifiedText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  
  profileSub: { fontSize: 14, color: C.onSurfaceVariant, fontWeight: '500', marginBottom: 12 },
  bio: { fontSize: 15, color: C.onSurfaceVariant, lineHeight: 22 },
  
  bentoGrid: { padding: 16, gap: 16, marginTop: 8 },
  statsCard: { flexDirection: 'row', backgroundColor: C.surfaceLowest, borderRadius: 16, paddingVertical: 20, borderWidth: 1, borderColor: C.surfaceContainer },
  statCol: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statNum: { fontSize: 24, fontWeight: '800', color: C.onSurface, marginBottom: 4 },
  statLabel: { fontSize: 10, color: C.outline, fontWeight: '700' },
  statDivider: { width: 1, height: 32, backgroundColor: C.surfaceContainer },
  
  bentoBottomRow: { flexDirection: 'row', gap: 16 },
  walletCard: { flex: 1, backgroundColor: C.primary, borderRadius: 16, padding: 16, justifyContent: 'space-between', height: 120 },
  walletIcon: { fontSize: 24, color: 'white' },
  walletLabel: { fontSize: 10, color: C.primaryFixedDim, fontWeight: '700', marginBottom: 4 },
  walletAmount: { fontSize: 24, fontWeight: '800', color: 'white' },
  
  settingsCard: { flex: 1, backgroundColor: C.surfaceContainer, borderRadius: 16, padding: 16, justifyContent: 'space-between', height: 120 },
  settingsIcon: { fontSize: 24, color: C.onSurfaceVariant },
  settingsTitle: { fontSize: 16, fontWeight: '600', color: C.onSurface },
  settingsSub: { fontSize: 12, color: C.outline, marginTop: 4 },
  
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.surfaceHigh, marginBottom: 20 },
  tab: { paddingVertical: 12, paddingHorizontal: 4, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: C.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: C.outline },
  activeTabText: { color: C.primary },
  
  postCard: { marginHorizontal: 16, backgroundColor: C.surfaceLowest, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.surfaceContainer },
  postImage: { width: '100%', height: 200 },
  pricePill: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  priceText: { fontSize: 16, fontWeight: '800', color: C.onSurface },
  
  postContent: { padding: 16 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  postAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  postMeta: { flex: 1 },
  postUser: { fontSize: 14, fontWeight: '700', color: C.onSurface },
  postTime: { fontSize: 12, color: C.outline },
  statusBadge: { backgroundColor: 'rgba(254,107,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 10, color: C.secondaryContainer, fontWeight: '800' },
  
  postTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface, marginBottom: 8 },
  postDesc: { fontSize: 14, color: C.onSurfaceVariant, lineHeight: 20, marginBottom: 16 },
  
  postActions: { flexDirection: 'row', gap: 12 },
  buyBtn: { backgroundColor: 'rgba(0,62,199,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  buyBtnText: { color: C.primary, fontWeight: '700', fontSize: 14 },
  msgBtn: { backgroundColor: C.surfaceContainer, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  msgBtnText: { color: C.onSurface, fontWeight: '700', fontSize: 14 },
});

export default ProfileScreen;
