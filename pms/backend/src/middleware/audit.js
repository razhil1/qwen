const AuditLog = require('../models').AuditLog;

// Create audit log middleware
const createAuditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to capture response
    res.json = function(data) {
      // Create audit log after successful operation
      if (res.statusCode < 400 && req.user) {
        try {
          AuditLog.create({
            action,
            entityType,
            entityId: req.params.id || data?.id || null,
            entityData: req.body,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user.id,
            propertyId: req.user.propertyId || req.body.propertyId || req.params.propertyId
          }).catch(err => console.error('Audit log creation failed:', err));
        } catch (error) {
          console.error('Audit log error:', error);
        }
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

// Log specific field changes
const logChanges = async (model, instance, userId, propertyId) => {
  try {
    const previousData = instance._previousDataValues || {};
    const currentData = instance.dataValues;
    
    const changes = {};
    for (const key in currentData) {
      if (previousData[key] !== undefined && previousData[key] !== currentData[key]) {
        changes[key] = {
          old: previousData[key],
          new: currentData[key]
        };
      }
    }
    
    if (Object.keys(changes).length > 0) {
      await AuditLog.create({
        action: 'UPDATE',
        entityType: model.name,
        entityId: instance.id,
        previousData,
        entityData: currentData,
        changes,
        userId,
        propertyId
      });
    }
  } catch (error) {
    console.error('Change logging error:', error);
  }
};

module.exports = { createAuditLog, logChanges };
