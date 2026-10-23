import React, { useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebaseConfig';
import { REAL_FIREBASE_USERS } from '../../constants/realUsers';
export { REAL_FIREBASE_USERS };

interface AuthPageProps {
  onSelectRealUser?: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSelectRealUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('Junior (3rd Year)');
  const [regNo, setRegNo] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureUserProfile = async (user: any, customData?: any) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        id: user.uid,
        email: user.email || '',
        displayName: customData?.displayName || user.displayName || user.email?.split('@')[0] || 'Student',
        name: customData?.displayName || user.displayName || user.email?.split('@')[0] || 'Student',
        photoUrl: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
        department: customData?.department || 'Computer Science',
        year: customData?.year || '1st Year',
        regNo: customData?.regNo || 'REG-' + Math.floor(100000 + Math.random() * 900000),
        role: 'student',
        onboardingCompleted: true,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await ensureUserProfile(result.user);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for localhost:3000.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, {
          displayName: fullName.trim(),
        });
        await ensureUserProfile(cred.user, {
          displayName: fullName.trim(),
          department,
          year,
          regNo: regNo.trim() || undefined,
        });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        await ensureUserProfile(cred.user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message;
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password login is not enabled in Firebase Console for this project. Please click "Continue with Google" or choose a real account below.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please use "Continue with Google" or select your account below.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      padding: '24px',
      fontFamily: 'inherit',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}>
            🎓
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              College Hub
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              Real User Authentication Portal
            </p>
          </div>
        </div>

        {/* Real Users Quick-Access Card */}
        {onSelectRealUser && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👥</span> Real Registered Firebase Users (1-Click Login):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {REAL_FIREBASE_USERS.map((ru) => (
                <button
                  key={ru.uid}
                  type="button"
                  onClick={() => onSelectRealUser(ru)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(79, 70, 229, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={ru.photoURL}
                    alt={ru.displayName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ru.displayName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ru.department} • {ru.email}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 700 }}>Log In →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: !isSignUp ? '#ffffff' : 'transparent',
              color: !isSignUp ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: !isSignUp ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Google / Email Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: isSignUp ? '#ffffff' : 'transparent',
              color: isSignUp ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: isSignUp ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Register New User
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px',
            lineHeight: 1.4,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Google One-Click Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            height: '46px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#1e293b',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            marginBottom: '16px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <span style={{ fontSize: '18px' }}>🌐</span>
          <span>{loading ? 'Connecting...' : 'Continue with Google Account'}</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '16px',
          color: '#94a3b8',
          fontSize: '12px',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Mani Raj"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="e.g. user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Register Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
