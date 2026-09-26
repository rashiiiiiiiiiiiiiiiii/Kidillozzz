-- ============================================================
-- Smart Campus Platform — Initial Migration
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- Users
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    department    VARCHAR(100),
    batch         VARCHAR(20),
    designation   VARCHAR(100),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ──────────────────────────────────────────────────────────────
-- Notifications
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         VARCHAR(200)  NOT NULL,
    message       TEXT          NOT NULL,
    source_module VARCHAR(50)   NOT NULL,
    read_status   BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_status)
    WHERE read_status = FALSE;

-- ──────────────────────────────────────────────────────────────
-- Refresh Tokens
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ──────────────────────────────────────────────────────────────
-- Seed: default admin account (password: admin123)
-- bcrypt hash for "admin123" with 10 rounds
-- ──────────────────────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, role, department)
VALUES (
    'Admin',
    'admin@smartcampus.dev',
    '$2a$10$93QyaRJ3g8avGIgGEkfoWO3QMXvGSXBNaotrQtnEi.VtXXciukI2i',
    'admin',
    'Administration'
)
ON CONFLICT (email) DO NOTHING;
