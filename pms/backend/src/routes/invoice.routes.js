const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Invoice = require('../models').Invoice;

router.get('/', protect, asyncHandler(async (req, res) => {
  const invoices = await Invoice.findAll({
    include: [
      { association: 'guest' },
      { association: 'reservation' },
      { association: 'payments' }
    ]
  });
  res.json({ success: true, data: invoices });
}));

module.exports = router;
