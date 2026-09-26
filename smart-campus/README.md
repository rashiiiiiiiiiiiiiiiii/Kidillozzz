# Smart Campus Platform

A modular, role-based smart campus management system.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Cache/Realtime:** Redis

## Quick Start

### 1. Clone & configure

```bash
cp .env.example .env
# Edit .env with your PostgreSQL and Redis credentials
```

### 2. Create the database

```bash
createdb smart_campus
# Then run the migration:
psql -d smart_campus -f server/db/migrations/001_init.sql
```

### 3. Start the backend

```bash
cd server
npm install
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm install
npm run dev
```

## Project Structure

- `server/modules/` — Each feature is a self-contained module (routes + controller + service).
- `server/middleware/` — Shared auth & authorization middleware used by all modules.
- `client/src/modules/` — Frontend feature modules (mirrors backend structure).

## Roles

| Role | Access |
|------|--------|
| `student` | Personal dashboard, notifications |
| `faculty` | Faculty dashboard, notifications |
| `admin` | Full access, user management |
