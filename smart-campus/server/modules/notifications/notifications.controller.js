const notificationsService = require('./notifications.service');

async function getAll(req, res, next) {
  try {
    const { unreadOnly, page, limit } = req.query;
    const notifications = await notificationsService.getUserNotifications(req.user.id, {
      unreadOnly: unreadOnly === 'true',
      page,
      limit,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationsService.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await notificationsService.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationsService.markAllAsRead(req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getUnreadCount, markAsRead, markAllAsRead };
