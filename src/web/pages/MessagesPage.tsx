import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { REAL_FIREBASE_USERS, RealUser } from '../../constants/realUsers';

interface MessagesPageProps {
  searchQuery: string;
  user: any;
  userData: any;
  activeChatTarget?: { userId: string; userName: string; userAvatar?: string } | null;
  onSwitchUser?: (user: any) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  searchQuery,
  user,
  userData,
  activeChatTarget,
  onSwitchUser,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [campusUsers, setCampusUsers] = useState<RealUser[]>(REAL_FIREBASE_USERS);
  const [localSearch, setLocalSearch] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current user ID
  const myUid = user?.uid || user?.id || '';

  // Get other campus members (excluding currently logged-in user)
  const otherUsers = campusUsers.filter(
    (u) => (u.uid || u.id) !== myUid && u.email !== user?.email
  );

  // Active chat partner state
  const [activePartnerId, setActivePartnerId] = useState<string | null>(
    activeChatTarget?.userId || (otherUsers.length > 0 ? (otherUsers[0].uid || otherUsers[0].id || null) : null)
  );
  const [activePartnerName, setActivePartnerName] = useState<string>(
    activeChatTarget?.userName || (otherUsers.length > 0 ? (otherUsers[0].displayName || otherUsers[0].name || 'Student') : '')
  );
  const [activePartnerAvatar, setActivePartnerAvatar] = useState<string>(
    activeChatTarget?.userAvatar || (otherUsers.length > 0 ? (otherUsers[0].photoURL || otherUsers[0].photoUrl || '') : '')
  );

