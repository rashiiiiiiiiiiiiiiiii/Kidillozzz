import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = {
  student: [
    { label: '📊  Dashboard', path: '/dashboard', tag: 'CORE' },
    { label: '🔔  Notifications', path: '/notifications', tag: 'INBOX' },
  ],
  faculty: [
    { label: '📊  Dashboard', path: '/dashboard', tag: 'CORE' },
    { label: '🔔  Notifications', path: '/notifications', tag: 'INBOX' },
  ],
  admin: [
    { label: '📊  Dashboard', path: '/dashboard', tag: 'CORE' },
    { label: '👥  Users Directory', path: '/users', tag: 'ADMIN' },
    { label: '🔔  Notifications', path: '/notifications', tag: 'INBOX' },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const items = navItems[user?.role] || navItems.student;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 105,
          }}
        />
      )}

      <aside
        className={`sidebar-root ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--sidebar-width)',
          height: '100vh',
          background: '#090b10',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 110,
          transition: 'transform var(--transition-smooth)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            background: '#05070a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-yellow)',
                border: '1.5px solid #000000',
                boxShadow: '3px 3px 0px #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginRight: 'var(--space-3)',
              }}
            >
              ⚡
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'var(--font-size-md)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                SMART<span style={{ color: 'var(--color-yellow)' }}>CAMPUS</span>
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.12em',
                }}
              >
                DIGITAL OS // V2.0
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ display: 'none', width: '32px', height: '32px' }}
            id="sidebar-close-btn"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Section Tag */}
        <div
          style={{
            padding: 'var(--space-6) var(--space-6) var(--space-2)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--color-yellow)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          // WORKSPACE NAVIGATION
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '0 var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#000000' : '#e2e8f0',
                background: isActive ? 'var(--color-yellow)' : 'var(--color-surface-1)',
                border: isActive ? '1.5px solid #000000' : '1px solid var(--color-border)',
                boxShadow: isActive ? '3px 3px 0px #ffffff' : 'none',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
            >
              <span>{item.label}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '2px',
                  background: '#000000',
                  color: 'var(--color-yellow)',
                  border: '1px solid var(--color-yellow)',
                }}
              >
                {item.tag}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Hazard Divider */}
        <div
          style={{
            height: '4px',
            background: 'repeating-linear-gradient(-45deg, #fee500, #fee500 8px, #000000 8px, #000000 16px)',
          }}
        />

        {/* Footer info */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-6)',
            background: '#05070a',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>ENGINE: SUPABASE</span>
          <span style={{ color: 'var(--color-success)', fontWeight: 800 }}>● ONLINE</span>
        </div>
      </aside>

      <style>{`
        @media (max-width: 860px) {
          .sidebar-root {
            transform: translateX(-100%);
          }
          .sidebar-root.open {
            transform: translateX(0);
          }
          #sidebar-close-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
