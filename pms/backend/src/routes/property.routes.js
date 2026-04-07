const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const Property = require('../models').Property;
const ROLES = require('../config/constants');

// @route   GET /api/properties
// @desc    Get all properties (filtered by user's property for non-super-admins)
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, isActive } = req.query;
  
  const where = {};
  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  
  // Non-super-admins can only see their assigned property
  if (req.user.role !== ROLES.SUPER_ADMIN && req.user.propertyId) {
    where.id = req.user.propertyId;
  }
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Property.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
    include: [
      { association: 'buildings', attributes: ['id', 'name', 'totalRooms'] },
      { association: 'roomTypes', attributes: ['id', 'name', 'type', 'basePrice'] }
    ]
  });
  
  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    }
  });
}));

// @route   GET /api/properties/:id
// @desc    Get single property
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const property = await Property.findByPk(req.params.id, {
    include: [
      { association: 'buildings' },
      { association: 'rooms' },
      { association: 'roomTypes' },
      { association: 'staff', attributes: ['id', 'firstName', 'lastName', 'role'] }
    ]
  });
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  res.json({ success: true, data: property });
}));

// @route   POST /api/properties
// @desc    Create property
// @access  Private/Super Admin
router.post('/', protect, authorize(ROLES.SUPER_ADMIN), asyncHandler(async (req, res) => {
  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
}));

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const property = await Property.findByPk(req.params.id);
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  await property.update(req.body);
  res.json({ success: true, data: property });
}));

module.exports = router;