  // Auto scroll to bottom of messages stream
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activePartnerId]);

  // Sync registered users from Firestore users collection
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(firestore, 'users'),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({
              uid: d.id,
              id: d.id,
              displayName: d.data().displayName || d.data().name || 'Student',
              name: d.data().displayName || d.data().name || 'Student',
              email: d.data().email || '',
              photoURL: d.data().photoUrl || d.data().photoURL || '',
              photoUrl: d.data().photoUrl || d.data().photoURL || '',
              department: d.data().department || 'General Studies',
              year: d.data().year || 'Student',
              regNo: d.data().regNo || '',
              role: d.data().role || 'student',
            })) as RealUser[];

            // Merge with REAL_FIREBASE_USERS to guarantee no real accounts are dropped
            const merged = [...REAL_FIREBASE_USERS];
            fetched.forEach((f) => {
              const idx = merged.findIndex((m) => m.uid === f.uid);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...f };
              } else {
                merged.push(f);
              }
            });
            setCampusUsers(merged);
          }
        },
        (err) => {
          console.warn('[Messages] Users snapshot fallback:', err);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('[Messages] Error initializing users listener:', err);
    }
  }, []);

  // Update active partner when activeChatTarget prop changes
  useEffect(() => {
    if (activeChatTarget?.userId) {
      setActivePartnerId(activeChatTarget.userId);
      setActivePartnerName(activeChatTarget.userName);
      setActivePartnerAvatar(activeChatTarget.userAvatar || '');
    }
  }, [activeChatTarget]);

  // Ensure an active partner is chosen if none selected yet
  useEffect(() => {
    if (!activePartnerId && otherUsers.length > 0) {
      const first = otherUsers[0];
      setActivePartnerId(first.uid || first.id || null);
      setActivePartnerName(first.displayName || first.name || 'Student');
      setActivePartnerAvatar(first.photoURL || first.photoUrl || '');
    }
  }, [otherUsers, activePartnerId]);

  // Real-time Firestore sync of messages involving current user
  useEffect(() => {
    if (!myUid) {
      setLoadingMessages(false);
      return;
    }

    try {
      // NOTE: We omit orderBy('createdAt', 'asc') in Firestore query to avoid requiring composite indexes!
      const q = query(
        collection(firestore, 'messages'),
        where('participants', 'array-contains', myUid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched: any[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as any),
          }));

          // Sort ascending in memory by createdAt
          fetched.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a._localTimestamp || 0));
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b._localTimestamp || 0));
            return timeA - timeB;
          });

          setMessages(fetched);
          setLoadingMessages(false);
        },
        (err) => {
          console.warn('[Messages] Firestore messages query notice:', err);
          setLoadingMessages(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('[Messages] Error initializing messages query:', e);
      setLoadingMessages(false);
    }
  }, [myUid]);

  // Map messages to conversation channels
  const conversationsMap = new Map<string, { id: string; name: string; avatar: string; lastMessage: string; time: string }>();

  messages.forEach((msg) => {
    const otherId = msg.senderId === myUid ? msg.recipientId : msg.senderId;
    const otherName = msg.senderId === myUid ? msg.recipientName : msg.senderName;
    const otherAvatar = msg.senderId === myUid ? msg.recipientAvatar : msg.senderAvatar;

    if (otherId) {
      const dateStr = msg.createdAt?.toDate
        ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Recent';
      conversationsMap.set(otherId, {
        id: otherId,
        name: otherName || 'Student',
        avatar: otherAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${otherName || 'User'}`,
        lastMessage: msg.text || '',
        time: dateStr,
      });
    }
  });

  const activeConversations = Array.from(conversationsMap.values());

  // Search filter
  const effectiveSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredConversations = activeConversations.filter((c) =>
    c.name.toLowerCase().includes(effectiveSearch) ||
    c.lastMessage.toLowerCase().includes(effectiveSearch)
  );

  const filteredContacts = otherUsers.filter((u) => {
    const nameMatch = (u.displayName || u.name || '').toLowerCase().includes(effectiveSearch);
    const deptMatch = (u.department || '').toLowerCase().includes(effectiveSearch);
    const emailMatch = (u.email || '').toLowerCase().includes(effectiveSearch);
    return nameMatch || deptMatch || emailMatch;
  });

  // Filter messages for active conversation
  const currentChatMessages = messages.filter((msg) => {
    if (!activePartnerId) return false;
    return (
      (msg.senderId === myUid && msg.recipientId === activePartnerId) ||
      (msg.senderId === activePartnerId && msg.recipientId === myUid)
    );
  });

  const selectPartner = (id: string, name: string, avatar?: string) => {
    setActivePartnerId(id);
    setActivePartnerName(name);
    setActivePartnerAvatar(avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText !== undefined ? customText : inputVal).trim();
    if (!textToSend || !activePartnerId || !myUid) return;

    const myName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
    const myAvatar = userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${myName}`;
    const threadId = [myUid, activePartnerId].sort().join('_');

    setInputVal('');
    setIsSending(true);

    const optimisticMsg = {
      id: 'local_' + Date.now(),
      threadId,
      participants: [myUid, activePartnerId],
      senderId: myUid,
      senderName: myName,
      senderAvatar: myAvatar,
      recipientId: activePartnerId,
      recipientName: activePartnerName,
      recipientAvatar: activePartnerAvatar,
      text: textToSend,
      _localTimestamp: Date.now(),
      createdAt: { toDate: () => new Date() },
    };

    // Optimistically show message immediately
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await addDoc(collection(firestore, 'messages'), {
        threadId,
        participants: [myUid, activePartnerId],
        senderId: myUid,
        senderName: myName,
        senderAvatar: myAvatar,
        recipientId: activePartnerId,
        recipientName: activePartnerName,
        recipientAvatar: activePartnerAvatar,
        text: textToSend,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.warn('[Messages] Firestore addDoc notice:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Find partner's info object
  const partnerUser = campusUsers.find((u) => (u.uid || u.id) === activePartnerId);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Account Switching Banner for Seamless Testing */}
      {otherUsers.length > 0 && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e3a8a' }}>
            <span>👤</span>
            <span>
              Logged in as <b>{userData?.displayName || user?.displayName || 'User'}</b> ({userData?.department || 'Student'})
            </span>
          </div>

          {onSwitchUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600 }}>Test instant reply:</span>
              {otherUsers.map((ou) => (
                <button
                  key={ou.uid}
                  type="button"
                  onClick={() => onSwitchUser(ou)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #3b82f6',
                    color: '#2563eb',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                >
                  Switch to {ou.displayName} ⇄
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main 2-Column Messaging Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '20px',
        height: 'calc(100vh - var(--header-height) - 100px)',
        minHeight: '600px',
        overflow: 'hidden',
      }}>
        
        {/* Left Column: Direct Chats & Campus Directory */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          
          {/* Header & Local Search */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Messages
              </h3>
              <span className="badge badge-primary">
                {otherUsers.length} Students Online
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search students or chats..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  paddingLeft: '34px',
                  paddingRight: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Scrollable Channels & Contacts */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
            
            {/* Active Conversations Section (if any messages exchanged) */}
            {filteredConversations.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  padding: '4px 18px 8px 18px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.6px',
                }}>
                  Active Chats ({filteredConversations.length})
                </div>
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activePartnerId;
                  return (
                    <div
                      key={'conv_' + conv.id}
                      onClick={() => selectPartner(conv.id, conv.name, conv.avatar)}
                      style={{
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                            {conv.time}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px',
                        }}>
                          {conv.lastMessage}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Campus Students Contacts Section */}
            <div>
              <div style={{
                padding: '4px 18px 8px 18px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>Campus Peers ({filteredContacts.length})</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Tap to Chat</span>
              </div>

              {filteredContacts.length === 0 ? (
                <div style={{ padding: '20px 18px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No students found matching "{effectiveSearch}"
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const contactId = contact.uid || contact.id || '';
                  const isSelected = contactId === activePartnerId;
                  const name = contact.displayName || contact.name || 'Student';
                  const avatar = contact.photoURL || contact.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

                  return (
                    <div
                      key={'contact_' + contactId}
                      onClick={() => selectPartner(contactId, name, avatar)}
                      style={{
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={avatar}
                          alt={name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          border: '2px solid #ffffff',
                        }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {name}
                          </span>
                          <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 700 }}>✓</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {contact.department || 'Student'} • {contact.year || 'College'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectPartner(contactId, name, avatar);
                        }}
                        style={{
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-main)',
                          color: isSelected ? '#ffffff' : 'var(--primary)',
                          border: '1px solid var(--border-color)',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Chat 💬
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Live Chat Room */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {activePartnerId ? (
            <>
              {/* Active Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={activePartnerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${activePartnerName}`}
                      alt={activePartnerName}
                      style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '1px',
                      right: '1px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      border: '2px solid #ffffff',
                    }} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {activePartnerName}
                      </h3>
                      <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 8px' }}>
                        Active Campus Student
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {partnerUser?.department || 'Student'} • {partnerUser?.email || ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                    Live Firestore Sync
                  </span>
                </div>
              </div>

              {/* Messages Stream */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#f8fafc',
              }}>
                {loadingMessages ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading messages...
                  </div>
                ) : currentChatMessages.length === 0 ? (
                  <div style={{
                    margin: 'auto',
                    textAlign: 'center',
                    maxWidth: '460px',
                    padding: '32px 24px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ fontSize: '42px', marginBottom: '10px' }}>👋</div>
                    <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                      Start your conversation with {activePartnerName}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                      {activePartnerName} is registered in <b>{partnerUser?.department || 'College Hub'}</b>. Say hello, discuss assignments, or ask about campus listings!
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Quick Icebreakers (Click to Send):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {[
                          `👋 Hi ${activePartnerName.split(' ')[0]}! Are you free to chat?`,
                          `📚 Hey! Do you have the study notes?`,
                          `🛍️ Hi! Interested in campus marketplace listings!`,
                        ].map((icebreaker) => (
                          <button
                            key={icebreaker}
                            type="button"
                            onClick={() => handleSendMessage(undefined, icebreaker)}
                            style={{
                              backgroundColor: 'var(--bg-main)',
                              border: '1px solid var(--border-color)',
                              padding: '8px 14px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '12px',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary)';
                              e.currentTarget.style.color = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-color)';
                              e.currentTarget.style.color = 'var(--text-main)';
                            }}
                          >
                            {icebreaker}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  currentChatMessages.map((msg) => {
                    const isMe = msg.senderId === myUid;
                    const timeStr = msg.createdAt?.toDate
                      ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Just now';

                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: '8px',
                          flexDirection: isMe ? 'row-reverse' : 'row',
                          maxWidth: '75%',
                        }}>
                          {!isMe && (
                            <img
                              src={msg.senderAvatar || activePartnerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}`}
                              alt={msg.senderName}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                            />
                          )}

                          <div style={{
                            padding: '12px 18px',
                            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isMe ? 'var(--primary-gradient)' : '#ffffff',
                            color: isMe ? '#ffffff' : 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            border: isMe ? 'none' : '1px solid var(--border-color)',
                            wordBreak: 'break-word',
                          }}>
                            {msg.text}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '11px',
                          color: 'var(--text-light)',
                          marginTop: '4px',
                          padding: isMe ? '0 8px 0 0' : '0 0 0 36px',
                        }}>
                          {timeStr} {isMe ? '✓✓' : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                }}
              >
                <input
                  type="text"
                  placeholder={`Type a message to ${activePartnerName}... (Press Enter to send)`}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isSending}
                  style={{
                    flex: 1,
                    height: '46px',
                    padding: '0 20px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-main)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isSending}
                  className="btn btn-primary"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '12px 24px',
                    opacity: inputVal.trim() && !isSending ? 1 : 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                  }}
                >
                  <span>Send</span>
                  <span>✈️</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Select a Campus Peer
              </h3>
              <p style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                Select Mani Raj from the left column to test live real-time messaging between your accounts.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
