const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const User = require('../models').User;
const ROLES = require('../config/constants');

router.get('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.PROPERTY_MANAGER), asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'refreshToken', 'twoFactorSecret'] },
    include: [{ association: 'property', attributes: ['id', 'name'] }]
  });
  res.json({ success: true, data: users });
}));

module.exports = router;
