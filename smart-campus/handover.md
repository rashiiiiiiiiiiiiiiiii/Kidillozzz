# 🎓 Smart Campus Platform — Developer Handover & Project Roadmap

> **Platform Version:** 1.0.0-STABLE  
> **Architecture:** Modular Full-Stack (React 18 + Node.js Express + Supabase PostgreSQL + Redis)  
> **Design Theme:** Futuristic Maximalist Black & Yellow Digital University OS  
> **Target Audience:** Next Engineering Team / Feature Developers  

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Existing Features in Current Project](#2-existing-features-in-current-project)
   - [Authentication & Role-Based Access Control](#21-authentication--role-based-access-control)
   - [Database Layer & Schema](#22-database-layer--schema)
   - [Backend Architecture & Plug-In Pattern](#23-backend-architecture--plug-in-pattern)
   - [Cross-Module Notifications Engine](#24-cross-module-notifications-engine)
   - [Admin User Management](#25-admin-user-management)
   - [Frontend Architecture & Design System](#26-frontend-architecture--design-system)
   - [Command Centers & Dashboards](#27-command-centers--dashboards)
3. [Roadmap: New Features to Be Added](#3-roadmap-new-features-to-be-added)
   - [Feature 1: Smart Attendance & Roll Call](#31-feature-1-smart-attendance--roll-call)
   - [Feature 2: Campus Grievances & Complaint Desk](#32-feature-2-campus-grievances--complaint-desk)
   - [Feature 3: Campus Events & Innovation Sprints](#33-feature-3-campus-events--innovation-sprints)
   - [Feature 4: Academic Grading & Transcript Portal](#34-feature-4-academic-grading--transcript-portal)
   - [Feature 5: Digital Library & Research Repository](#35-feature-5-digital-library--research-repository)
   - [Feature 6: Real-Time WebSocket / SSE Push Delivery](#36-feature-6-real-time-websocket--sse-push-delivery)
   - [Feature 7: Hostel Gate Pass & Mess Feedback](#37-feature-7-hostel-gate-pass--mess-feedback)
   - [Feature 8: Campus Digital Wallet & Fees](#38-feature-8-campus-digital-wallet--fees)
4. [Quickstart & Development Commands](#4-quickstart--development-commands)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Pull Request & Code Review Checklist](#6-pull-request--code-review-checklist)

---

## 1. Executive Summary

The Smart Campus platform is designed as an all-in-one digital operating system for academic institutions. The platform connects **Students (Scholars)**, **Faculty (Instructors)**, and **Administrators** into a unified, secure ecosystem.

The codebase has been engineered with a **strict modular plug-in architecture**: the core backbone (authentication, authorization, database connections, error handling, notifications, layout shell) is completely built and operational. Incoming engineering teams can implement standalone feature modules (Attendance, Complaints, Events, etc.) by dropping in self-contained folders without risking or refactoring existing infrastructure.

---

## 2. Existing Features in Current Project

### 2.1 Authentication & Role-Based Access Control
- **JWT Dual-Token Security:**
  - Short-lived Access Tokens (15 min) for authorized API requests.
  - Long-lived Refresh Tokens (7 days) stored securely in the PostgreSQL `refresh_tokens` table for revocation capability (e.g., on logout).
  - Client-side Axios interceptor automatically detects `401 Unauthorized` responses and refreshes the access token seamlessly in the background without logging the user out.
- **Bcrypt Password Encryption:** Passwords hashed with 10 salt rounds before storage.
- **Three Core Personas:**
  - `student`: Access to personal scholar command center, attendance logs, timetables, and notification feed.
  - `faculty`: Access to instructor console, student leave approvals, roll call launcher, and batch circular broadcasts.
  - `admin`: Full unrestricted master access, platform telemetry, user management, and health diagnostics.
- **Route Authorization Middleware:**
  - `auth`: Verifies Bearer JWT and injects `req.user = { id, email, role }`.
  - `authorize(...allowedRoles)`: Restricts specific routes (e.g. `authorize('admin')`, `authorize('faculty', 'admin')`).

### 2.2 Database Layer & Schema
Connected directly to a cloud **Supabase PostgreSQL 17** instance (`aws-0-ap-northeast-1` pooler with IPv4 and SSL encryption).

- **`users` Table:**
  ```sql
  CREATE TABLE users (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
      department    VARCHAR(100),
      batch         VARCHAR(20),       -- For students: e.g. "2023-2027"
      designation   VARCHAR(100),      -- For faculty: e.g. "Associate Professor"
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```
- **`notifications` Table (Shared Cross-Module Bus):**
  ```sql
  CREATE TABLE notifications (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title         VARCHAR(200) NOT NULL,
      message       TEXT NOT NULL,
      source_module VARCHAR(50) NOT NULL, -- 'attendance', 'complaints', 'events', 'system'
      read_status   BOOLEAN NOT NULL DEFAULT FALSE,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  -- Partial index for lightning-fast unread queries:
  CREATE INDEX idx_notifications_unread ON notifications(user_id, read_status) WHERE read_status = FALSE;
  ```
- **`refresh_tokens` Table:**
  ```sql
  CREATE TABLE refresh_tokens (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      VARCHAR(500) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```
- **Node-Based Migration Runner (`server/db/migrate.js`):** Run with `npm run migrate` (no need to have `psql` CLI installed locally).

### 2.3 Backend Architecture & Plug-In Pattern
Every domain lives in `server/modules/<feature>/` following the 3-file pattern:
- `<feature>.service.js`: Database queries, business logic, transactions.
- `<feature>.controller.js`: Request parsing, HTTP status codes, error forwarding to `next(err)`.
- `<feature>.routes.js`: Express router definitions with middleware bindings.

Mounted in `server/app.js`:
```javascript
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/notifications', require('./modules/notifications/notifications.routes'));
```

### 2.4 Cross-Module Notifications Engine
- Any backend module can send notifications to a user via:
  ```javascript
  const { createNotification } = require('../notifications/notifications.service');
  await createNotification({ userId, title, message, sourceModule });
  ```
- Features automatic cache invalidation and Pub/Sub publishing.
- Includes **resilient Redis fallback**: if Redis is offline during development, operations silently fall back to PostgreSQL with zero server crashes.

### 2.5 Admin User Management
- Full backend CRUD endpoints under `/api/users`.
- Role filtering (`/api/users?role=student`), pagination, and user deletion (`DELETE /api/users/:id`).
- Dedicated frontend user management table with search, role filters, and identity revocation.

### 2.6 Frontend Architecture & Design System
- **Framework:** React 18 + Vite with fast HMR (`~600ms` dev start, `~1.5s` production build).
- **Design System:** Maximalist Black & Yellow Cyber-Academic Theme in [index.css](file:///d:/IEDC%20Workshop/smart-campus/client/src/index.css):
  - Palette: Deep Obsidian (`#07080B`), Layered Surfaces (`#10131A`, `#161A24`, `#1D2230`), High-Voltage Cyber Yellow (`#FEE500`), Crisp Text (`#F8FAFC`).
  - Typography: Space Grotesk (headings), Plus Jakarta Sans (body), JetBrains Mono (badges, metrics, code).
  - Tactical Components: Bento-grid system, tactile brutalist buttons with active press physics, glowing focus rings, modal dialogs, and responsive tables.
- **Toast Feedback System:** Built-in [ToastContext.jsx](file:///d:/IEDC%20Workshop/smart-campus/client/src/context/ToastContext.jsx) exposing `useToast()` for instant user action feedback.
- **Mobile Responsive Drawer:** Touch-friendly sliding sidebar with backdrop blur for viewports `< 860px`.

### 2.7 Command Centers & Dashboards
- **Student Dashboard:**
  - Hero banner with live campus clock, cohort info, and student ID.
  - Vital metrics: Term attendance percentage gauge, cumulative CGPA, registered credits, disciplinary standing.
  - Interactive Modals: Roll Call PIN Check-in (with simulated geofence GPS check), File Grievance Ticket modal, Digital Student ID Card modal with barcode.
  - Live Timetable Bento Card showing in-progress & upcoming lectures.
  - Course Modules progress meters.
- **Faculty Dashboard:**
  - Instructor header with department and designation.
  - Active teaching metrics: scholars taught, average section roll call, pending approvals.
  - Interactive Modals: Live Roll Call Generator (generates dynamic 6-digit session PIN), Broadcast Batch Circular modal.
  - Student Leave & Waivers Queue with interactive **Approve** and **Reject** actions.
- **Admin Dashboard:**
  - Infrastructure Telemetry: Supabase PostgreSQL pool status, Redis state, active connection count.
  - System Diagnostics Modal: Pings `/api/health` and calculates live round-trip latency.
  - Role Distribution Breakdown: Visual metric bars for students, faculty, and admins.
  - Direct shortcut to the full User Directory.
- **Notifications Hub (`/notifications`):**
  - Tab filters: *All*, *Unread*, *Attendance*, *Events*, *Grievances*.
  - Mark-as-read buttons and "Mark All as Read" action.
  - Real-time unread count indicator in the navbar bell.
- **User Directory (`/users`):**
  - Accessible exclusively to administrators via `<ProtectedRoute roles={['admin']}>`.
  - Searchable by name, email, or department.
  - Revoke access button with immediate UI state update.

---

## 3. Roadmap: New Features to Be Added

Here are the ready-to-build feature modules recommended for the incoming team:

```
                  ┌───────────────────────────────┐
                  │    Smart Campus Core (Done)   │
                  │ Auth • DB • RBAC • UI Shell   │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
 ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
 │  Attendance   │        │  Grievances   │        │ Campus Events │
 │ (Geo/QR Roll) │        │ (Helpdesk SLA)│        │(Passes/Clubs) │
 └───────────────┘        └───────────────┘        └───────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
 ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
 │   Grading &   │        │Digital Library│        │ Hostel / Mess │
 │  Transcripts  │        │ (Book Reserve)│        │ (Gate Passes) │
 └───────────────┘        └───────────────┘        └───────────────┘
```

---

### 3.1 Feature 1: Smart Attendance & Roll Call
**Goal:** Replace paper roll calls with verifiable, dynamic digital session codes.

#### Suggested DB Schema:
```sql
CREATE TABLE attendance_sessions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_code  VARCHAR(20) NOT NULL,
    session_pin  VARCHAR(6) NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL,
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance_records (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id   UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verified_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (session_id, student_id)
);
```

#### API Endpoints to Build (`server/modules/attendance/`):
- `POST /api/attendance/sessions` — Faculty launches a 10-minute session with a 6-digit PIN.
- `POST /api/attendance/check-in` — Student submits PIN; verifies validity and records roll call.
- `GET /api/attendance/student/history` — Student views attendance percentage per subject.
- `GET /api/attendance/faculty/summary/:sessionId` — Faculty views real-time attendance roster.

#### Notification Trigger:
When a student's attendance drops below 75%, trigger an automated warning:
```javascript
createNotification({
  userId: studentId,
  title: 'Attendance Alert: Below 75%',
  message: `Your attendance in ${courseCode} is currently 71.4%. Please contact your course advisor.`,
  sourceModule: 'attendance'
});
```

---

### 3.2 Feature 2: Campus Grievances & Complaint Desk
**Goal:** Transparent ticketing system for hostel maintenance, academic requests, and ragging/harassment reporting.

#### Suggested DB Schema:
```sql
CREATE TABLE complaints (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category     VARCHAR(50) NOT NULL, -- 'hostel', 'academic', 'mess', 'infrastructure'
    title        VARCHAR(200) NOT NULL,
    description  TEXT NOT NULL,
    status       VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority     VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'URGENT')),
    assigned_to  UUID REFERENCES users(id),
    resolution   TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

#### API Endpoints to Build (`server/modules/complaints/`):
- `POST /api/complaints` — Student lodges a complaint.
- `GET /api/complaints/my` — Student tracks their tickets.
- `GET /api/complaints/queue` — Faculty/Admin views open departmental queue.
- `PATCH /api/complaints/:id/status` — Assignee updates status to `IN_PROGRESS` or `RESOLVED` with notes.

---

### 3.3 Feature 3: Campus Events & Innovation Sprints
**Goal:** Event discovery, team registration for hackathons/cultural fests, and digital ticket passes.

#### Suggested DB Schema:
```sql
CREATE TABLE events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(200) NOT NULL,
    description  TEXT NOT NULL,
    category     VARCHAR(50) NOT NULL, -- 'HACKATHON', 'SEMINAR', 'CULTURAL', 'SPORTS'
    venue        VARCHAR(150) NOT NULL,
    start_time   TIMESTAMPTZ NOT NULL,
    end_time     TIMESTAMPTZ NOT NULL,
    capacity     INT DEFAULT 100,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_registrations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qr_token     VARCHAR(255) UNIQUE NOT NULL,
    attended     BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);
```

#### API Endpoints to Build (`server/modules/events/`):
- `GET /api/events` — Public / authenticated list of upcoming events.
- `POST /api/events` — Faculty/Admin creates a new event.
- `POST /api/events/:id/register` — Student registers; generates a unique `qr_token`.
- `POST /api/events/:id/verify-entry` — Scanner validates entry QR code at venue gate.

---

### 3.4 Feature 4: Academic Grading & Transcript Portal
**Goal:** Internal marks entry, GPA computation, and transcript PDF generation.
- **Faculty Capabilities:** Upload CSV/Excel with marks for internal assessments (quiz, midterms, lab).
- **Student Capabilities:** Real-time GPA projection calculator, downloadable semester grade card.
- **Admin Capabilities:** Lock grades after senate approval.

---

### 3.5 Feature 5: Digital Library & Research Repository
**Goal:** Campus book availability search, reservation queue, and research paper access.
- **Features:**
  - Search books by title, author, or ISBN.
  - 1-click book reservation with 24-hour pickup hold.
  - Automated due date reminder notifications 2 days prior to overdue date.

---

### 3.6 Feature 6: Real-Time WebSocket / SSE Push Delivery
**Goal:** Eliminate client polling for notifications.
- **Current state:** Redis pub/sub is already configured on the backend (`redis.publish('notifications:${userId}', ...)`).
- **Next step:** Attach Socket.io or an Express Server-Sent Events (SSE) route at `/api/notifications/stream`.
- When `createNotification` is executed, the SSE stream or Socket pushes the new notification directly to the user's browser, triggering a toast alert instantly!

---

### 3.7 Feature 7: Hostel Gate Pass & Mess Feedback
**Goal:** Digital hostel exit requests and daily dining quality ratings.
- **Night-Out / Outstation Gate Pass:** Student fills destination and reason; parent/warden receives approval trigger.
- **Daily Mess Menu & Rating:** Students rate meals to enforce food quality benchmarks.

---

### 3.8 Feature 8: Campus Digital Wallet & Fees
**Goal:** Student tuition fees, fine payments, and canteen purchases.
- Integration with Razorpay / Stripe test gateway.
- Printable fee receipt generation with digital signature stamp.

---

## 4. Quickstart & Development Commands

### Starting the Backend:
```powershell
cd "d:\IEDC Workshop\smart-campus\server"
npm run dev
# Running on http://localhost:5000 (connected to Supabase PostgreSQL 17)
```

### Starting the Frontend:
```powershell
cd "d:\IEDC Workshop\smart-campus\client"
npm run dev
# Running on http://localhost:5173
```

### Running Database Migrations:
```powershell
cd "d:\IEDC Workshop\smart-campus\server"
npm run migrate
```

### Testing Production Frontend Build:
```powershell
cd "d:\IEDC Workshop\smart-campus\client"
npm run build
```

---

## 5. Environment Variables Reference

Located at `smart-campus/.env`:

| Variable | Description | Current Configured Value |
| :--- | :--- | :--- |
| `PORT` | API Server Port | `5000` |
| `NODE_ENV` | Runtime Environment | `development` |
| `DATABASE_URL` | Supabase Pooler URI (IPv4) | `postgresql://postgres.wrdggimpdeownssohyzx:swapathon%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` |
| `DB_HOST` | Database Hostname | `aws-0-ap-northeast-1.pooler.supabase.com` |
| `DB_PORT` | Database Port | `6543` |
| `DB_NAME` | Database Name | `postgres` |
| `DB_USER` | Pooler User | `postgres.wrdggimpdeownssohyzx` |
| `DB_PASSWORD` | Database Password | `swapathon@123` |
| `DB_SSL` | Enable SSL for Cloud DB | `true` |
| `JWT_ACCESS_SECRET` | Access Token Secret Key | `change_this_to_a_long_random_string` |
| `JWT_REFRESH_SECRET`| Refresh Token Secret Key | `change_this_to_another_long_random_string` |
| `CLIENT_URL` | Frontend Origin | `http://localhost:5173` |

---

## 6. Pull Request & Code Review Checklist

When implementing any of the new roadmap features, verify these 10 points:

1. [ ] **Modular Isolation:** Backend code lives entirely inside `server/modules/<feature>/`.
2. [ ] **No Raw SQL in Controllers:** All database interactions are inside `<feature>.service.js`.
3. [ ] **Parametric Queries:** Every query uses `$1, $2, ...` to prevent SQL injection.
4. [ ] **Role Protection:** Secured with `auth` and appropriate `authorize('student'|'faculty'|'admin')`.
5. [ ] **Error Propagation:** All async controllers use `try/catch` and pass errors to `next(err)` via `ApiError`.
6. [ ] **Notifications Integration:** Major events call `createNotification({ userId, title, message, sourceModule })`.
7. [ ] **Axios Client Used:** Frontend uses `client/src/api/axios.js` (no manual token headers needed).
8. [ ] **Design Tokens Applied:** Uses `.bento-card`, `.btn-primary`, `.badge`, `.input-field` from `index.css`.
9. [ ] **User Feedback:** Operations trigger `useToast()` notifications on success/error.
10. [ ] **Zero Compilation Errors:** `npm run build` in `client/` finishes with 0 errors.

---

**Prepared by Antigravity AI Engineering Assistant**  
*The platform is ready for feature development. Happy coding!*
