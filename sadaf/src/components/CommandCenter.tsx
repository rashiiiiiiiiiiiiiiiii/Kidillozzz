import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const CommandCenter: React.FC = () => {
  const {
    habits,
    tasks,
    user,
    todayCompletionRate,
    toggleHabit,
    incrementHabitCount,
    openSkipModal,
    openPauseModal,
    resumeHabit,
    setIsAddHabitOpen,
    setActiveSection,
    toggleTask,
  } = useHabitly();

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (todayCompletionRate / 100) * circumference;

  const activeHabits = habits.filter((h) => h.status !== 'paused');
  const pausedHabits = habits.filter((h) => h.status === 'paused');
  const completedCount = activeHabits.filter((h) => h.completedToday).length;
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <section id="command-center" className="dashboard-section section-command-center">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">MISSION CONTROL</div>
          <h2 className="section-main-title">Home Command Center</h2>
          <p className="section-subtitle">Real-time daily telemetry, instant habit check-ins, and high-priority directives.</p>
        </div>
        <div className="section-header-actions">
          <button className="btn-secondary-cyber" onClick={() => setIsAddHabitOpen(true)}>
            <span>+ Add Habit</span>
          </button>
        </div>
      </div>

      <div className="command-center-grid">
        {/* Hero Card with Animated Circular Percentage Gauge */}
        <div className="glass-card hero-gauge-card">
          <div className="card-top-tag">TODAY'S EXECUTION GAUGE</div>
          <div className="gauge-content">
            <div className="svg-gauge-wrapper">
              <svg className="circular-progress-svg" viewBox="0 0 160 160" width="150" height="150">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4FF00" />
                    <stop offset="50%" stopColor="#00F59B" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Background track */}
                <circle
                  className="gauge-bg-circle"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Progress bar */}
                <circle
                  className="gauge-progress-circle"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  filter="url(#gaugeGlow)"
                />
              </svg>
              <div className="gauge-center-text">
                <span className="gauge-percentage-number">{todayCompletionRate}%</span>
                <span className="gauge-label">COMPLETED</span>
              </div>
            </div>

            <div className="gauge-stats-details">
              <div className="gauge-metric-item">
                <span className="metric-title">Active Habits</span>
                <span className="metric-val">{completedCount} / {activeHabits.length} Done</span>
              </div>
              <div className="gauge-metric-item">
                <span className="metric-title">Daily Streak</span>
                <span className="metric-val highlight-chartreuse">🔥 {user.currentStreak} Days</span>
              </div>
              <div className="gauge-metric-item">
                <span className="metric-title">Spark Points</span>
                <span className="metric-val highlight-amber">⚡ {user.sparkPoints} Pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Access 1-Tap Habit Chips */}
        <div className="glass-card quick-habits-card">
          <div className="card-top-tag-row">
            <span className="card-top-tag">QUICK-ACCESS HABIT STRIP</span>
            <span className="card-top-hint">1-Tap Log, Increment, Skip or Pause</span>
          </div>

          <div className="quick-chips-container">
            {activeHabits.length === 0 ? (
              <div className="empty-state-card">
                <span>No active habits. Click "+ Add Habit" to start!</span>
              </div>
            ) : (
              activeHabits.map((h) => {
                const isMulti = h.frequencyCount > 1 && h.frequencyType !== 'interval' && h.frequencyType !== 'days_per_week' && h.frequencyType !== 'days_per_month';
                const unitStr = h.frequencyUnit || 'times';

                return (
                  <div
                    key={h.id}
                    className={`quick-habit-chip ${h.completedToday ? 'completed' : ''} ${h.status === 'skipped' ? 'skipped' : ''}`}
                  >
                    <div className="chip-left" onClick={() => isMulti ? incrementHabitCount(h.id) : toggleHabit(h.id)}>
                      <div className="chip-icon-box" style={{ borderColor: h.color }}>
                        <span>{h.icon}</span>
                      </div>
                      <div className="chip-text-meta">
                        <span className="chip-name">{h.name}</span>
                        <div className="chip-subline">
                          <span className="chip-streak">🔥 {h.streak}d streak</span>
                          {isMulti ? (
                            <span className="chip-freq-count-badge">
                              {h.todayCount || 0}/{h.frequencyCount} {unitStr}
                            </span>
                          ) : (
                            <span className="chip-category-text">• {h.category}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="chip-actions">
                      {isMulti && !h.completedToday ? (
                        <button
                          className="chip-increment-btn"
                          onClick={() => incrementHabitCount(h.id)}
                          title={`+1 ${unitStr}`}
                        >
                          <span>+</span>
                        </button>
                      ) : null}

                      <button
                        className={`chip-check-btn ${h.completedToday ? 'checked' : ''}`}
                        onClick={() => toggleHabit(h.id)}
                        title={h.completedToday ? 'Mark Incomplete' : 'Complete Habit'}
                      >
                        <span>{h.completedToday ? '✓' : '○'}</span>
                      </button>

                      <button
                        className="chip-skip-btn"
                        onClick={() => openSkipModal(h.id, h.name)}
                        title="Skip for today (Preserve Streak)"
                      >
                        <span>Skip</span>
                      </button>

                      <button
                        className="chip-pause-btn"
                        onClick={() => openPauseModal(h.id, h.name)}
                        title="Pause Habit for life phases"
                      >
                        <span>⏸</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Paused Habits Notice */}
            {pausedHabits.length > 0 && (
              <div className="paused-habits-notice">
                <span className="notice-icon">⏸️</span>
                <span className="notice-text">
                  {pausedHabits.length} habit(s) in Life-Phase Freeze: {pausedHabits.map((p) => p.name).join(', ')}
                </span>
                <button
                  className="btn-link-chartreuse"
                  onClick={() => {
                    setActiveSection('habits');
                    document.getElementById('habits')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Manage Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Row: Today's Priorities + Quick Telemetry */}
      <div className="command-subgrid">
        <div className="glass-card home-priorities-card">
          <div className="card-top-tag-row">
            <span className="card-top-tag">URGENT & HIGH PRIORITIES</span>
            <button
              className="btn-link-chartreuse"
              onClick={() => {
                setActiveSection('todos');
                document.getElementById('todos')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View All Directives →
            </button>
          </div>

          <div className="home-tasks-list">
            {pendingTasks.length === 0 ? (
              <div className="tasks-all-clear">
                <span className="clear-icon">🎉</span>
                <span>All daily priorities cleared! High discipline detected.</span>
              </div>
            ) : (
              pendingTasks.map((t) => (
                <div key={t.id} className="home-task-item">
                  <button className="task-checkbox" onClick={() => toggleTask(t.id)}>
                    <span className="check-box-frame">{t.completed && '✓'}</span>
                  </button>
                  <div className="task-content-block">
                    <span className="task-text-title">{t.title}</span>
                    <div className="task-sub-tags">
                      <span className={`priority-pill priority-${t.priority}`}>{t.priority.toUpperCase()}</span>
                      {t.dueTime && <span className="time-badge">⏰ {t.dueTime}</span>}
                      <span className="cat-badge">📁 {t.category}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="glass-card telemetry-card">
          <div className="card-top-tag">PERFORMANCE TELEMETRY</div>
          <div className="telemetry-stat-boxes">
            <div className="stat-box">
              <span className="stat-num">{user.totalHabitsCompleted}</span>
              <span className="stat-desc">Lifetime Habits Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-chartreuse">{user.bestStreak} Days</span>
              <span className="stat-desc">All-Time Best Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-amber">{user.levelTitle}</span>
              <span className="stat-desc">Current Progression Tier</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-cyan">🛡️ {user.streakShields}</span>
              <span className="stat-desc">Streak Shields in Inventory</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
