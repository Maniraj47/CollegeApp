import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

type Screen = 'home' | 'marketplace' | 'chat' | 'profile';

const POSTS = [
  { id: '1', user: 'Arjun R.', avatar: '🧑', time: '2m ago', text: 'Anyone got CSE301 notes for Unit 3? Final exam next week 😅', likes: 14, comments: 5 },
  { id: '2', user: 'Priya M.', avatar: '👩', time: '15m ago', text: 'The canteen is closed tomorrow due to college fest prep. Plan accordingly!', likes: 32, comments: 8 },
  { id: '3', user: 'Rahul K.', avatar: '🧑‍💻', time: '1h ago', text: 'Just got placed at TCS! Thank you everyone for the support 🙏🎉', likes: 128, comments: 24 },
  { id: '4', user: 'Sneha V.', avatar: '👩‍🎨', time: '2h ago', text: 'Cultural fest registrations are open! Last date is June 5th. DM me for details.', likes: 45, comments: 12 },
];

const LISTINGS = [
  { id: '1', title: 'Data Structures Textbook', price: '₹250', seller: 'Kiran S.', emoji: '📘', condition: 'Good' },
  { id: '2', title: 'Scientific Calculator', price: '₹400', seller: 'Meera T.', emoji: '🔢', condition: 'Like New' },
  { id: '3', title: 'Laptop Bag', price: '₹350', seller: 'Vijay R.', emoji: '🎒', condition: 'Good' },
  { id: '4', title: 'C++ Programming Book', price: '₹150', seller: 'Divya K.', emoji: '📗', condition: 'Fair' },
  { id: '5', title: 'Drawing Kit', price: '₹500', seller: 'Ananya M.', emoji: '🎨', condition: 'New' },
  { id: '6', title: 'Physics Lab Manual', price: '₹80', seller: 'Ravi P.', emoji: '📓', condition: 'Fair' },
];

const CHATS = [
  { id: '1', user: 'Arjun R.', avatar: '🧑', last: "Sure, I'll share the notes tomorrow!", time: '2m', unread: 2 },
  { id: '2', user: 'Priya M.', avatar: '👩', last: 'Are you coming to the fest?', time: '10m', unread: 0 },
  { id: '3', user: 'Kiran S.', avatar: '🧑‍🎓', last: 'The book is available. Come pick it up.', time: '1h', unread: 1 },
  { id: '4', user: 'Sneha V.', avatar: '👩‍🎨', last: 'Registration link sent!', time: '3h', unread: 0 },
];

