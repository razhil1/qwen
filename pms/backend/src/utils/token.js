const jwt = require('jsonwebtoken');
const User = require('../models').User;

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  // Clear any existing refresh token
  user.refreshToken = null;
  
  res.status(statusCode).json({
    success: true,
    data: {
      token,
      refreshToken,
      expires: process.env.JWT_EXPIRE || '7d',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photo: user.photo,
        propertyId: user.propertyId,
        preferences: user.preferences
      }
    }
  });
};

module.exports = { generateToken, generateRefreshToken, sendTokenResponse };
