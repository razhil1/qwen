const { v4: uuidv4 } = require('uuid');

// Generate unique reservation number
const generateReservationNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-${year}${month}-${random}`;
};

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

// Generate unique work order number
const generateWorkOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WO-${year}${month}-${random}`;
};

// Generate unique housekeeping task number
const generateTaskNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TSK-${year}${month}-${random}`;
};

// Generate UUID
const generateUUID = () => {
  return uuidv4();
};

// Format currency
const formatCurrency = (amount, currency = 'PHP') => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency
  }).format(amount);
};

// Calculate nights between dates
const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if date is weekend
const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};

// Add days to date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Get date range array
const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Sanitize object for JSON response
const sanitizeObject = (obj, excludeFields = []) => {
  const sanitized = { ...obj };
  excludeFields.forEach(field => {
    delete sanitized[field];
  });
  return sanitized;
};

module.exports = {
  generateReservationNumber,
  generateInvoiceNumber,
  generateWorkOrderNumber,
  generateTaskNumber,
  generateUUID,
  formatCurrency,
  calculateNights,
  isWeekend,
  addDays,
  getDateRange,
  sanitizeObject
};
