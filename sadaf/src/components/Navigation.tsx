import React from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { ActiveSection } from '../types';

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: string;
  badge?: string;
}

export const Navigation: React.FC = () => {
  const { activeSection, setActiveSection, user, todayCompletionRate, unreadNotificationCount } = useHabitly();

  const navItems: NavItem[] = [
    { id: 'command-center', label: 'Command Center', icon: '⚡' },
    { id: 'schedule', label: 'Schedule Architect', icon: '📅' },
    { id: 'widgets', label: 'Widget Dock', icon: '🧩' },
    { id: 'habits', label: 'Habit Hub', icon: '🎯' },
    { id: 'todos', label: 'Daily Priorities', icon: '📋' },
    { id: 'analytics', label: 'Analytics & Heatmap', icon: '📊' },
    { id: 'rewards', label: 'Reward Vault', icon: '🏆', badge: '⚡' + user.sparkPoints },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-icon">H</div>
        <div className="brand-info">
          <h1 className="brand-title">HABITLY</h1>
          <span className="brand-tag">PRO OS v3.0</span>
        </div>
      </div>

      <div className="sidebar-user-glance">
        <div className="user-avatar-hex">
          <span>Lv.{user.level}</span>
        </div>
        <div className="user-glance-details">
          <span className="user-tier-label">{user.levelTitle}</span>
          <div className="user-mini-xp-track">
            <div
              className="user-mini-xp-fill"
              style={{ width: `${Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100))}%` }}
            />
          </div>
          <span className="user-xp-numbers">{user.currentXP} / {user.nextLevelXP} XP</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">OPERATING SYSTEM</div>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
              {isActive && <div className="active-glow-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer-widget">
        <div className="widget-mini-header">
          <span className="mini-label">TODAY'S MOMENTUM</span>
          <span className="mini-pct">{todayCompletionRate}%</span>
        </div>
        <div className="momentum-bar">
          <div className="momentum-fill" style={{ width: `${todayCompletionRate}%` }} />
        </div>
        <div className="streak-shield-badge">
          <span>🛡️ {user.streakShields} Streak Shields Active</span>
        </div>
      </div>
    </aside>
  );
};
