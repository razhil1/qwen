const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Room = require('../models').Room;

router.get('/', protect, asyncHandler(async (req, res) => {
  const { propertyId, status, floor } = req.query;
  const where = {};
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;
  if (floor) where.floor = floor;
  
  const rooms = await Room.findAll({
    where,
    include: [
      { association: 'property', attributes: ['id', 'name'] },
      { association: 'roomType', attributes: ['id', 'name', 'type'] }
    ]
  });
  res.json({ success: true, data: rooms });
}));

module.exports = router;
