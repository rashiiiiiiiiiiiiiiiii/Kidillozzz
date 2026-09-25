# Habitly Pro OS - Full Project Handover Document

Generated: 2026-09-25 | Status: Active Development | Server: http://localhost:8080

---

## 1. PROJECT OVERVIEW

Habitly Pro OS is an ultra-professional, gamified daily activity and habit tracker web application built with React 18 and TypeScript. It runs entirely in the browser using a pre-compiled bundle served by a local PowerShell HTTP server.

### Core Identity
- Theme: Luxury Obsidian Space and Electric Chartreuse
- Colors: #06040a (deep obsidian), #0b0714 (dark purple), #d4ff00 (neon chartreuse), #00f59b (neon emerald), #6366f1 (indigo violet)
- Design Style: Sharp architectural geometry, glassmorphism cards, neon glows
- Fonts: Outfit (headings), Inter (body), JetBrains Mono (code/numbers)

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (production CDN, UMD) |
| Language | TypeScript (source) + plain JS (bundle) |
| Styling | Vanilla CSS (src/styles/main.css) |
| State | React Context API (HabitlyContext) |
| Storage | localStorage with JSON serialization |
| Sound | Web Audio API (custom synthesizer) |
| Animations | CSS keyframes + canvas confetti |
| Notifications | Native Web Notification API |
| Server | PowerShell HTTP server (server.ps1) |
| Build | Pre-compiled bundle (dist/habitly.bundle.js) |

---

## 3. FILE STRUCTURE

`
c:\Users\Admin\Desktop\sadaf\
|
+-- index.html              # Entry point: loads CDN React + bundle
+-- server.ps1              # PowerShell local HTTP server (port 8080)
+-- package.json            # NPM config (Vite + TypeScript)
+-- tsconfig.json           # TypeScript compiler config
+-- vite.config.ts          # Vite bundler config
+-- handover.md             # THIS FILE
|
+-- dist/
|   +-- habitly.bundle.js   # Pre-compiled production bundle (instant load)
|
+-- src/
    +-- types/
    |   +-- index.ts        # All TypeScript interfaces and types
    |
    +-- utils/
    |   +-- storage.ts      # localStorage helpers + seed data
    |   +-- sound.ts        # Web Audio API SoundEngine class
    |   +-- confetti.ts     # Canvas confetti explosion engine
    |
    +-- context/
    |   +-- HabitlyContext.tsx  # Global React Context + all business logic
    |
    +-- components/
    |   +-- Navigation.tsx          # Left sidebar with nav items + XP bar
    |   +-- Topbar.tsx              # Top header: Level, Sparks, Streak, Bells
    |   +-- CommandCenter.tsx       # Home screen: gauge + habit chips + tasks
    |   +-- HabitTracker.tsx        # Habit grid with steppers + history dots
    |   +-- ScheduleArchitect.tsx   # Time-blocking timeline with live clock
    |   +-- SmartReminderCenter.tsx # Reminder dashboard with browser alerts
    |   +-- TodoHub.tsx             # Daily priorities checklist
    |   +-- AnalyticsHub.tsx        # Canvas charts + 4-week heatmap
    |   +-- RewardVault.tsx         # Gamified point store
    |   +-- NotificationDrawer.tsx  # Slide-out notification panel
    |   +-- modals/
    |       +-- AddHabitModal.tsx       # STAR Full frequency + unit builder modal
    |       +-- AddScheduleModal.tsx    # Time block creator
    |       +-- AddReminderModal.tsx    # Smart reminder builder
    |       +-- SkipHabitModal.tsx      # Skip with streak protection
    |       +-- PauseHabitModal.tsx     # Life-phase freeze modal
    |       +-- AddRewardModal.tsx      # Custom reward creator
    |       +-- WidgetGuideModal.tsx    # PWA install guide
    |       +-- LevelUpModal.tsx        # Level up celebration
    |
    +-- styles/
        +-- main.css        # Master stylesheet (2400+ lines)
`

---

## 4. SERVER SETUP

### Running the Server
`powershell
# Background daemon (already running as task-305)
powershell -ExecutionPolicy Bypass -File .\server.ps1

# Access at:
http://localhost:8080
`

### Background Task
- Task ID: task-305
- Status: Running (daemon)
- Log: C:\Users\Admin\.gemini\antigravity-ide\brain\4b86f39a-c333-4a77-8cd2-f5343aeae151\.system_generated\tasks\task-305.log

