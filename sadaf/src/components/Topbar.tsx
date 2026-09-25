import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const Topbar: React.FC = () => {
  const {
    user,
    setIsAddHabitOpen,
    toggleSound,
    setIsWidgetGuideOpen,
    unreadNotificationCount,
    setIsNotificationDrawerOpen,
  } = useHabitly();

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <div className="system-status-indicator">
          <span className="pulse-dot" />
          <span className="status-text">SYSTEM ONLINE</span>
        </div>
        <span className="topbar-divider">/</span>
        <div className="current-date-badge">
          <span>📅 {currentDate}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Level & XP progression */}
        <div className="gamification-pill xp-pill" title={`Level ${user.level}: ${user.currentXP}/${user.nextLevelXP} XP`}>
          <div className="pill-badge level-badge">Lv.{user.level}</div>
          <div className="pill-content">
            <div className="pill-title">{user.levelTitle}</div>
            <div className="pill-progress-track">
              <div className="pill-progress-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
          <span className="pill-extra">{xpPercent}%</span>
        </div>

        {/* Spark Points */}
        <div className="gamification-pill spark-pill" title="⚡ Spark Points available for rewards">
          <span className="pill-icon">⚡</span>
          <div className="pill-numeric">{user.sparkPoints.toLocaleString()}</div>
          <span className="pill-unit">PTS</span>
        </div>

        {/* Streak Counter */}
        <div className="gamification-pill streak-pill" title={`${user.currentStreak} Day Streak!`}>
          <span className="pill-icon flame-anim">🔥</span>
          <div className="pill-numeric">{user.currentStreak}</div>
          <span className="pill-unit">DAYS</span>
        </div>

        {/* Action Controls */}
        <div className="topbar-actions">
          {/* Notifications Bell */}
          <button
            className="action-icon-btn notif-bell-btn"
            onClick={() => setIsNotificationDrawerOpen(true)}
            title="Smart Notifications & Reminders"
          >
            <span>🔔</span>
            {unreadNotificationCount > 0 && (
              <span className="notif-badge-count">{unreadNotificationCount}</span>
            )}
          </button>

          <button
            className="action-icon-btn widget-btn"
            onClick={() => setIsWidgetGuideOpen(true)}
            title="Add Widget to Mobile / Desktop Home Screen"
          >
            <span>📱 +Widget</span>
          </button>

          <button
            className="action-icon-btn sound-btn"
            onClick={toggleSound}
            title={user.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            <span>{user.soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          <button
            className="btn-primary-neon topbar-add-btn"
            onClick={() => setIsAddHabitOpen(true)}
          >
            <span className="plus-icon">+</span>
            <span>New Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
