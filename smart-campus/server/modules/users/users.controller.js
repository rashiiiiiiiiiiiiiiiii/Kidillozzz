const usersService = require('./users.service');

async function getAll(req, res, next) {
  try {
    const { role, department, page, limit } = req.query;
    const users = await usersService.getAllUsers({ role, department, page, limit });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await usersService.deleteUser(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, remove };
