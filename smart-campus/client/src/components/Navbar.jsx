import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch unread count
  useEffect(() => {
    let mounted = true;
    async function loadCount() {
      try {
        const { data } = await api.get('/notifications/unread-count');
        if (mounted) setUnreadCount(data.data?.count || 0);
      } catch {
        if (mounted) setUnreadCount(2); // Preview fallback
      }
    }
    loadCount();
    const interval = setInterval(loadCount, 15000); // 15s refresh
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Open preview notifications
  async function handleToggleNotifications() {
    const nextState = !showNotificationMenu;
    setShowNotificationMenu(nextState);
    if (nextState) {
      try {
        const { data } = await api.get('/notifications?limit=4');
        setRecentNotifications(data.data || []);
      } catch {
        setRecentNotifications([
          { id: '1', title: 'Campus Hackathon 2026', message: 'Registration now open.', source_module: 'events' },
          { id: '2', title: 'Lab Roll Call Verified', message: 'Attendance recorded in Lab 304.', source_module: 'attendance' },
        ]);
      }
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        background: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 100,
        transition: 'left var(--transition-base)',
      }}
    >
      {/* Left: Mobile Toggle & Brand / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 800,
              background: '#000000',
              color: 'var(--color-yellow)',
              padding: '3px 8px',
              border: '1px solid var(--color-yellow)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--color-yellow)',
                boxShadow: '0 0 8px var(--color-yellow)',
              }}
              className="pulse-dot"
            />
            ACTIVE
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {currentTime}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', position: 'relative' }}>
        {/* Notification Bell with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleToggleNotifications}
            className="btn-icon"
            style={{
              position: 'relative',
              borderColor: showNotificationMenu ? 'var(--color-yellow)' : 'var(--color-border)',
              color: showNotificationMenu ? 'var(--color-yellow)' : 'var(--color-text-secondary)',
            }}
            title="Notifications"
            aria-expanded={showNotificationMenu}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--color-yellow)',
                  color: '#000000',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #000000',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Quick Popover */}
          {showNotificationMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '320px',
                background: '#0d1017',
                border: '1.5px solid var(--color-border)',
                borderTop: '3px solid var(--color-yellow)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.9)',
                padding: 'var(--space-4)',
                zIndex: 1000,
                animation: 'slideUp 150ms ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-3)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: 'var(--color-yellow)' }}>
                  RECENT DISPATCHES
                </span>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotificationMenu(false)}
                  style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#ffffff' }}
                >
                  VIEW ALL ↗
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentNotifications.length === 0 ? (
                  <div style={{ padding: '12px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    No pending alerts
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '8px 10px',
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-yellow)',
              border: '1.5px solid #000000',
              boxShadow: '2px 2px 0px #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 900,
              color: '#000000',
              fontFamily: 'var(--font-display)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              {user?.name}
            </span>
            <span className={`badge badge-${user?.role || 'student'}`} style={{ marginTop: '2px' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="btn-ghost"
          onClick={handleLogout}
          style={{ padding: '0.45rem 0.9rem', fontSize: '11px' }}
        >
          Exit ↗
        </button>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}
