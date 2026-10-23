import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

interface DashboardPageProps {
  searchQuery: string;
  user: any;
  userData: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ searchQuery, user, userData }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync real posts from Firestore collection 'posts'
  useEffect(() => {
    try {
      const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPosts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setPosts(fetchedPosts);
          setLoading(false);
        },
        (error) => {
          console.warn('[DashboardPage] Firestore sync warning:', error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('[DashboardPage] Failed to subscribe to posts:', e);
      setLoading(false);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      setIsSubmitting(true);
      const authorName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
      const authorAvatar = userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
      const authorDepartment = userData?.department || 'Student';

      await addDoc(collection(firestore, 'posts'), {
        authorId: user.uid,
        authorName,
        authorAvatar,
        authorDepartment,
        content: newPostText.trim(),
        imageUrl: postImage || null,
        likesCount: 0,
        likedBy: [],
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });

      setNewPostText('');
      setPostImage(null);
    } catch (err: any) {
      console.error('Error creating post:', err);
      alert('Failed to publish post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (post: any) => {
    const isLiked = (post.likedBy || []).includes(user.uid);
    const postRef = doc(firestore, 'posts', post.id);

    try {
      await updateDoc(postRef, {
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likesCount: isLiked ? Math.max(0, (post.likesCount || 1) - 1) : (post.likesCount || 0) + 1,
      });
    } catch (e) {
      console.warn('Like toggle notice:', e);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const textMatch = (p.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = (p.authorName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return textMatch || authorMatch;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* KPI Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {[
          { label: 'Campus Feed', value: `${posts.length} Posts`, icon: '💬', color: '#4f46e5' },
          { label: 'Logged In As', value: userData?.displayName || user?.displayName || user?.email?.split('@')[0], icon: '👤', color: '#0ea5e9' },
          { label: 'Department', value: userData?.department || 'Engineering', icon: '🎓', color: '#10b981' },
          { label: 'Academic Year', value: userData?.year || 'Active Term', icon: '🏛️', color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-card)',
            padding: '18px 22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: `${stat.color}15`,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              {stat.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Left Column: Post Creator & Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Post Creation Box */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '22px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
              <img
                src={userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`}
                alt="Avatar"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  placeholder="What's on your mind? Share an update, announcement, or question with the campus..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    resize: 'none',
                    height: '84px',
                    outline: 'none',
                    backgroundColor: 'var(--bg-main)',
                  }}
                />

                {postImage && (
                  <div style={{ position: 'relative', width: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={postImage} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setPostImage(null)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '14px',
            }}>
              <div>
                <label
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span>📷</span> Add Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <button
                onClick={handleCreatePost}
                className="btn btn-primary btn-sm"
                disabled={!newPostText.trim() || isSubmitting}
                style={{ opacity: newPostText.trim() && !isSubmitting ? 1 : 0.5 }}
              >
                {isSubmitting ? 'Posting...' : 'Publish Post'}
              </button>
            </div>
          </div>

          {/* Posts Stream */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading campus feed...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                No posts yet on campus
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
                Be the first to share an announcement, study question, or event with your peers!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isLiked = (post.likedBy || []).includes(user.uid);
              return (
                <article
                  key={post.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Post Author Header */}
                  <div style={{ padding: '20px 24px 14px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={post.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`}
                      alt={post.authorName}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {post.authorName}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {post.authorDepartment || 'Student'} • {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div style={{ padding: '0 24px 16px 24px', fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </div>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden' }}>
                      <img
                        src={post.imageUrl}
                        alt="Post attachment"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{
                    padding: '14px 24px',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={() => handleToggleLike(post)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isLiked ? 'var(--danger)' : 'var(--text-muted)',
                        }}
                      >
                        <span>{isLiked ? '❤️' : '🤍'}</span>
                        <span>{post.likesCount || 0} Likes</span>
                      </button>

                      <button
                        onClick={() => alert('Comments thread')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span>💬</span>
                        <span>Comments</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      🔗 Share
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column: Campus Announcements & Guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📢 Official Announcements
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Semester Enrollment Active
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Course adds and drops available through the registrar portal.
                </div>
              </div>

              <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Campus Library Hours
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Open 24/7 with active student ID verification.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              🛡️ Community Guidelines
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              College Hub is a trusted space for verified university students and faculty. Please keep posts respectful, academic, and supportive.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
