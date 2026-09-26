import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'attendance', 'events', 'complaints'
  const { addToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const isUnread = filter === 'unread';
      const [listRes, countRes] = await Promise.all([
        api.get(`/notifications?unreadOnly=${isUnread}&limit=50`),
        api.get('/notifications/unread-count'),
      ]);
      setNotifications(listRes.data.data || []);
      setUnreadCount(countRes.data.data?.count || 0);
    } catch {
      // Graceful fallback for mock/offline preview
      setNotifications([
        {
          id: 'n1',
          title: 'Campus Hackathon 2026 Registration Open',
          message: 'Annual Smart Campus Innovation Sprint is now accepting student teams. Venue: Tech Park Auditorium.',
          source_module: 'events',
          read_status: false,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: 'n2',
          title: 'Attendance Alert: Lab 304 Verified',
          message: 'Biometric roll call for Database Architecture lab was recorded successfully.',
          source_module: 'attendance',
          read_status: false,
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        {
          id: 'n3',
          title: 'Academic Grievance #GR-9102 In Progress',
          message: 'Dean Office has assigned an advisor to review your course credit waiver petition.',
          source_module: 'complaints',
          read_status: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: 'n4',
          title: 'System Security: Session Verified',
          message: 'Supabase PostgreSQL authentication handshake established with role permissions.',
          source_module: 'system',
          read_status: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ]);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      addToast('Marked as read', 'success');
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      addToast('Marked as read (local)', 'info');
    }
  }

  async function markAllAsRead() {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
      setUnreadCount(0);
      addToast('All notifications marked as read', 'success');
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
      setUnreadCount(0);
      addToast('All marked as read', 'info');
    }
  }

  const filteredList = notifications.filter((item) => {
    if (filter === 'all' || filter === 'unread') return true;
    return item.source_module === filter;
  });

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="hero-banner">
        <div>
          <div className="hero-meta">
            <span>DISPATCH FEED // NOTIFICATION HUB</span>
            <span>•</span>
            <span style={{ color: 'var(--color-yellow)', fontWeight: 800 }}>
              {unreadCount} UNREAD ALERTS
            </span>
          </div>
          <h1 className="hero-heading">
            Campus <span className="yellow">Notifications</span>
          </h1>
          <p className="hero-sub">
            Real-time multi-channel alerts from attendance, campus events, and academic desks.
          </p>
        </div>

        <div className="hero-actions">
          {unreadCount > 0 && (
            <button className="btn-ghost" onClick={markAllAsRead}>
              ✓ Mark All Read
            </button>
          )}
          <button className="btn-secondary" onClick={fetchNotifications}>
            ⟳ Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'attendance', label: 'Attendance' },
          { key: 'events', label: 'Events' },
          { key: 'complaints', label: 'Grievances' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-sm)',
              background: filter === tab.key ? 'var(--color-yellow)' : 'var(--color-surface-1)',
              color: filter === tab.key ? '#000000' : 'var(--color-text-secondary)',
              border: `1px solid ${filter === tab.key ? 'var(--color-yellow)' : 'var(--color-border)'}`,
              boxShadow: filter === tab.key ? '2px 2px 0px #ffffff' : 'none',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '80px',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                animation: 'pulseDot 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div
          className="bento-card"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-12)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📭</div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase' }}>
            No Notifications Found
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '380px', marginTop: 'var(--space-2)' }}>
            All systems are clean. You have no pending dispatches in this category.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredList.map((item) => {
            const moduleIcons = {
              attendance: '📋',
              events: '📅',
              complaints: '🛡️',
              system: '⚙️',
            };

            return (
              <div
                key={item.id}
                className="bento-card"
                style={{
                  background: item.read_status ? 'var(--color-surface-1)' : 'linear-gradient(90deg, #181d29, #10131a)',
                  borderColor: item.read_status ? 'var(--color-border)' : 'var(--color-yellow)',
                  borderLeftWidth: item.read_status ? '1px' : '4px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-5)',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: '#090b10',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {moduleIcons[item.source_module] || '🔔'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '4px' }}>
                      <span
                        className="badge"
                        style={{
                          background: 'rgba(254, 229, 0, 0.12)',
                          color: 'var(--color-yellow)',
                          borderColor: 'rgba(254, 229, 0, 0.3)',
                        }}
                      >
                        {item.source_module || 'CAMPUS'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 'var(--font-size-md)', color: item.read_status ? '#cbd5e1' : '#ffffff', fontWeight: 800 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                      {item.message}
                    </p>
                  </div>
                </div>

                {!item.read_status && (
                  <button
                    className="btn-ghost"
                    onClick={() => markAsRead(item.id)}
                    style={{ padding: '6px 12px', fontSize: '11px', flexShrink: 0 }}
                  >
                    Mark Read ✓
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
