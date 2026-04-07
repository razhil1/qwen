const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const MaintenanceWorkOrder = require('../models').MaintenanceWorkOrder;

router.get('/', protect, asyncHandler(async (req, res) => {
  const orders = await MaintenanceWorkOrder.findAll({
    include: [
      { association: 'room' },
      { association: 'assignee' },
      { association: 'reporter' }
    ],
    order: [['priority', 'DESC'], ['createdAt', 'DESC']]
  });
  res.json({ success: true, data: orders });
}));

module.exports = router;