### Why Pre-Compiled Bundle?
The src/ TypeScript files are compiled into dist/habitly.bundle.js because:
- In-browser Babel with multi-file ES imports caused slow load times (network waterfall stalls)
- Pre-compiled bundle gives sub-50ms instant execution
- src/ remains modular TypeScript for developer maintainability

---

## 5. CORE FEATURES

### 5.1 Home Command Center
- SVG Circular Gauge: animated percentage of today's habits completed
- Quick-Access Habit Chips: 1-tap log, increment (for multi-count habits), skip, pause
- Multi-Frequency Badge: shows "3/8 glasses" live on chips for countable habits
- Urgent Priority Tasks: top 4 pending tasks shown inline
- Performance Telemetry: lifetime completions, best streak, level title, streak shields

### 5.2 Custom Schedule Architect
- Interactive time-blocking timeline
- Live local time telemetry with "ACTIVE TIME BLOCK NOW" pulse indicator
- Day selector tabs (Today, Mon-Sun)
- Linkable to existing habits

### 5.3 Smart Notification and Reminder Engine
- Native Web Notification API (Notification.requestPermission())
- Configurable per-day reminders with time triggers
- Types: habit, schedule, streak_shield, hydration, custom
- In-app toast system + notification drawer

### 5.4 STAR Custom Frequency for Habits (Latest Feature)

#### Frequency Types Supported
| Type | Description | Example |
|------|-------------|---------|
| daily | Once per day | Morning meditation |
| times_per_day | Any target amount per day + unit | 8 glasses, 50 reps, 2000 ml |
| days_per_week | N days per week (1-7) | 5 days/week gym |
| times_per_week | N executions per week | 10 times/week |
| days_per_month | N days per month (1-31) | 20 days/month |
| interval | Every N days | Every 3 days |
| weekdays | Mon-Fri only | Work journaling |
| weekends | Sat-Sun only | Long runs |

#### Unit Presets
When using times_per_day or times_per_week, users can choose:
- times, glasses, pages, reps, mins, ml, liters, blocks, km
- Or type a fully custom unit (e.g. pushups, laps, servings)

#### Quick Amount Chips
Preset amounts for rapid selection: 1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 2000

#### Live Preview
As the user configures frequency, a live preview pill shows:
  Execute 8 glasses every single day

#### Smart Increment Scaling
For large targets (e.g. 2000 ml), the +/- buttons auto-scale:
- Target >= 500: increments by 100
- Target >= 50: increments by 5
- Otherwise: increments by 1

#### Inline Count Editing
Users can click the current count number in the stepper to type an exact value directly (e.g. jump straight to 1750/2000).

### 5.5 Gamification System
- Level/XP Progression: 7 tiers from "Novice Seeker" to "Master of Routine"
- Spark Points: earned per habit/task completion, spent on rewards
- Streak System: daily streak counter with best streak tracking
- Streak Shields: skip/pause protection to freeze streaks
- Reward Vault: unlockable rewards with level gates and point costs
- Canvas Confetti: 90-particle explosion on habit completion / level up
- Web Audio Synthesizer: sound effects for clicks, completions, level ups

### 5.6 Analytics Hub
- 7-Day Completion Velocity: HTML5 Canvas curve chart
- 4-Week Activity Heatmap: 28-cell contribution matrix (4 intensity levels)
- Overall completion score

### 5.7 Widget Dock
- Pomodoro Timer: 25m/5m/15m modes with session counter
- 1-Tap Quick Logger: dropdown habit selector for instant logging
- Streak Shield Armor: status display
- Stoic Quote Rotator: rotating motivational quotes

### 5.8 Daily Priorities Hub
- Priority levels: Urgent / High / Medium / Low
- Filter tabs + strike-through completion states
- Due time badges, category tags

---

## 6. TYPE DEFINITIONS (src/types/index.ts)

`	ypescript
export type HabitFrequencyType =
  | 'daily'
  | 'times_per_day'
  | 'days_per_week'
  | 'times_per_week'
  | 'days_per_month'
  | 'weekdays'
  | 'weekends'
  | 'interval';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequencyType: HabitFrequencyType;
  frequencyCount: number;       // Any amount: 1, 8, 50, 2000
  frequencyUnit?: string;       // 'glasses', 'reps', 'ml', 'pages', custom
  todayCount: number;           // Progress toward today's target
  streak: number;
  bestStreak: number;
  targetDays: number;
  completedDays: number;
  completedToday: boolean;
  status: HabitStatus;          // 'active' | 'skipped' | 'paused'
  skipReason?: string;
  pauseReason?: string;
  pausedUntil?: string;
  icon: string;
  color: string;
  history: Record<string, 'completed' | 'skipped' | 'missed'>;
  createdAt: string;
}
`

