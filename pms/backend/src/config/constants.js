module.exports = {
  // User roles with permissions hierarchy
  SUPER_ADMIN: 'SUPER_ADMIN',      // Full access, multi-property
  PROPERTY_MANAGER: 'PROPERTY_MANAGER', // Manage 1 property
  FRONT_DESK: 'FRONT_DESK',        // Reservations, check-in/out, payments
  HOUSEKEEPING: 'HOUSEKEEPING',    // Room status and tasks only
  MAINTENANCE: 'MAINTENANCE',      // Work orders only
  ACCOUNTING: 'ACCOUNTING',        // Billing and reports only
  TENANT: 'TENANT',                // Self-service portal
  GUEST: 'GUEST'                   // Limited guest access
};

// Permission matrix for each role
const PERMISSIONS = {
  SUPER_ADMIN: ['*'], // All permissions
  
  PROPERTY_MANAGER: [
    'property:read', 'property:write', 'property:delete',
    'room:read', 'room:write', 'room:delete',
    'reservation:read', 'reservation:write', 'reservation:cancel',
    'guest:read', 'guest:write',
    'billing:read', 'billing:write',
    'staff:read', 'staff:write',
    'report:read', 'report:export',
    'housekeeping:read', 'housekeeping:write',
    'maintenance:read', 'maintenance:write',
    'settings:read', 'settings:write'
  ],
  
  FRONT_DESK: [
    'property:read',
    'room:read', 'room:update_status',
    'reservation:read', 'reservation:write', 'reservation:cancel',
    'guest:read', 'guest:write',
    'billing:read', 'billing:write', 'billing:payment',
    'checkin:execute', 'checkout:execute',
    'report:read'
  ],
  
  HOUSEKEEPING: [
    'room:read', 'room:update_status',
    'housekeeping:read', 'housekeeping:write',
    'housekeeping:task:update'
  ],
  
  MAINTENANCE: [
    'maintenance:read', 'maintenance:write',
    'maintenance:work_order:update',
    'room:read'
  ],
  
  ACCOUNTING: [
    'billing:read', 'billing:write', 'billing:delete',
    'payment:read', 'payment:write',
    'report:read', 'report:export',
    'guest:read', 'reservation:read'
  ],
  
  TENANT: [
    'tenant:profile:read', 'tenant:profile:write',
    'tenant:contract:read',
    'tenant:payment:read', 'tenant:payment:write',
    'maintenance:request:write',
    'message:read', 'message:write'
  ],
  
  GUEST: [
    'guest:profile:read',
    'reservation:read:own'
  ]
};

// Room statuses
const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
  MAINTENANCE: 'MAINTENANCE',
  DIRTY: 'DIRTY',
  CLEANING: 'CLEANING',
  INSPECTED: 'INSPECTED',
  BLOCKED: 'BLOCKED',
  OUT_OF_ORDER: 'OUT_OF_ORDER'
};

// Reservation statuses
const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
  EXTENDED: 'EXTENDED'
};

// Property types
const PROPERTY_TYPE = {
  HOTEL: 'HOTEL',
  HOSTEL: 'HOSTEL',
  APARTMENT: 'APARTMENT',
  BOARDING_HOUSE: 'BOARDING_HOUSE',
  CONDOMINIUM: 'CONDOMINIUM',
  VACATION_RENTAL: 'VACATION_RENTAL',
  RESORT: 'RESORT'
};

// Room types
const ROOM_TYPE = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TWIN: 'TWIN',
  SUITE: 'SUITE',
  DELUXE: 'DELUXE',
  STUDIO: 'STUDIO',
  ONE_BEDROOM: 'ONE_BEDROOM',
  TWO_BEDROOM: 'TWO_BEDROOM',
  DORMITORY: 'DORMITORY',
  PENTHOUSE: 'PENTHOUSE'
};

// Booking sources
const BOOKING_SOURCE = {
  WALK_IN: 'WALK_IN',
  ONLINE: 'ONLINE',
  OTA: 'OTA',           // Online Travel Agency (Booking.com, Airbnb, etc.)
  AGENT: 'AGENT',
  DIRECT: 'DIRECT',
  CORPORATE: 'CORPORATE',
  REFERRAL: 'REFERRAL'
};

// Payment methods
const PAYMENT_METHOD = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  GCASH: 'GCASH',
  PAYMAYA: 'PAYMAYA',
  PAYPAL: 'PAYPAL',
  STRIPE: 'STRIPE',
  OTA: 'OTA'  // Paid through OTA
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIAL: 'PARTIAL',
  CANCELLED: 'CANCELLED'
};

// Invoice statuses
const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

// Maintenance priority levels
const MAINTENANCE_PRIORITY = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  NORMAL: 'NORMAL',
  LOW: 'LOW'
};

// Maintenance statuses
const MAINTENANCE_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

// Housekeeping task statuses
const HOUSEKEEPING_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  INSPECTED: 'INSPECTED'
};

// Notification types
const NOTIFICATION_TYPE = {
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  PAYMENT_REMINDER: 'PAYMENT_REMINDER',
  CHECKOUT_REMINDER: 'CHECKOUT_REMINDER',
  MAINTENANCE_UPDATE: 'MAINTENANCE_UPDATE',
  CONTRACT_EXPIRY: 'CONTRACT_EXPIRY',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  SYSTEM: 'SYSTEM'
};

// Contract types (for long-term stays)
const CONTRACT_TYPE = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMI_ANNUAL: 'SEMI_ANNUAL',
  ANNUAL: 'ANNUAL',
  CUSTOM: 'CUSTOM'
};

module.exports.PERMISSIONS = PERMISSIONS;
module.exports.ROOM_STATUS = ROOM_STATUS;
module.exports.RESERVATION_STATUS = RESERVATION_STATUS;
module.exports.PROPERTY_TYPE = PROPERTY_TYPE;
module.exports.ROOM_TYPE = ROOM_TYPE;
module.exports.BOOKING_SOURCE = BOOKING_SOURCE;
module.exports.PAYMENT_METHOD = PAYMENT_METHOD;
module.exports.PAYMENT_STATUS = PAYMENT_STATUS;
module.exports.INVOICE_STATUS = INVOICE_STATUS;
module.exports.MAINTENANCE_PRIORITY = MAINTENANCE_PRIORITY;
module.exports.MAINTENANCE_STATUS = MAINTENANCE_STATUS;
module.exports.HOUSEKEEPING_STATUS = HOUSEKEEPING_STATUS;
module.exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE;
module.exports.CONTRACT_TYPE = CONTRACT_TYPE;
