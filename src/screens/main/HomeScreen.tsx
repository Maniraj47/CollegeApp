import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, Alert, Share, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';

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
  const navigation = useNavigation<any>();
  const [poll, setPoll] = useState(INITIAL_POLL.poll);
  const [pollVotes, setPollVotes] = useState(INITIAL_POLL.votes);
  const [hasVoted, setHasVoted] = useState(false);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [pollLikes, setPollLikes] = useState(INITIAL_POLL.likes);
  const [pollCommentCount, setPollCommentCount] = useState(INITIAL_POLL.comments);

  // Fetch posts from Firestore
  React.useEffect(() => {
    setPosts(POSTS);
  }, []);

  // Comments modal state
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  
  // Options modal state
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [newCommentText, setNewCommentText] = useState('');
  const [postComments, setPostComments] = useState<{ [key: string]: { id: string, text: string, user: string }[] }>({
    '1': [{ id: 'c1', text: 'Tailgating at Lot B sounds great!', user: 'David' }, { id: 'c2', text: 'See you there', user: 'Alex' }],
    '2': [{ id: 'c3', text: 'Library is packed rn', user: 'Charlie' }]
  });

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

  const handleLike = (id: string, isPoll: boolean = false) => {
    if (isPoll) {
       setPollLikes(prev => prev + 1);
    } else {
       setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this post on College Hub!',
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleComment = (id: string) => {
    setCurrentPostId(id);
    setIsCommentsVisible(true);
  };

  const submitComment = () => {
    if (!newCommentText.trim() || !currentPostId) return;
    const newComment = { id: Date.now().toString(), text: newCommentText, user: 'Me' };
    setPostComments({
      ...postComments,
      [currentPostId]: [...(postComments[currentPostId] || []), newComment]
    });
    
    if (currentPostId === INITIAL_POLL.id) {
       setPollCommentCount(prev => prev + 1);
    } else {
       setPosts(posts.map(p => p.id === currentPostId ? { ...p, comments: p.comments + 1 } : p));
    }
    
    setNewCommentText('');
  };

  const handleNotification = () => Alert.alert('Notifications', 'You have no new notifications right now.');
  const handleSearch = () => Alert.alert('Search', 'Search feature coming soon!');
  const handleFAB = () => navigation.navigate('CreatePost');

  const handleMoreOptions = (id: string) => {
    setSelectedPostId(id);
    setIsOptionsVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={handleFAB}>
          <Text style={styles.iconTxt}>➕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>College Hub</Text>
        <Pressable style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }}
            style={styles.profileAvatar}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Post 1: Image */}
        {posts.map(post => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardUser}>
                <Image source={{ uri: post.authorAvatar || post.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }} style={styles.avatar} />
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.userName}>{post.authorName || post.user || 'Student'}</Text>
                    {post.verified && <View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View>}
                  </View>
                  <Text style={styles.timeLocation}>{post.time || 'Just now'} • {post.location || 'Campus'}</Text>
                </View>
              </View>
              <Pressable onPress={() => handleMoreOptions(post.id)}><Text style={styles.moreIcon}>•••</Text></Pressable>
            </View>
            {post.text ? <Text style={styles.postText}>{post.text}</Text> : null}
            {post.image || post.imageUrl ? <Image source={{ uri: post.image || post.imageUrl }} style={styles.postImage} /> : null}
            <View style={styles.actions}>
              <Pressable style={styles.actionChip} onPress={() => handleLike(post.id)}>
                <Text style={styles.actionIcon}>❤️</Text>
                <Text style={styles.actionNumber}>{post.likes}</Text>
              </Pressable>
              <Pressable style={styles.actionChip} onPress={() => handleComment(post.id)}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionNumber}>{post.comments}</Text>
              </Pressable>
              <Pressable style={[styles.actionChip, { marginLeft: 'auto' }]} onPress={handleShare}>
                <Text style={styles.actionIcon}>↗️</Text>
              </Pressable>
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
            <Pressable onPress={() => handleMoreOptions(INITIAL_POLL.id)}><Text style={styles.moreIcon}>•••</Text></Pressable>
          </View>
          <Text style={[styles.postText, { fontWeight: '600' }]}>{INITIAL_POLL.text}</Text>
          
          <View style={styles.pollContainer}>
            {poll.map((opt, i) => (
              <Pressable 
                key={i} 
                style={({ pressed }) => [styles.pollOption, pressed && !hasVoted && { opacity: 0.7 }]} 
                onPress={() => handleVote(i)}
                disabled={hasVoted}
              >
                <View style={[styles.pollFill, { width: `${opt.percent}%`, backgroundColor: opt.active ? 'rgba(0,62,199,0.1)' : C.surfaceContainer }]} />
                <View style={styles.pollContent}>
                  <Text style={styles.pollLabel}>{opt.label}</Text>
                  <Text style={[styles.pollPercent, opt.active && { color: C.primary, fontWeight: '700' }]}>{opt.percent}%</Text>
                </View>
              </Pressable>
            ))}
            <Text style={styles.pollFooter}>{pollVotes} votes • 2 hours left</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.actionChip} onPress={() => handleLike(INITIAL_POLL.id, true)}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionNumber}>{pollLikes}</Text>
            </Pressable>
            <Pressable style={styles.actionChip} onPress={() => handleComment(INITIAL_POLL.id)}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionNumber}>{pollCommentCount}</Text>
            </Pressable>
            <Pressable style={[styles.actionChip, { marginLeft: 'auto' }]} onPress={handleShare}>
              <Text style={styles.actionIcon}>↗️</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Spacer for bottom nav */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Comments Modal */}
      <Modal
        visible={isCommentsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCommentsVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <Pressable onPress={() => setIsCommentsVisible(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.commentsList}>
              {(currentPostId && postComments[currentPostId]) ? (
                postComments[currentPostId].map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noCommentsTxt}>No comments yet. Be the first!</Text>
              )}
            </ScrollView>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <Pressable onPress={submitComment} style={styles.submitCommentBtn}>
                <Text style={styles.submitCommentTxt}>Post</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Post Options Modal */}
      <Modal
        visible={isOptionsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOptionsVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setIsOptionsVisible(false)}>
          <View style={styles.optionsContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Options</Text>
            </View>
            <Pressable style={styles.optionItem} onPress={() => { Alert.alert('Saved', 'Post saved to your bookmarks.'); setIsOptionsVisible(false); }}>
              <Text style={styles.optionText}>🔖 Save Post</Text>
            </Pressable>
            <Pressable style={styles.optionItem} onPress={() => { Alert.alert('Copied', 'Link copied to clipboard.'); setIsOptionsVisible(false); }}>
              <Text style={styles.optionText}>🔗 Copy Link</Text>
            </Pressable>
            <Pressable style={styles.optionItem} onPress={() => { Alert.alert('Not Interested', 'We will show fewer posts like this.'); setIsOptionsVisible(false); }}>
              <Text style={styles.optionText}>🚫 Not interested</Text>
            </Pressable>
            <Pressable style={styles.optionItem} onPress={() => { Alert.alert('Reported', 'Thank you for reporting this post.'); setIsOptionsVisible(false); }}>
              <Text style={[styles.optionText, { color: '#d93025' }]}>🚩 Report</Text>
            </Pressable>
            <Pressable style={styles.cancelOptionBtn} onPress={() => setIsOptionsVisible(false)}>
              <Text style={styles.cancelOptionTxt}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  
  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: C.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, maxHeight: '80%', minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface },
  closeBtn: { fontSize: 16, color: C.primary },
  commentsList: { marginTop: 16, flex: 1 },
  commentItem: { marginBottom: 12 },
  commentUser: { fontSize: 14, fontWeight: '600', color: C.onSurface },
  commentText: { fontSize: 14, color: C.onSurfaceVariant, marginTop: 4 },
  noCommentsTxt: { textAlign: 'center', color: C.outline, marginTop: 32 },
  commentInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, borderTopWidth: 0.5, borderTopColor: '#e5e7eb', paddingTop: 16 },
  commentInput: { flex: 1, backgroundColor: C.surfaceContainer, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: C.onSurface },
  submitCommentBtn: { marginLeft: 12, backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  submitCommentTxt: { color: 'white', fontWeight: '600' },
  
  optionsContent: { backgroundColor: C.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 32 },
  optionItem: { paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  optionText: { fontSize: 16, color: C.onSurface, fontWeight: '500' },
  cancelOptionBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12, backgroundColor: C.surfaceContainer, borderRadius: 12 },
  cancelOptionTxt: { fontSize: 16, fontWeight: '600', color: C.onSurface },
});

export default HomeScreen;
