import React from 'react';
import { REAL_FIREBASE_USERS } from '../../constants/realUsers';

export type WebTab = 'dashboard' | 'marketplace' | 'directory' | 'messages' | 'profile';

interface SidebarProps {
  currentTab: WebTab;
  onSelectTab: (tab: WebTab) => void;
  user: any;
  userData?: any;
  onLogout?: () => void;
  onSwitchUser?: (user: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, user, userData, onLogout, onSwitchUser }) => {
  const navItems: { id: WebTab; label: string; icon: string; count?: number }[] = [
    { id: 'dashboard', label: 'Campus Feed', icon: '🏛️' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛍️' },
    { id: 'directory', label: 'Student Directory', icon: '👥' },
    { id: 'messages', label: 'Messages', icon: '💬', count: 3 },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 20,
    }}>
      {/* Brand Header */}
      <div style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
        }}>
          🎓
        </div>
        <div>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '17px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}>
            College Hub
          </h1>
          <span style={{
            color: 'var(--text-light)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Web Portal
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{
        flex: 1,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          padding: '0 12px 8px 12px',
        }}>
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-light)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)');
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget.style.backgroundColor = 'transparent');
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count && (
                <span style={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Campus Links */}
      <div style={{
        padding: '16px',
        margin: '0 16px 16px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
          🏫 Campus Support
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '10px' }}>
          Need academic help or campus emergency assistance?
        </p>
        <button
          onClick={() => alert('Campus Helpline: +1 (800) 555-CAMPUS\nIT Desk: support@college.edu')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          📞 View Helplines
        </button>
      </div>

      {/* Switch Account for Testing */}
      {onSwitchUser && (
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }}>
          {REAL_FIREBASE_USERS.filter(u => u.uid !== (user?.uid || user?.id)).map(ou => (
            <button
              key={ou.uid}
              type="button"
              onClick={() => onSwitchUser(ou)}
              style={{
                width: '100%',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.15)';
                e.currentTarget.style.color = '#a5b4fc';
              }}
            >
              <span>⇄ Switch to {ou.displayName.split(' ')[0]}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>Test Reply</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Profile info */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <img
          src={userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.displayName || user?.displayName || 'User'}`}
          alt="Avatar"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: '#ffffff',
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student User'}
          </div>
          <div style={{
            color: 'var(--text-light)',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user?.email || 'student@saveetha.com'}
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-light)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
          >
            🚪
          </button>
        )}
      </div>
    </aside>
  );
};