const C = {
  primary: '#6C47FF',
  primaryLight: '#EEE9FF',
  bg: '#F8F7FF',
  white: '#FFFFFF',
  text: '#1A1A2E',
  sub: '#6B7280',
  border: '#E5E7EB',
  red: '#EF4444',
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={s.loginContainer}>
        <Text style={s.loginLogo}>🎓</Text>
        <Text style={s.loginTitle}>CollegeApp</Text>
        <Text style={s.loginSub}>Your campus, connected.</Text>
        <View style={s.card}>
          <Text style={s.inputLabel}>College Email</Text>
          <TextInput style={s.input} placeholder="you@college.edu" placeholderTextColor={C.sub} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Text style={s.inputLabel}>Password</Text>
          <TextInput style={s.input} placeholder="••••••••" placeholderTextColor={C.sub} value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={s.btnPrimary} onPress={onLogin}>
            <Text style={s.btnPrimaryText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnSecondary} onPress={onLogin}>
            <Text style={s.btnSecondaryText}>🔵  Sign in with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={s.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.homeHeader}>
        <View>
          <Text style={s.homeGreeting}>Good afternoon 👋</Text>
          <Text style={s.homeUser}>Welcome back, MJ!</Text>
        </View>
        <View style={s.notifBadge}><Text style={{ color: C.white, fontSize: 12, fontWeight: '700' }}>3</Text></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.storiesRow}>
        {['Your Story', 'Arjun', 'Priya', 'Rahul', 'Sneha', 'Kiran'].map((name, i) => (
          <View key={i} style={s.storyItem}>
            <View style={[s.storyAvatar, i === 0 && { borderColor: C.primary }]}>
              <Text style={{ fontSize: 22 }}>{i === 0 ? '➕' : '🧑'}</Text>
            </View>
            <Text style={s.storyName}>{name}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        {POSTS.map(post => (
          <View key={post.id} style={s.postCard}>
            <View style={s.postHeader}>
              <View style={s.postAvatar}><Text style={{ fontSize: 20 }}>{post.avatar}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.postUser}>{post.user}</Text>
                <Text style={s.postTime}>{post.time}</Text>
              </View>
              <Text style={{ color: C.sub, fontSize: 18 }}>•••</Text>
            </View>
            <Text style={s.postText}>{post.text}</Text>
            <View style={s.postActions}>
              <TouchableOpacity style={s.actionBtn} onPress={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}>
                <Text style={{ fontSize: 16 }}>{liked[post.id] ? '❤️' : '🤍'}</Text>
                <Text style={[s.actionText, liked[post.id] && { color: C.red }]}>{post.likes + (liked[post.id] ? 1 : 0)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn}>
                <Text style={{ fontSize: 16 }}>💬</Text>
                <Text style={s.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn}>
                <Text style={{ fontSize: 16 }}>↗️</Text>
                <Text style={s.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const MarketplaceScreen = () => {
  const [search, setSearch] = useState('');
  const filtered = LISTINGS.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.marketHeader}>
        <Text style={s.screenTitle}>Marketplace 🛍️</Text>
        <TouchableOpacity style={s.sellBtn}><Text style={s.sellBtnText}>+ Sell</Text></TouchableOpacity>
      </View>
      <View style={s.searchBar}>
        <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
        <TextInput style={{ flex: 1, fontSize: 15, color: C.text }} placeholder="Search items..." placeholderTextColor={C.sub} value={search} onChangeText={setSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 12 }}>
        {['All', 'Books', 'Electronics', 'Stationery', 'Clothes', 'Other'].map((cat, i) => (
          <TouchableOpacity key={i} style={[s.pill, i === 0 && s.pillActive]}>
            <Text style={[s.pillText, i === 0 && s.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.grid}>
        {filtered.map(item => (
          <TouchableOpacity key={item.id} style={s.listingCard}>
            <View style={s.listingEmoji}><Text style={{ fontSize: 36 }}>{item.emoji}</Text></View>
            <Text style={s.listingTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={s.listingPrice}>{item.price}</Text>
            <Text style={s.listingSeller}>by {item.seller}</Text>
            <View style={s.conditionBadge}><Text style={s.conditionText}>{item.condition}</Text></View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const ChatScreen = () => (
  <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
    <View style={s.screenHeader}><Text style={s.screenTitle}>Messages 💬</Text></View>
    <View style={s.searchBar}>
      <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
      <TextInput style={{ flex: 1, fontSize: 15 }} placeholder="Search messages..." placeholderTextColor={C.sub} />
    </View>
    <View style={{ paddingHorizontal: 16 }}>
      {CHATS.map(chat => (
        <TouchableOpacity key={chat.id} style={s.chatRow}>
          <View style={s.chatAvatar}><Text style={{ fontSize: 22 }}>{chat.avatar}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.chatUser}>{chat.user}</Text>
            <Text style={s.chatLast} numberOfLines={1}>{chat.last}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.chatTime}>{chat.time}</Text>
            {chat.unread > 0 && <View style={s.unreadBadge}><Text style={{ color: C.white, fontSize: 10, fontWeight: '700' }}>{chat.unread}</Text></View>}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => (
  <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
    <View style={s.profileHeader}>
      <View style={s.profileAvatar}><Text style={{ fontSize: 44 }}>🧑‍💻</Text></View>
      <Text style={s.profileName}>MJ</Text>
      <Text style={s.profileInfo}>CSE • 3rd Year • Chennai</Text>
      <View style={s.profileStats}>
        <View style={s.statItem}><Text style={s.statNum}>12</Text><Text style={s.statLabel}>Posts</Text></View>
        <View style={s.statDivider} />
        <View style={s.statItem}><Text style={s.statNum}>3</Text><Text style={s.statLabel}>Listings</Text></View>
        <View style={s.statDivider} />
        <View style={s.statItem}><Text style={s.statNum}>248</Text><Text style={s.statLabel}>Friends</Text></View>
      </View>
    </View>
    <View style={{ paddingHorizontal: 16 }}>
      {[{ icon: '✏️', label: 'Edit Profile' }, { icon: '🔔', label: 'Notifications' }, { icon: '🔒', label: 'Privacy' }, { icon: '❓', label: 'Help & Support' }, { icon: '⚙️', label: 'Settings' }].map((item, i) => (
        <TouchableOpacity key={i} style={s.menuRow}>
          <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
          <Text style={s.menuLabel}>{item.label}</Text>
          <Text style={{ color: C.sub, fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.logoutBtn} onPress={onLogout}>
        <Text style={s.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const TABS: { key: Screen; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'marketplace', label: 'Market', icon: '🛍️' },
  { key: 'chat', label: 'Chat', icon: '💬' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Screen>('home');

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'marketplace': return <MarketplaceScreen />;
      case 'chat': return <ChatScreen />;
      case 'profile': return <ProfileScreen onLogout={() => setLoggedIn(false)} />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={s.tabBar}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={s.tabItem} onPress={() => setActiveTab(tab.key)}>
              <Text style={{ fontSize: 22, opacity: active ? 1 : 0.4 }}>{tab.icon}</Text>
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>{tab.label}</Text>
              {active && <View style={s.tabDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  loginContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: C.bg },
  loginLogo: { fontSize: 64, marginBottom: 12 },
  loginTitle: { fontSize: 32, fontWeight: '800', color: C.primary, letterSpacing: -1 },
  loginSub: { fontSize: 15, color: C.sub, marginBottom: 32 },
  card: { width: '100%', backgroundColor: C.white, borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: C.sub, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.border },
  btnPrimary: { backgroundColor: C.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 },
  btnPrimaryText: { color: C.white, fontWeight: '700', fontSize: 16 },
  btnSecondary: { borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 12 },
  btnSecondaryText: { color: C.text, fontWeight: '600', fontSize: 15 },
  link: { color: C.primary, textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: '500' },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  homeGreeting: { fontSize: 13, color: C.sub },
  homeUser: { fontSize: 20, fontWeight: '700', color: C.text },
  notifBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  storiesRow: { paddingLeft: 16, marginBottom: 8 },
  storyItem: { alignItems: 'center', marginRight: 16, width: 60 },
  storyAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: C.border },
  storyName: { fontSize: 11, color: C.sub, marginTop: 4, textAlign: 'center' },
  postCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  postUser: { fontSize: 14, fontWeight: '700', color: C.text },
  postTime: { fontSize: 12, color: C.sub },
  postText: { fontSize: 14, color: C.text, lineHeight: 22, marginBottom: 12 },
  postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, color: C.sub, fontWeight: '500' },
  marketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  screenTitle: { fontSize: 22, fontWeight: '800', color: C.text },
  sellBtn: { backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  sellBtnText: { color: C.white, fontWeight: '700', fontSize: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, marginHorizontal: 16, marginBottom: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.border },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, marginRight: 8, marginBottom: 4 },
  pillActive: { backgroundColor: C.primary, borderColor: C.primary },
  pillText: { fontSize: 13, color: C.sub, fontWeight: '500' },
  pillTextActive: { color: C.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, paddingBottom: 20 },
  listingCard: { width: '47%', backgroundColor: C.white, borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  listingEmoji: { width: 56, height: 56, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  listingTitle: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 4 },
  listingPrice: { fontSize: 16, fontWeight: '800', color: C.primary, marginBottom: 2 },
  listingSeller: { fontSize: 11, color: C.sub, marginBottom: 6 },
  conditionBadge: { backgroundColor: C.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  conditionText: { fontSize: 11, color: C.primary, fontWeight: '600' },
  screenHeader: { padding: 20, paddingBottom: 12 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  chatAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  chatUser: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 3 },
  chatLast: { fontSize: 13, color: C.sub },
  chatTime: { fontSize: 12, color: C.sub, marginBottom: 4 },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { alignItems: 'center', padding: 28, paddingBottom: 20 },
  profileAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: C.primary },
  profileName: { fontSize: 22, fontWeight: '800', color: C.text },
  profileInfo: { fontSize: 14, color: C.sub, marginTop: 4, marginBottom: 20 },
  profileStats: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24, width: '100%', justifyContent: 'space-around', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: C.primary },
  statLabel: { fontSize: 12, color: C.sub, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: C.border },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: C.text },
  logoutBtn: { backgroundColor: '#FEE2E2', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  logoutText: { color: C.red, fontWeight: '700', fontSize: 15 },
  tabBar: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: 4, paddingTop: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabLabel: { fontSize: 11, color: C.sub, marginTop: 3, fontWeight: '500' },
  tabLabelActive: { color: C.primary, fontWeight: '700' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.primary, marginTop: 3 },
});

export default App;
