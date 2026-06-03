import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Alert } from 'react-native';
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
};

const POSTS = [
  {
    id: '1',
    user: 'Marcus J.',
    verified: true,
    time: '2 hrs ago',
    location: 'Campus North',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAViLw2zwzhUSJFy_UuJo2aYJ6jH0nHZwl68UEM9ORF33nfLAH19HVQpHlczhhLc4GbVb0EA9SrvV1ofwaOZdC4XUlmlxLeYL9dkxym0SHhy-yhy5VZFCbvRgWBhEOnnnLtcdDcN-VL-Oy9lLJl5N75ampRtuW1ZVmRPnMNsNsXHZDQeoA7DQL_yu3FVI-qEJJmO3dbTsTHx9sPlQxmckEOZDTePrXWJpphGC_XeodlyoPCv2RdH8spTg4hsLj2MH9FblEQc66ehu8',
    text: "Just secured tickets for the homecoming game! 🏈 Who's tailgating at Lot B beforehand? Bringing the portable grill.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV3fkLyi3TntElT3C1-rZ1eJ7W2rHHRPZkBic29d8y_UKHs13oPOSNHGpivVfTGpkgflGoD6ddGcqs4qj5Y4ntR-A4d79JUCHWqIqSobEap88Y0dMpCM6x6OBVM9SL0VddGkAkUMjDn3C1R94Ucr96R7mOdduDG4h5Bar5t046cDC6azeESTFGjimypkWNAfZoBox_I-5dqA3o4dvlsJ7vfZZPsxOvhFOEWrSjEz3JkF-zTDhG480Brao46niTatcRSE_PknaX1mU',
    likes: 142,
    comments: 24,
  },
];

const INITIAL_POLL = {
  id: '2',
  user: 'Sarah T.',
  verified: true,
  time: '4 hrs ago',
  location: 'Study Groups',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVoIx5fh3Gu7Zs6vYiqHzNV5y2eIy3sT1_grJV7w_VJzIQnqtZouDs0tfuiGYcx4f9RvYRqEhClfXfcrp2bIBL3KMTObusf0HAyI9p2868Zig64lLDcasuQ8lX5RVQmeSevVOdx5eF2KIzmnok60carWUhL9xLepa-0NXA3i-4xXGPLlERduBtCbLyveUNNuB-wfHb3ZpBRoMbuK-aDdbAlaikb_p9l75HyT_l1zCdrOCKDsCfkT1FHXUrPzPlWtSfL_Yxz00Pa0',
  text: "Midterms next week! Where's the best spot to cram tonight? 📚☕️",
  poll: [
    { label: 'Main Library (Quiet Floor)', percent: 65, active: false },
    { label: 'Student Union', percent: 20, active: false },
    { label: 'Local Coffee Shop', percent: 15, active: false },
  ],
  votes: 342,
  likes: 45,
  comments: 12,
};

const HomeScreen = () => {
  const [poll, setPoll] = useState(INITIAL_POLL.poll);
  const [pollVotes, setPollVotes] = useState(INITIAL_POLL.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (index: number) => {
    if (hasVoted) return; // Prevent multiple votes
    
    // Simple visual update for the demo
    const newPoll = poll.map((opt, i) => {
      if (i === index) {
        return { ...opt, active: true, percent: Math.min(100, opt.percent + 2) };
      }
      return { ...opt, active: false };
    });
    setPoll(newPoll);
    setPollVotes(pollVotes + 1);
    setHasVoted(true);
    Alert.alert('Vote Cast', `You voted for: ${poll[index].label}`);
  };

  const handleNotification = () => Alert.alert('Notifications', 'You have no new notifications right now.');
  const handleSearch = () => Alert.alert('Search', 'Search feature coming soon!');
  const handleFAB = () => Alert.alert('Create Post', 'What\'s on your mind?');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleFAB}>
          <Text style={styles.iconTxt}>➕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>College Hub</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }}
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Post 1: Image */}
        {POSTS.map(post => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardUser}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.userName}>{post.user}</Text>
                    {post.verified && <View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View>}
                  </View>
                  <Text style={styles.timeLocation}>{post.time} • {post.location}</Text>
                </View>
              </View>
              <TouchableOpacity><Text style={styles.moreIcon}>•••</Text></TouchableOpacity>
            </View>
            <Text style={styles.postText}>{post.text}</Text>
            {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionChip}>
                <Text style={styles.actionIcon}>❤️</Text>
                <Text style={styles.actionNumber}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionNumber}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionChip, { marginLeft: 'auto' }]}>
                <Text style={styles.actionIcon}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Post 2: Poll */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardUser}>
              <Image source={{ uri: INITIAL_POLL.avatar }} style={styles.avatar} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.userName}>{INITIAL_POLL.user}</Text>
                  {INITIAL_POLL.verified && <View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View>}
                </View>
                <Text style={styles.timeLocation}>{INITIAL_POLL.time} • {INITIAL_POLL.location}</Text>
              </View>
            </View>
            <TouchableOpacity><Text style={styles.moreIcon}>•••</Text></TouchableOpacity>
          </View>
          <Text style={[styles.postText, { fontWeight: '600' }]}>{INITIAL_POLL.text}</Text>
          
          <View style={styles.pollContainer}>
            {poll.map((opt, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.pollOption} 
                onPress={() => handleVote(i)}
                activeOpacity={hasVoted ? 1 : 0.7}
              >
                <View style={[styles.pollFill, { width: `${opt.percent}%`, backgroundColor: opt.active ? 'rgba(0,62,199,0.1)' : C.surfaceContainer }]} />
                <View style={styles.pollContent}>
                  <Text style={styles.pollLabel}>{opt.label}</Text>
                  <Text style={[styles.pollPercent, opt.active && { color: C.primary, fontWeight: '700' }]}>{opt.percent}%</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.pollFooter}>{pollVotes} votes • 2 hours left</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionChip}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionNumber}>{INITIAL_POLL.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionChip}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionNumber}>{INITIAL_POLL.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Spacer for bottom nav */}
        <View style={{ height: 20 }} />
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
  
  scrollContent: { padding: 16, gap: 24 },
  
  card: {
    backgroundColor: C.surfaceLowest,
    borderRadius: 24,
    padding: 16,
    shadowColor: C.primary,
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 14, fontWeight: '600', color: C.onSurface, marginRight: 4 },
  badge: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  timeLocation: { fontSize: 12, color: C.outline, marginTop: 2 },
  moreIcon: { fontSize: 18, color: C.outline, letterSpacing: 2 },
  
  postText: { fontSize: 16, color: C.onSurface, lineHeight: 24 },
  postImage: { width: '100%', height: 200, borderRadius: 12, marginTop: 12 },
  
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  actionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,62,199,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  actionIcon: { fontSize: 16 },
  actionNumber: { fontSize: 14, fontWeight: '600', color: C.primary },
  
  pollContainer: { marginTop: 16, gap: 8 },
  pollOption: { width: '100%', height: 48, backgroundColor: C.surfaceContainer, borderRadius: 12, overflow: 'hidden', justifyContent: 'center' },
  pollFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  pollContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, alignItems: 'center' },
  pollLabel: { fontSize: 14, fontWeight: '600', color: C.onSurface, zIndex: 10 },
  pollPercent: { fontSize: 14, color: C.onSurfaceVariant, zIndex: 10 },
  pollFooter: { fontSize: 12, color: C.outline, marginTop: 4 },
});

export default HomeScreen;
