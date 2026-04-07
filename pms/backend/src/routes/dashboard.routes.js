const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');
const Reservation = require('../models').Reservation;
const Room = require('../models').Room;
const CONSTANTS = require('../config/constants');

router.get('/', protect, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Today's arrivals
  const arrivals = await Reservation.count({
    where: {
      checkInDate: { [Op.gte]: today, [Op.lt]: tomorrow },
      status: { [Op.in]: [CONSTANTS.RESERVATION_STATUS.CONFIRMED, CONSTANTS.RESERVATION_STATUS.CHECKED_IN] }
    }
  });
  
  // Today's departures
  const departures = await Reservation.count({
    where: {
      checkOutDate: { [Op.gte]: today, [Op.lt]: tomorrow },
      status: CONSTANTS.RESERVATION_STATUS.CHECKED_IN
    }
  });
  
  // In-house guests
  const inHouse = await Reservation.count({
    where: {
      status: CONSTANTS.RESERVATION_STATUS.CHECKED_IN
    }
  });
  
  // Room status counts
  const availableRooms = await Room.count({ where: { status: CONSTANTS.ROOM_STATUS.AVAILABLE } });
  const occupiedRooms = await Room.count({ where: { status: CONSTANTS.ROOM_STATUS.OCCUPIED } });
  const dirtyRooms = await Room.count({ where: { status: CONSTANTS.ROOM_STATUS.DIRTY } });
  
  res.json({
    success: true,
    data: {
      arrivals,
      departures,
      inHouse,
      roomStatus: {
        available: availableRooms,
        occupied: occupiedRooms,
        dirty: dirtyRooms
      }
    }
  });
}));

module.exports = router;
