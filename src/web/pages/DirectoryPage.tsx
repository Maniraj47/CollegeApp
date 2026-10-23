import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { REAL_FIREBASE_USERS } from '../../constants/realUsers';

interface DirectoryPageProps {
  searchQuery: string;
  currentUser: any;
  onInitiateChat?: (userId: string, userName: string, userAvatar?: string) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  searchQuery,
  currentUser,
  onInitiateChat,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [users, setUsers] = useState<any[]>(REAL_FIREBASE_USERS);
  const [loading, setLoading] = useState(false);

  // Sync real registered users from Firestore 'users' collection
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(firestore, 'users'),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              uid: docSnap.id,
              ...docSnap.data(),
            }));

            // Merge with REAL_FIREBASE_USERS to guarantee no real accounts are dropped
            const merged = [...REAL_FIREBASE_USERS];
            fetched.forEach((f: any) => {
              const idx = merged.findIndex((m) => m.uid === f.id || m.uid === f.uid);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...f };
              } else {
                merged.push(f);
              }
            });
            setUsers(merged);
          } else {
            setUsers(REAL_FIREBASE_USERS);
          }
          setLoading(false);
        },
        (err) => {
          console.warn('[Directory] Error fetching users, using fallback:', err);
          setUsers(REAL_FIREBASE_USERS);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('[Directory] Failed to listen to users:', e);
      setUsers(REAL_FIREBASE_USERS);
      setLoading(false);
    }
  }, []);

  const filtered = users.filter((u) => {
    // Optionally exclude or mark current user
    const nameMatch = (u.displayName || u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const deptMatch = (u.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const regMatch = (u.regNo || u.studentId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const searchPass = nameMatch || deptMatch || emailMatch || regMatch;

    let filterPass = true;
    if (activeFilter === 'Engineering') {
      filterPass = (u.department || '').toLowerCase().includes('eng') || (u.department || '').toLowerCase().includes('science');
    } else if (activeFilter === 'Design & Business') {
      filterPass = (u.department || '').toLowerCase().includes('design') || (u.department || '').toLowerCase().includes('business');
    }

    return searchPass && filterPass;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Controls & Department Filter Pills */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '16px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Engineering', 'Design & Business'].map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-main)',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab === 'All' ? 'All Registered Members' : tab}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          {filtered.length} verified campus members
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading campus directory...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            No other students registered yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 16px auto' }}>
            Open an Incognito / private window to register another real user account, and you will see both students appear right here in real time!
          </p>
        </div>
      ) : (
        /* Directory Cards Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((person) => {
            const isSelf = person.id === currentUser?.uid;
            const displayName = person.displayName || person.name || person.email?.split('@')[0] || 'Student';
            const avatarUrl = person.photoUrl || person.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

            return (
              <div
                key={person.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelf ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {isSelf && (
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    right: '16px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    You
                  </span>
                )}

                {/* Header: Avatar, Name & Dept */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {displayName}
                      </h3>
                      <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 700 }}>✓</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                      {person.department || 'Undergraduate Student'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {person.year ? `${person.year} • ` : ''}ID: {person.regNo || 'Verified'}
                    </div>
                  </div>
                </div>

                {/* Email info */}
                <div style={{
                  backgroundColor: 'var(--bg-main)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span>✉️</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {person.email}
                  </span>
                </div>

                {/* Action button */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: 'auto',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '16px',
                }}>
                  {!isSelf && onInitiateChat ? (
                    <button
                      onClick={() => onInitiateChat(person.id, displayName, avatarUrl)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                    >
                      💬 Send Message
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-light)', fontStyle: 'italic', margin: '0 auto' }}>
                      Your campus directory card
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
