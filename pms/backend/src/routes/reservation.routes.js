const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Reservation = require('../models').Reservation;
const { generateReservationNumber } = require('../utils/helpers');

router.get('/', protect, asyncHandler(async (req, res) => {
  const { propertyId, status, checkInDate, checkOutDate } = req.query;
  const where = {};
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;
  
  const reservations = await Reservation.findAll({
    where,
    include: [
      { association: 'guest', attributes: ['id', 'firstName', 'lastName', 'phone', 'email'] },
      { association: 'room', attributes: ['id', 'roomNumber', 'name'] },
      { association: 'creator', attributes: ['id', 'firstName', 'lastName'] }
    ],
    order: [['checkInDate', 'DESC']]
  });
  res.json({ success: true, data: reservations });
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const reservation = await Reservation.create({
    ...req.body,
    reservationNumber: generateReservationNumber()
  });
  res.status(201).json({ success: true, data: reservation });
}));

module.exports = router;
