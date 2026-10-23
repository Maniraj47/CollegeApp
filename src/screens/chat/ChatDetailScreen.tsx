import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

const C = {
  background: '#fafbfc',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#f0f2f5',
  surfaceHighest: '#e4e6eb',
  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onPrimary: '#ffffff',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  outline: '#737688',
  success: '#22c55e',
};

const ChatDetailScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { chat } = route.params || {
    chat: {
      id: 'default',
      recipientId: 'default',
      user: 'Student',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Student',
      online: true,
    },
  };

  const partnerId = chat.recipientId || chat.id;
  const partnerName = chat.user || chat.name || 'Student';
  const partnerAvatar = chat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${partnerName}`;
  const myUid = user?.uid || '';

  // Listen to Firestore messages between myUid and partnerId
  useEffect(() => {
    if (!myUid || !partnerId) return;

    try {
      const q = query(
        collection(firestore, 'messages'),
        where('participants', 'array-contains', myUid)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const fetched: any[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const currentThreadId = [myUid, partnerId].sort().join('_');
          if (
            data.threadId === currentThreadId ||
            (data.senderId === myUid && data.recipientId === partnerId) ||
            (data.senderId === partnerId && data.recipientId === myUid)
          ) {
            fetched.push({
              id: docSnap.id,
              ...data,
              outgoing: data.senderId === myUid,
            });
          }
        });

        // Sort ascending by time
        fetched.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return timeA - timeB;
        });

        setMessages(fetched);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Error fetching messages in ChatDetailScreen:', err);
    }
  }, [myUid, partnerId]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !myUid || !partnerId) return;

    const myName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
    const myAvatar = userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${myName}`;
    const threadId = [myUid, partnerId].sort().join('_');

    setInputText('');

    // Optimistically add to UI
    setMessages((prev) => [
      ...prev,
      {
        id: 'local_' + Date.now(),
        text,
        time: 'Just now',
        outgoing: true,
      },
    ]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await addDoc(collection(firestore, 'messages'), {
        threadId,
        participants: [myUid, partnerId],
        senderId: myUid,
        senderName: myName,
        senderAvatar: myAvatar,
        recipientId: partnerId,
        recipientName: partnerName,
        recipientAvatar: partnerAvatar,
        text,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Failed to send message:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.iconTxt}>←</Text>
          </Pressable>
          
          <View style={styles.headerProfile}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: partnerAvatar }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.headerName}>{partnerName}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              </View>
              <Text style={styles.onlineText}>● Live Chat</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.infoIcon}><Text style={styles.infoIconTxt}>i</Text></View>
            </Pressable>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll} 
          style={styles.chatArea}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>👋</Text>
              <Text style={styles.emptyTitle}>Start a conversation with {partnerName}</Text>
              <Text style={styles.emptySubtitle}>Say hello to start chatting in real-time!</Text>
            </View>
          ) : (
            messages.map((msg: any) => {
              const timeDisplay = msg.createdAt?.toDate 
                ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : (msg.time || 'Just now');

              return (
                <View key={msg.id} style={[styles.messageRow, msg.outgoing ? styles.messageRowOutgoing : styles.messageRowIncoming]}>
                  {!msg.outgoing && <Image source={{ uri: partnerAvatar }} style={styles.messageAvatar} />}
                  <View style={msg.outgoing ? { alignItems: 'flex-end' } : {}}>
                    <View style={[styles.bubble, msg.outgoing ? styles.bubbleOutgoing : styles.bubbleIncoming]}>
                      <Text style={msg.outgoing ? styles.textOutgoing : styles.textIncoming}>{msg.text}</Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Text style={styles.messageTime}>{timeDisplay}</Text>
                      {msg.outgoing && <Text style={styles.readReceipt}>✓✓</Text>}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput}
              placeholder={`Message ${partnerName.split(' ')[0]}...`}
              placeholderTextColor={C.outline}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
          </View>
          
          <Pressable 
            style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnTxt}>➤</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.surfaceLowest },
  container: { flex: 1, backgroundColor: C.background },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 8, 
    paddingVertical: 10,
    backgroundColor: C.surfaceLowest,
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceContainer,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  iconTxt: { fontSize: 24, color: C.onSurface },
  
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: C.success, borderWidth: 2, borderColor: C.surfaceLowest },
  headerName: { fontSize: 16, fontWeight: '700', color: C.onSurface },
  verifiedBadge: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  verifiedText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  onlineText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  infoIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  infoIconTxt: { fontSize: 16, fontWeight: 'bold', color: C.onSurfaceVariant },

  chatArea: { flex: 1 },
  chatScroll: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.onSurface, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: C.onSurfaceVariant },

  messageRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  messageRowIncoming: { justifyContent: 'flex-start' },
  messageRowOutgoing: { justifyContent: 'flex-end' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  
  bubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  bubbleIncoming: { backgroundColor: C.surfaceLowest, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.surfaceContainer },
  bubbleOutgoing: { backgroundColor: C.primaryContainer, borderBottomRightRadius: 4 },
  
  textIncoming: { fontSize: 14, color: C.onSurface, lineHeight: 20 },
  textOutgoing: { fontSize: 14, color: C.onPrimary, lineHeight: 20 },
  
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 4 },
  messageTime: { fontSize: 11, color: C.outline },
  readReceipt: { fontSize: 11, color: C.primary },

  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: C.surfaceLowest, borderTopWidth: 1, borderTopColor: C.surfaceContainer, gap: 10 },
  inputContainer: { flex: 1, backgroundColor: C.surfaceContainer, borderRadius: 24, paddingHorizontal: 16, height: 46, justifyContent: 'center' },
  textInput: { fontSize: 14, color: C.onSurface, height: 46 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnTxt: { color: 'white', fontSize: 18, marginLeft: 2 },
});

export default ChatDetailScreen;
