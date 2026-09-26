# HackerThorne — Project Handover & Complete Feature Guide

**HackerThorne** is an AI-powered Hackathon Squad Finder & Collaboration Platform designed for collegiate and web3 hackathon ecosystems (e.g., HackMIT, Stanford TreeHacks, ETHGlobal SF). It enables students and developers to discover complementary teammates, recruit missing roles to complete 5-person squads, coordinate sprint tasks via an interactive Kanban board, generate winning pitch blueprints, and evaluate demo readiness with an AI judge rubric simulator.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v10.x / v11.x)

### Running Locally
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access in Browser**:
   - Local: [http://localhost:5174/](http://localhost:5174/)
   - Network: `http://<your-local-ip>:5174/`

4. **Production Build & Verification**:
   ```bash
   npm run build
   ```

---

## 🌟 What Changes Were Made & Why (Simple & Easy to Understand)

Here is a simple, plain-English breakdown of all the improvements made to the platform:

### 1. 🧭 Fixed Navbar Congestion (Clean & Spacious Layout)
* **The Problem**: Previously, all 6 navigation tabs had long names that wrapped into 2–3 vertical lines of text (e.g., "AI Squad Builder" stacked awkwardly), and the right side had bulky text labels like `"ACTING AS:"` that squished the navigation bar and pushed buttons off the screen.
* **The Solution**:
  * **Short, Punchy Tab Labels**: Renamed tabs cleanly to **Squads**, **Talent**, **AI Builder**, **AI Copilot**, **Inbox**, and **Chat**.
  * **Prevented Line Wrapping**: Added `white-space: nowrap` so tab labels stay neatly on a single line.
  * **Streamlined User Switcher**: Removed the redundant `"ACTING AS:"` label and styled the student switcher as a sleek rounded pill with an avatar and dropdown.
  * **Organized Utility Cluster**: Grouped secondary tools (theme colors, sound switch, `?` shortcut help, and reset button) into a neat, compact icon bar.
  * **Result**: The header now looks balanced, spacious, and modern across all screen sizes.

---

### 2. 📋 Upgraded Sprint Tasks into an Interactive Kanban Board
* **The Problem**: Sprint tasks were previously just a plain checklist inside the project modal.
* **The Solution**: 
  * Replaced the simple list with a real **4-column Agile Kanban Board**:
    1. **📋 Backlog**
    2. **🔨 In Progress**
    3. **🧪 Review / Testing**
    4. **✅ Demo Ready (Done)**
  * Added **1-click movement buttons** (`←` and `→`) to advance tasks between stages.
  * Added **priority tags** (*Urgent* in red, *High* in amber, *Medium* in blue).
  * Added a **Quick-Add Task Bar** where you can specify task title, target role, and priority level.
  * Live sprint velocity updates automatically across project cards in the explorer.

---

### 3. 🏆 Added Demo Day Readiness & Judge Rubric Simulator
* **The Problem**: Teams at hackathons never know if they are truly ready for judge evaluations until it's too late.
* **The Solution**:
  * Created an automated **Judge Rubric Evaluator** with a circular **Readiness Score (0–100%)** that analyzes:
    1. **Technical Difficulty & MVP (30%)**: Checks backend endpoints, schema models, and working code tasks.
    2. **UI/UX Polish & Usability (25%)**: Checks for a confirmed designer and completed Figma wireframes.
    3. **Pitch & Demo Storytelling (25%)**: Checks for a pitch presenter and demo script milestones.
    4. **Squad Role Coverage (20%)**: Checks if the full 5-role squad is filled.
  * Provides **AI Judge Advisory Tips** giving specific, actionable recommendations on what to finish next before code freeze.

---

### 4. 💡 Added AI Pitch Copilot & Winning Blueprints (New View)
* **The Problem**: Hackers often struggle with coming up with a winning idea or structuring a 3-minute presentation.
* **The Solution**:
  * Added a new **AI Pitch Copilot** view featuring curated, high-impact blueprints across AI & Education, HealthTech, Web3, and Climate tracks.
  * Each blueprint provides:
    * Catchy project title & one-line elevator hook.
    * The problem statement & target audience.
    * The technical solution & architecture.
    * A **3-Minute Demo Day Pitch Flow** (Hook, Pain Point, Live Demo, Market Impact).
    * Recommended 5-role team matrix & required tech stack.
    * The unique "Winning Edge" that impresses judges.
  * Includes a **1-Click "Launch as Live Squad"** button that automatically pre-fills the Create Project form so you can start recruiting immediately.

---

### 5. 🚀 Added 1-Click Devpost & Submission Export
* **The Problem**: Writing hackathon submissions on Devpost or GitHub at the last minute is stressful and time-consuming.
* **The Solution**:
  * Added a dedicated **Devpost Export tab** in the Squad Hub.
  * Automatically generates clean, standardized markdown containing:
    * Project Title & Tagline
    * Inspiration & Purpose
    * What It Does
    * How We Built It (Tech Stack)
    * Challenges & Accomplishments
    * Confirmed Team Roster
  * Added a **1-click "Copy to Clipboard"** button with checkmark confirmation feedback.

---

### 6. ★ Added Talent Bookmarking & Student Dossier Modal
* **The Problem**: In a directory of many students, you couldn't easily save candidates or inspect their full backgrounds.
* **The Solution**:
  * Added a **★ Star Bookmark button** to every student card so you can shortlist preferred hackers.
  * Added a **"★ Shortlisted" quick filter** to view your saved candidates instantly.
  * Created a **Candidate Dossier Modal** that opens when clicking a student's name or avatar, displaying their full bio, graduation year, working style, availability, hackathon trophy case, portfolio links (GitHub, live site, LinkedIn, Discord), and synergy rating.

---

### 7. 💬 Added Chat Superpowers & Slash Commands
* **The Problem**: Team messaging was basic and lacked hackathon sprint utilities.
* **The Solution**:
  * Added **Slash Commands**:
    * `/standup` — instantly formats and posts a 3-part daily standup update (*Yesterday*, *Today*, *Blockers*).
    * `/task [title]` — dynamically adds a new task directly to the project's Kanban board right from the chat box!
    * `/beacon` — broadcasts an urgent squad recruitment call to the channel.
  * Added an **animated typing indicator** (`Alex is typing...`) before teammates reply to make chat feel alive and realistic.

---

### 8. 🎨 Added Theme Accent Switcher & Live Countdown Clock
* **The Problem**: The header was static and lacked real-time hackathon urgency.
* **The Solution**:
  * Added a **Theme Accent Switcher** (Electric Indigo, Cyber Cyan, Emerald Neon, Sunset Amber) that updates the accent glow and primary colors instantly.
  * Added a **Live Ticking Countdown Clock** in the hero banner counting down days, hours, minutes, and seconds to the next hackathon deadline.
  * Made the countdown cards interactive: clicking any hackathon (e.g. *HackMIT 2026*) instantly filters the project explorer.

---

### 10. 🕶️ Premium Hacker Aesthetic & Cyber UI Overhaul
* **The Problem**: The app's design was sleek but lacked the raw, energetic "hacker" identity associated with coding events, and the filter/sort bar took up too much vertical space.
* **The Solution**:
  * **Hacker Theme Overhaul**: Switched the entire color palette to a deep obsidian background with neon green (`#00ff41`) primary accents and integrated the `JetBrains Mono` terminal font for all typography to give a true developer feel.
  * **Animated Moving Grid Background**: Injected a subtle, animated geometric grid overlay that slowly translates across the background to create a sense of continuous motion and depth.
  * **Smooth Glowing Card Lines**: Enhanced all interactive cards (Project, Student, Inbox) with a custom CSS `conic-gradient` animation. On hover, a neon scanning beam seamlessly orbits the card's border.
  * **Cyber Dropdown Menu**: Consolidated the flat sorting and filtering chips into an `Advanced Targeting` dropdown.
  * **Glitch Animations**: Triggering the dropdown activates a 3D fold-out panel with a custom `cyberGlitch` CSS animation, momentarily slicing and color-shifting the panel as it loads.

---

### 9. ⚡ Code Optimizations & Performance
* **Debounced Search**: Text searches on both projects and talent profiles are debounced by 150ms so typing stays silky smooth without lag.
* **Web Audio API Synthesizer**: Built a native, procedural sound synthesizer providing gentle sound effects for clicks, message pops, task progression, and invite confirmations (requires zero external audio files, with a mute toggle).
* **Keyboard Shortcuts**: Added global hotkeys (`1`–`6` for navigation, `/` for search, `Esc` to close modals, `?` for the cheat sheet).
* **Safe HTML Escaping**: Sanitized all user inputs (descriptions, chat messages, notes, task titles) to prevent rendering glitches and injection.
* **Clean Build**: Successfully bundles via Vite in **~400ms** with zero errors or warnings.

---

## 📂 Codebase File Structure

| File | Description |
|---|---|
| [`package.json`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/package.json) | NPM project definition, scripts (`dev` on port 5174, `build`, `preview`), and Vite dependencies |
| [`index.html`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/index.html) | Semantic HTML5 structure, navigation, view panels, modals, and templates |
| [`index.css`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/index.css) | Custom design system, glassmorphism, theme accents, animations, Kanban styling, and responsive layout |
| [`app.js`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/app.js) | Core ES Module: State management, sound synthesizer, Kanban board, judge rubric engine, AI pitch copilot, candidate dossier, debounced search, keyboard shortcuts |
| [`mockData.js`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/mockData.js) | Rich mock dataset: student profiles, hackathon projects with sprint tasks, Devpost drafts, requests, chats, and pitch blueprints |
| [`handover.md`](file:///c:/Users/Godzeye/Downloads/rockz-main/rockz-main/hackerthorne/handover.md) | Project handover documentation and complete feature guide |