---

## 7. CONTEXT API (src/context/HabitlyContext.tsx)

### Key Habit Actions
`	ypescript
toggleHabit(id: string)                     // Mark complete / incomplete
incrementHabitCount(id: string, amount?)    // +1 or +N to todayCount
decrementHabitCount(id: string, amount?)    // -1 or -N from todayCount
setHabitCount(id: string, count: number)    // Jump directly to specific count
addHabit(data)                              // Create new habit with all fields
deleteHabit(id: string)
openSkipModal(id, name)                     // Skip with reason + streak protection
openPauseModal(id, name)                    // Pause for life-phase freeze
resumeHabit(id: string)
`

### XP and Rewards
`
toggleHabit (complete)       +25 XP, +20 Spark Points
incrementHabitCount (done)   +30 XP, +25 Spark Points
toggleScheduleBlock (done)   +20 XP, +15 Spark Points
toggleTask (complete)        +15 XP, +10 Spark Points
levelUp                      +50 bonus Spark Points
`

---

## 8. BUNDLE vs SOURCE

### What's in dist/habitly.bundle.js
The pre-compiled bundle is a standalone vanilla JS file that:
- Contains all component logic as h(...) (React.createElement) calls
- Contains all context, state management, and data
- Does NOT use ES module imports (all inlined)
- Is approx 110KB (fast load)

### IMPORTANT: Bundle is NOT auto-updated
When you edit src/ TypeScript files, you MUST manually update the bundle OR run a Vite build:

`powershell
npx vite build
`

WARNING: The latest frequency features are in src/ but NOT yet in dist/habitly.bundle.js.
To get them live on http://localhost:8080, rebuild the bundle.

---

## 9. LATEST CHANGES (Current Session)

### src/types/index.ts
- Added times_per_week and days_per_month to HabitFrequencyType
- Added frequencyUnit?: string field to Habit interface

### src/context/HabitlyContext.tsx
- incrementHabitCount(id, amount?) now accepts optional amount parameter
- decrementHabitCount(id, amount?) now accepts optional amount parameter
- Added setHabitCount(id, count) to jump to any specific count value
- addHabit() now accepts frequencyUnit field
- Context type updated to expose setHabitCount

### src/components/modals/AddHabitModal.tsx (STAR Major Upgrade)
- Added frequencyUnit state + customUnit state
- Added 10 unit presets (times, glasses, pages, reps, mins, ml, liters, blocks, km, custom)
- Added quick amount preset chips (1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 2000)
- Added times_per_week and days_per_month frequency options
- Added live preview pill showing the configured schedule in plain language
- Custom unit text input when "custom" unit is selected
- No more artificial max=50 cap, supports any amount up to 99999

### src/components/HabitTracker.tsx (STAR Major Upgrade)
- Added setHabitCount from context
- Added editingHabitCount state for inline count editing
- Smart increment scaling (x1, x5, x100 based on target size)
- Clickable current count to switch to inline input for exact value entry
- Mini daily progress bar under stepper
- Stepper header shows percentage progress
- Updated formatFrequencyBadge for all 8 frequency types
- Shows frequencyUnit in stepper display (e.g. "5 / 8 glasses")

### src/components/CommandCenter.tsx
- Added incrementHabitCount to context destructuring
- Quick habit chips now show "3/8 glasses" badge for countable habits
- Added chip-increment-btn (+) for multi-count habits in command center
- Chip click behavior: multi-count habits increment on click, daily habits toggle

### src/styles/main.css (New CSS Classes Added)
- .frequency-box-header: flex header for frequency config box
- .live-preview-pill: chartreuse preview text badge
- .frequency-number-input: styled large number input
- .unit-selector-wrap: wrapper for unit dropdown area
- .unit-custom-input: custom unit text input
- .input-unit-tag: updated with background/border styling
- .quick-amount-presets / .quick-unit-presets: layout containers
- .preset-label: small monospace label
- .preset-chips-list: flex chip row
- .preset-chip / .preset-chip.active: interactive amount/unit chips
- .stepper-header-row: flex row with label + percent
- .stepper-percent-tag: chartreuse percentage badge
- .stepper-inline-input: inline editable count input
- .stepper-mini-bar-track / .stepper-mini-bar-fill: mini progress bar
- .chip-subline: flex row for chip streak + badge
- .chip-freq-count-badge: chartreuse count/unit badge on chips
- .chip-category-text: muted category text
- .chip-increment-btn: chartreuse + button for command center chips

