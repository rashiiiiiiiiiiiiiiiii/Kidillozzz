import React, { useState } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { Habit } from '../types';

export const HabitTracker: React.FC = () => {
  const {
    habits,
    toggleHabit,
    incrementHabitCount,
    decrementHabitCount,
    setHabitCount,
    deleteHabit,
    openSkipModal,
    openPauseModal,
    resumeHabit,
    setIsAddHabitOpen,
  } = useHabitly();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingHabitCount, setEditingHabitCount] = useState<{ id: string; val: string } | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'mindfulness', label: '🧘 Mindfulness' },
    { id: 'productivity', label: '⚡ Productivity' },
    { id: 'health', label: '💧 Health' },
    { id: 'fitness', label: '🏋️ Fitness' },
    { id: 'learning', label: '📚 Learning' },
    { id: 'creativity', label: '🎨 Creativity' },
  ];

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: 'All Habits' },
    { id: 'completed', label: '✓ Completed Today' },
    { id: 'pending', label: '○ Pending Today' },
    { id: 'paused', label: '⏸ Paused (Life-Phase)' },
  ];

  const filteredHabits = habits.filter((h) => {
    const matchesCat = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (selectedStatus === 'completed') matchesStatus = h.completedToday;
    if (selectedStatus === 'pending') matchesStatus = !h.completedToday && h.status !== 'paused';
    if (selectedStatus === 'paused') matchesStatus = h.status === 'paused';

    return matchesCat && matchesSearch && matchesStatus;
  });

  const formatFrequencyBadge = (habit: Habit) => {
    const unit = habit.frequencyUnit ? habit.frequencyUnit.toUpperCase() : 'TIMES';
    if (habit.frequencyType === 'times_per_day') {
      return `🔢 ${habit.frequencyCount} ${unit} / DAY`;
    }
    if (habit.frequencyType === 'days_per_week') {
      return `📅 ${habit.frequencyCount} DAYS / WEEK`;
    }
    if (habit.frequencyType === 'times_per_week') {
      return `📊 ${habit.frequencyCount} ${unit} / WEEK`;
    }
    if (habit.frequencyType === 'days_per_month') {
      return `🗓️ ${habit.frequencyCount} DAYS / MONTH`;
    }
    if (habit.frequencyType === 'interval') {
      return `⏱ EVERY ${habit.frequencyCount} DAYS`;
    }
    if (habit.frequencyType === 'weekdays') {
      return `💼 WEEKDAYS`;
    }
    if (habit.frequencyType === 'weekends') {
      return `🏖 WEEKENDS`;
    }
    return `⚡ DAILY`;
  };

  return (
    <section id="habits" className="dashboard-section section-habit-hub in-view">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">HABIT ARCHITECTURE</div>
          <h2 className="section-main-title">Habit Tracker Hub</h2>
          <p className="section-subtitle">
            Configure any custom frequency amount (multiple times/day, custom units like glasses, ml, reps, pages, days/week, or intervals) with live steppers and milestone velocity.
          </p>
        </div>
        <div className="section-header-actions">
          <button className="btn-primary-neon" onClick={() => setIsAddHabitOpen(true)}>
            <span>+ Create New Habit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-bar">
        <div className="search-box-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search habits by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills-row">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-pill ${selectedCategory === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="status-pills-row">
          {statuses.map((s) => (
            <button
              key={s.id}
              className={`filter-pill ${selectedStatus === s.id ? 'active' : ''}`}
              onClick={() => setSelectedStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="habits-grid">
        {filteredHabits.length === 0 ? (
          <div className="glass-card empty-results-card">
            <span className="empty-icon">🔍</span>
            <h3>No Habits Found</h3>
            <p>Try adjusting your category or status filters, or add a new habit to track.</p>
            <button className="btn-primary-neon mt-4" onClick={() => setIsAddHabitOpen(true)}>
              + Add Habit Now
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const progressPercent = Math.min(100, Math.round((habit.completedDays / habit.targetDays) * 100));
            const isPaused = habit.status === 'paused';
            const isSkipped = habit.status === 'skipped';
            const isMultiTimes = habit.frequencyType === 'times_per_day' || (habit.frequencyCount > 1 && habit.frequencyType !== 'interval' && habit.frequencyType !== 'days_per_week' && habit.frequencyType !== 'days_per_month');
            const unitName = habit.frequencyUnit || 'times';
            const todayCount = habit.todayCount || 0;
            const dailyPercent = Math.min(100, Math.round((todayCount / habit.frequencyCount) * 100));

            return (
              <div
                key={habit.id}
                className={`glass-card habit-master-card ${habit.completedToday ? 'is-completed' : ''} ${isPaused ? 'is-paused' : ''} ${isSkipped ? 'is-skipped' : ''}`}
              >
                <div className="card-top-header">
                  <div className="habit-identity">
                    <div className="habit-icon-hex" style={{ borderColor: habit.color }}>
                      <span>{habit.icon}</span>
                    </div>
                    <div className="habit-title-col">
                      <h3 className="habit-title">{habit.name}</h3>
                      <div className="habit-tags-line">
                        <span className="habit-tag-category">{habit.category.toUpperCase()}</span>
                        <span className="habit-tag-freq">{formatFrequencyBadge(habit)}</span>
                        {isPaused && (
                          <span className="habit-tag-paused">⏸ PAUSED ({habit.pauseReason || 'Life Phase'})</span>
                        )}
                        {isSkipped && (
                          <span className="habit-tag-skipped">🛡️ SKIPPED ({habit.skipReason || 'Rest Day'})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="habit-header-right">
                    <div className="streak-counter-pill" title={`Best Streak: ${habit.bestStreak} days`}>
                      <span className="flame-icon">🔥</span>
                      <span className="streak-num">{habit.streak}</span>
                      <span className="streak-unit">STREAK</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Target */}
                <div className="habit-progress-section">
                  <div className="progress-label-row">
                    <span className="progress-title">Milestone Horizon</span>
                    <span className="progress-fraction">
                      <strong>{habit.completedDays}</strong> / {habit.targetDays} Days ({progressPercent}%)
                    </span>
                  </div>
                  <div className="neon-progress-track">
                    <div
                      className="neon-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: habit.color,
                        boxShadow: `0 0 12px ${habit.color}80`,
                      }}
                    />
                  </div>
                </div>

                {/* Multi-frequency Daily Stepper Control (If frequencyCount > 1 or times_per_day) */}
                {isMultiTimes && !isPaused && (
                  <div className="daily-frequency-stepper-box">
                    <div className="stepper-header-row">
                      <span className="stepper-label">Today's Target Progress:</span>
                      <span className="stepper-percent-tag">{dailyPercent}%</span>
                    </div>

                    <div className="stepper-controls-row">
                      <button
                        className="stepper-btn minus"
                        onClick={() => decrementHabitCount(habit.id, habit.frequencyCount >= 500 ? 100 : (habit.frequencyCount >= 50 ? 5 : 1))}
                        disabled={todayCount <= 0}
                        title="Decrement Count"
                      >
                        -
                      </button>

                      <div className="stepper-display">
                        {editingHabitCount?.id === habit.id ? (
                          <input
                            type="number"
                            className="stepper-inline-input"
                            value={editingHabitCount.val}
                            min="0"
                            max={habit.frequencyCount}
                            onChange={(e) => setEditingHabitCount({ id: habit.id, val: e.target.value })}
                            onBlur={() => {
                              const num = Number(editingHabitCount.val);
                              if (!isNaN(num)) setHabitCount(habit.id, num);
                              setEditingHabitCount(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const num = Number(editingHabitCount.val);
                                if (!isNaN(num)) setHabitCount(habit.id, num);
                                setEditingHabitCount(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="stepper-current cursor-pointer"
                            title="Click to type exact count"
                            onClick={() => setEditingHabitCount({ id: habit.id, val: String(todayCount) })}
                          >
                            {todayCount}
                          </span>
                        )}
                        <span className="stepper-divider">/</span>
                        <span className="stepper-target">
                          {habit.frequencyCount} {unitName}
                        </span>
                      </div>

                      <button
                        className="stepper-btn plus"
                        onClick={() => incrementHabitCount(habit.id, habit.frequencyCount >= 500 ? 100 : (habit.frequencyCount >= 50 ? 5 : 1))}
                        disabled={todayCount >= habit.frequencyCount}
                        title="Increment Count"
                      >
                        +
                      </button>
                    </div>

                    {/* Mini Daily Progress Fill */}
                    <div className="stepper-mini-bar-track">
                      <div
                        className="stepper-mini-bar-fill"
                        style={{
                          width: `${dailyPercent}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 7-Day Mini History Dot Matrix */}
                <div className="habit-history-dots">
                  <span className="history-label">Last 7 Days:</span>
                  <div className="dots-row">
                    {[6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
                      const d = new Date();
                      d.setDate(d.getDate() - daysAgo);
                      const key = d.toISOString().split('T')[0];
                      const status = habit.history[key];
                      const isToday = daysAgo === 0;
                      const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });

                      let dotClass = 'dot-empty';
                      if (isToday && habit.completedToday) dotClass = 'dot-done';
                      else if (status === 'completed') dotClass = 'dot-done';
                      else if (status === 'skipped') dotClass = 'dot-skip';

                      return (
                        <div key={key} className="history-dot-wrap" title={`${key}: ${status || (isToday && habit.completedToday ? 'completed' : 'pending')}`}>
                          <div className={`history-dot ${dotClass}`} style={dotClass === 'dot-done' ? { backgroundColor: habit.color } : {}} />
                          <span className="dot-day-name">{dayLetter}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="habit-card-footer">
                  {isPaused ? (
                    <button className="btn-primary-neon resume-btn" onClick={() => resumeHabit(habit.id)}>
                      <span>▶ Resume Habit</span>
                    </button>
                  ) : (
                    <button
                      className={`btn-check-habit ${habit.completedToday ? 'completed' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <span>{habit.completedToday ? '✓ Completed Today' : '○ Mark Complete'}</span>
                    </button>
                  )}

                  {!isPaused && (
                    <div className="secondary-action-group">
                      <button
                        className="btn-action-ghost"
                        onClick={() => openSkipModal(habit.id, habit.name)}
                        title="Skip today with streak protection"
                      >
                        <span>Skip 🛡️</span>
                      </button>

                      <button
                        className="btn-action-ghost"
                        onClick={() => openPauseModal(habit.id, habit.name)}
                        title="Pause habit for life transitions"
                      >
                        <span>Pause ⏸</span>
                      </button>
                    </div>
                  )}

                  <button
                    className="btn-delete-ghost"
                    onClick={() => {
                      if (confirm(`Delete habit "${habit.name}"?`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    title="Delete Habit"
                  >
                    <span>🗑</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
