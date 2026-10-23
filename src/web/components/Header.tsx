import React from 'react';

interface HeaderProps {
  onNewListing?: () => void;
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewListing,
  title,
  subtitle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexShrink: 0,
    }}>
      {/* Page Title */}
      <div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--text-main)',
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}>
          {subtitle}
        </p>
      </div>

      {/* Center Search Input */}
      <div style={{
        flex: '0 1 420px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{
          position: 'absolute',
          left: '14px',
          fontSize: '15px',
          color: 'var(--text-light)',
          pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="Search campus announcements, items, peers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            paddingLeft: '40px',
            paddingRight: '16px',
            fontSize: '13px',
            color: 'var(--text-main)',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Right Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onNewListing && (
          <button
            onClick={onNewListing}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '9px 16px' }}
          >
            <span>➕</span> New Listing
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={() => alert('Notifications:\n- Sarah T. commented on your post.\n- Marcus sent a connection request.')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            position: 'relative',
            transition: 'background-color 0.15s ease',
          }}
          title="Notifications"
        >
          🔔
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger)',
            border: '2px solid #ffffff',
          }} />
        </button>

        {/* Academic term badge */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: 700,
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
        }}>
          Fall 2026 Semester
        </div>
      </div>
    </header>
  );
};
