const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Guest = require('../models').Guest;

router.get('/', protect, asyncHandler(async (req, res) => {
  const guests = await Guest.findAll({
    include: [{ association: 'reservations', limit: 5 }]
  });
  res.json({ success: true, data: guests });
}));

module.exports = router;
