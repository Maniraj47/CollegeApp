import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../hooks/useAuth';

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

const INITIAL_MESSAGES = [
  { id: '1', text: 'Hey! Are we still on for the study session later?', time: '2:14 PM', outgoing: false },
  { id: '2', text: 'Yes! I booked a room in the library. 📍 Room 304.', time: '2:16 PM', outgoing: true },
  { id: '3', text: "Perfect, see you at 4! I'll bring the snacks 🍿", time: 'Just now', outgoing: false },
];

const ChatDetailScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const { chat } = route.params || {
    chat: {
      user: 'Sarah Jenkins',
      verified: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuFdaYdfEaYJz8AvW0oDQaC5vgM3NTfCj4IWOgXAFZ40Pqr85WUHDz2dfmhhhBFpqmYTMIlB1JMecWgjXZmn74r1crvmnBMyRrAoALeUX0H_lExFJ2cNJXKbATVZeiT7Y4Mu9uw4P9hiEYoX1BPLPCGTH7uF6nZInC_aVh9lyr-MMafctslypOiYFp9XEtCEJ7-szJrcajZ2NdhGFHvST0FqgMvFJSzMaVOGeRmPMGVQwW7WjMOOQ_a9GaI5SZgtzvMXzf_hpghtw',
      online: true,
    }
  };
  const { user } = useAuth();
  const chatId = chat.id || 'default_chat';

  React.useEffect(() => {
    setMessages(INITIAL_MESSAGES);
  }, [chatId, user]);

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
              <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              {chat.online && <View style={styles.onlineDot} />}
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.headerName}>{chat.user || chat.name}</Text>
                {chat.verified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>}
              </View>
              {chat.online && <Text style={styles.onlineText}>Online</Text>}
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.infoIcon}><Text style={styles.infoIconTxt}>i</Text></View>
            </Pressable>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView contentContainerStyle={styles.chatScroll} style={styles.chatArea}>
          {/* Timestamp */}
          <View style={styles.timestampContainer}>
            <View style={styles.timestampPill}>
              <Text style={styles.timestampText}>Today</Text>
            </View>
          </View>

          {messages.map((msg: any) => (
            <View key={msg.id} style={[styles.messageRow, msg.outgoing ? styles.messageRowOutgoing : styles.messageRowIncoming]}>
              {!msg.outgoing && <Image source={{ uri: chat.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKRZlSsme-lB6TGmwXEPErD2kQmja88j0FklGzU4Fzgg8BdaGNb5RRHpnYjci5jJ5G1m9dVv19DcQ66h_Xlp_iEVG4qm0veJIgnCGuLM3noDCVvf4UTtHSquHfJTd5aRMbUms3M4Hviya-Asgo4q9QbnZiDFtNDJEYc_bE-g2ZcHyFK9gKyH3UmsUppizhW7fk_Akf4_UqYA3bvEjJmveplDBSDNzMDrruXjxJDYRg6UoM9TgwYSzAXAQW-NmZZ17BXqTEGdSDjLE' }} style={styles.messageAvatar} />}
              <View style={msg.outgoing ? { alignItems: 'flex-end' } : {}}>
                <View style={[styles.bubble, msg.outgoing ? styles.bubbleOutgoing : styles.bubbleIncoming]}>
                  <Text style={msg.outgoing ? styles.textOutgoing : styles.textIncoming}>{msg.text}</Text>
                </View>
                {msg.outgoing ? (
                  <View style={styles.outgoingTimeRow}>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                    <Text style={styles.readReceipt}>✓✓</Text>
                  </View>
                ) : (
                  <Text style={styles.messageTime}>{msg.time}</Text>
                )}
              </View>
            </View>
          ))}

        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <Pressable style={styles.attachBtn}>
            <Text style={styles.attachBtnTxt}>+</Text>
          </Pressable>
          
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput}
              placeholder="Message..."
              placeholderTextColor={C.outline}
              multiline
              value={inputText}
              onChangeText={setInputText}
            />
            <Pressable style={styles.emojiBtn}>
              <Text style={styles.emojiTxt}>😊</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.sendBtn} 
            onPress={async () => {
              if (inputText.trim()) {
                const text = inputText;
                setInputText('');
                try {
                  setMessages([...messages, { id: Date.now().toString(), text, time: 'Just now', outgoing: true }]);
                } catch (e) {
                  setMessages([...messages, { id: Date.now().toString(), text, time: 'Just now', outgoing: true }]);
                }
              }
            }}
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
  infoIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.onSurfaceVariant, justifyContent: 'center', alignItems: 'center' },
  infoIconTxt: { color: C.surfaceLowest, fontSize: 14, fontWeight: '700', fontStyle: 'italic' },
  
  chatArea: { flex: 1, paddingHorizontal: 16 },
  chatScroll: { paddingVertical: 20, gap: 16 },
  
  timestampContainer: { alignItems: 'center', marginBottom: 12 },
  timestampPill: { backgroundColor: C.surfaceContainer, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  timestampText: { fontSize: 12, color: C.outline, fontWeight: '600' },
  
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  messageRowIncoming: { justifyContent: 'flex-start' },
  messageRowOutgoing: { justifyContent: 'flex-end' },
  
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginBottom: 20 }, // mb=20 to align with bottom of bubble before time
  
  bubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleIncoming: { backgroundColor: C.surfaceContainer, borderBottomLeftRadius: 4 },
  bubbleOutgoing: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  
  textIncoming: { fontSize: 16, color: C.onSurface, lineHeight: 22 },
  textOutgoing: { fontSize: 16, color: C.onPrimary, lineHeight: 22 },
  
  messageTime: { fontSize: 11, color: C.outline, marginTop: 4, marginHorizontal: 4 },
  outgoingTimeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  readReceipt: { fontSize: 11, color: C.primary, fontWeight: '800', marginLeft: 4 },
  
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, paddingBottom: 24, backgroundColor: C.surfaceLowest, gap: 12, borderTopWidth: 1, borderTopColor: C.surfaceContainer },
  
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8ecf4', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  attachBtnTxt: { fontSize: 24, color: C.primaryContainer, fontWeight: '500', marginTop: -2 },
  
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, minHeight: 48 },
  textInput: { flex: 1, fontSize: 16, color: C.onSurface, maxHeight: 100, paddingTop: 6, paddingBottom: 6 },
  emojiBtn: { marginLeft: 8 },
  emojiTxt: { fontSize: 20 },
  
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', paddingLeft: 4, marginBottom: 0 },
  sendBtnTxt: { fontSize: 20, color: C.onPrimary },
});

export default ChatDetailScreen;
