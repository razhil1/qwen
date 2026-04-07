const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Payment = require('../models').Payment;
const { generateReceiptNumber } = require('../utils/helpers');

router.get('/', protect, asyncHandler(async (req, res) => {
  const payments = await Payment.findAll({
    include: [
      { association: 'invoice' },
      { association: 'reservation' },
      { association: 'guest' }
    ],
    order: [['paymentDate', 'DESC']]
  });
  res.json({ success: true, data: payments });
}));

module.exports = router;
