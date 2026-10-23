import React, { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

interface ProfilePageProps {
  user: any;
  userData: any;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    department: '',
    year: '',
    regNo: '',
    campus: '',
    bio: '',
  });

  // Sync form with current user data
  useEffect(() => {
    setFormData({
      displayName: userData?.displayName || user?.displayName || user?.email?.split('@')[0] || '',
      department: userData?.department || 'Computer Science',
      year: userData?.year || 'Junior (3rd Year)',
      regNo: userData?.regNo || '',
      campus: userData?.campus || 'Main Campus',
      bio: userData?.bio || 'Campus community member exploring academics, extracurriculars, and peer collaboration.',
    });
  }, [userData, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setSaving(true);
      setSuccessMsg(null);

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          displayName: formData.displayName.trim(),
          department: formData.department.trim(),
          year: formData.year.trim(),
          regNo: formData.regNo.trim(),
          campus: formData.campus.trim(),
          bio: formData.bio.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccessMsg('Your profile has been saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
  const currentAvatar = userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentDisplayName}`;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Success banner */}
      {successMsg && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Banner */}
        <div style={{
          height: '160px',
          background: 'var(--primary-gradient)',
          position: 'relative',
        }} />

        {/* Profile Info Header */}
        <div style={{ padding: '0 36px 32px 36px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '-60px',
            marginBottom: '18px',
          }}>
            <img
              src={currentAvatar}
              alt="Avatar"
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: '#ffffff',
              }}
            />

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            /* View Mode */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {currentDisplayName}
                </h2>
                <span className="badge badge-success">✓ Verified Student</span>
              </div>

              <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, marginBottom: '6px' }}>
                {userData?.department || 'Department Not Set'} • {userData?.year || 'Year Not Set'}
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Reg No: <b>{userData?.regNo || 'Not specified'}</b> • Email: <b>{user?.email}</b> • Campus: <b>{userData?.campus || 'Main Campus'}</b>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6, maxWidth: '780px', backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                {userData?.bio || 'No bio written yet. Click "Edit Profile" above to tell your peers and professors about yourself!'}
              </p>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Edit Your Student Profile
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Full Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Registration / Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS-2023-891"
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Department / Major
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Class / Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Junior (3rd Year)"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Campus / Hostel Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. North Campus Hall 4 or Commuter"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Bio & Interests
                </label>
                <textarea
                  placeholder="Share a short bio, study interests, or campus clubs you participate in..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Account Info Details Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '24px 32px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
          🔐 Account & Security
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Firebase User ID (UID)</span>
          <span style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-main)' }}>{user?.uid}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Registered Email</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{user?.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role</span>
          <span className="badge badge-primary">{userData?.role || 'Verified Student'}</span>
        </div>
      </div>
    </div>
  );
};