---

## 10. KNOWN ISSUES AND NOTES

### Bundle vs Source Sync
WARNING: The dist/habitly.bundle.js is NOT updated with the latest frequency features from this session.
The live site at http://localhost:8080 still uses the old bundle.
Run 
px vite build to compile the latest src/ into dist/.

### Vite Build Command
`powershell
cd c:\Users\Admin\Desktop\sadaf
npx vite build
`

### Manual Bundle Update Reference
The bundle (dist/habitly.bundle.js) uses vanilla h(...) calls (not JSX).
If updating manually, the relevant sections are:
- Line ~2032-2168: ModalsAndToasts > AddHabitModal section
- Line ~1612-1752: HabitTracker function
- Line ~1157-1330: CommandCenter function
- Line ~600-1025: HabitlyProvider context

---

## 11. DESIGN SYSTEM TOKENS

`css
--neon-chartreuse: #D4FF00
--neon-emerald:   #00F59B
--neon-violet:    #6366F1
--neon-cyan:      #06B6D4
--neon-amber:     #F59E0B
--neon-rose:      #EC4899

--bg-obsidian:    #06040a
--bg-deep:        #0b0714
--bg-panel:       #100820

--border-glass:   rgba(255,255,255,0.08)
--border-subtle:  rgba(255,255,255,0.04)
--border-chartreuse: rgba(212,255,0,0.25)

--font-heading:   'Outfit', sans-serif
--font-body:      'Inter', sans-serif
--font-mono:      'JetBrains Mono', monospace

--radius-xs: 4px
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
`

---

## 12. GAMIFICATION DATA

### Level Tiers
| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Novice Seeker | 0-100 |
| 2 | Habit Initiate | 100-300 |
| 3 | Disciplined Mind | 300-600 |
| 4 | Focus Practitioner | 600-1000 |
| 5 | Flow Architect | 1000-1500 |
| 6 | Zen Catalyst | 1500-2200 |
| 7 | Master of Routine | 2200-3000 |

### Default Seed State
- Level: 3 (Disciplined Mind), XP: 450/600
- Spark Points: 620
- Total Habits Completed: 48
- Current Streak: 12 days, Best Streak: 19 days
- Streak Shields: 2

---

## 13. INITIAL SEED HABITS

| Habit | Frequency Type | Target |
|-------|---------------|--------|
| Morning Meditation and Breathwork | daily | 1x/day |
| Deep Work Session (90 Mins) | times_per_day | 2x/day |
| Hydration Target (Glasses of Water) | times_per_day | 8 glasses/day |
| Strength Training / Calisthenics | days_per_week | 5 days/week |
| Read 20 Pages Non-Fiction | daily | 1x/day |
| Guitar Practice and Creative Flow | interval | every 2 days (PAUSED) |

---

## 14. WHAT TO DO NEXT

### Immediate (To Make Latest Features Live)
1. Run 
px vite build to compile src/ into dist/habitly.bundle.js
2. Verify http://localhost:8080 loads the updated bundle
3. Test creating a habit with 2000 ml target, verify stepper increments by 100

### Possible Future Enhancements
- Edit existing habit (name, frequency, unit, color, icon)
- Calendar view / monthly habit completion grid
- Export data (CSV / JSON backup)
- Light mode toggle
- Push notifications / service worker for background reminders
- Habit streaks based on days_per_week (not just daily completion)
- Weekly/monthly review report modal
- AI-powered habit suggestions based on category patterns
- Sync to cloud (Firebase / Supabase)

---

## 15. CONVERSATION CONTEXT

- Conversation ID: 4b86f39a-c333-4a77-8cd2-f5343aeae151
- Workspace: c:\Users\Admin\Desktop\sadaf
- Artifacts Directory: C:\Users\Admin\.gemini\antigravity-ide\brain\4b86f39a-c333-4a77-8cd2-f5343aeae151\
- Server Task: task-305 (still running)

---

Last updated: 2026-09-25 22:33 IST
