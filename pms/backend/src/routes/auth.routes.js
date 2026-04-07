const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { handleValidationErrors, asyncHandler } = require('../middleware/error');
const User = require('../models').User;
const { sendTokenResponse } = require('../utils/token');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (or Super Admin only in production)
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
  body('role').optional().isIn(['SUPER_ADMIN', 'PROPERTY_MANAGER', 'FRONT_DESK', 'HOUSEKEEPING', 'MAINTENANCE', 'ACCOUNTING']).withMessage('Invalid role'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, role, propertyId } = req.body;
  
  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }
  
  // Create user
  const user = await User.create({
    email,
    firstName,
    lastName,
    phone,
    role: role || 'FRONT_DESK',
    propertyId
  });
  
  // Set password (hashes it)
  await user.setPassword(password);
  await user.save();
  
  sendTokenResponse(user, 201, res);
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user with password hash
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }
  
  // Validate password
  const isMatch = await user.validatePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
  sendTokenResponse(user, 200, res);
}));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Private
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required'
    });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['passwordHash', 'refreshToken', 'twoFactorSecret'] },
    include: [{ association: 'property', attributes: ['id', 'name', 'type'] }]
  });
  
  res.json({
    success: true,
    data: user
  });
}));

// @route   PUT /api/auth/password
// @desc    Update password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findByPk(req.user.id);
  
  // Verify current password
  const isMatch = await user.validatePassword(currentPassword);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  // Set new password
  await user.setPassword(newPassword);
  await user.save();
  
  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  await User.update({ refreshToken: null }, { where: { id: req.user.id } });
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

module.exports = router;
