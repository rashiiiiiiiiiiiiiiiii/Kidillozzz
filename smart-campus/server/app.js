const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Module routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');

const app = express();

// ── Global middleware ────────────────────────────────────────
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);

// ── Future modules plug in here ──────────────────────────────
// app.use('/api/attendance', require('./modules/attendance/attendance.routes'));
// app.use('/api/complaints', require('./modules/complaints/complaints.routes'));
// app.use('/api/events', require('./modules/events/events.routes'));

// ── 404 catch-all ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: { status: 404, message: 'Route not found' } });
});

// ── Error handler (must be last) ─────────────────────────────
app.use(errorHandler);

module.exports = app;
