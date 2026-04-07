const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const HousekeepingTask = require('../models').HousekeepingTask;

router.get('/', protect, asyncHandler(async (req, res) => {
  const tasks = await HousekeepingTask.findAll({
    include: [
      { association: 'room' },
      { association: 'assignee' }
    ],
    order: [['scheduledDate', 'DESC']]
  });
  res.json({ success: true, data: tasks });
}));

module.exports = router;
