'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const ROLES = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // A user can be assigned to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A user can have many reservations (as guest)
      this.hasMany(models.Reservation, { 
        foreignKey: 'guestId', 
        as: 'reservations' 
      });
      
      // A user can create many reservations (as staff)
      this.hasMany(models.Reservation, { 
        foreignKey: 'createdBy', 
        as: 'createdReservations' 
      });
      
      // A user can have many audit logs
      this.hasMany(models.AuditLog, { 
        foreignKey: 'userId', 
        as: 'auditLogs' 
      });
      
      // A user can have many notifications
      this.hasMany(models.Notification, { 
        foreignKey: 'userId', 
        as: 'notifications' 
      });
      
      // A user can be assigned housekeeping tasks
      this.hasMany(models.HousekeepingTask, { 
        foreignKey: 'assignedTo', 
        as: 'housekeepingTasks' 
      });
      
      // A user can be assigned maintenance work orders
      this.hasMany(models.MaintenanceWorkOrder, { 
        foreignKey: 'assignedTo', 
        as: 'maintenanceWorkOrders' 
      });
      
      // Staff scheduling
      this.hasMany(models.StaffShift, { 
        foreignKey: 'userId', 
        as: 'shifts' 
      });
    }
    
    // Hash password before saving
    async setPassword(password) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(password, salt);
    }
    
    // Validate password
    async validatePassword(password) {
      return await bcrypt.compare(password, this.passwordHash);
    }
    
    // Check if user has permission
    hasPermission(permission) {
      const rolePermissions = ROLES.PERMISSIONS[this.role];
      if (!rolePermissions) return false;
      if (rolePermissions.includes('*')) return true;
      return rolePermissions.includes(permission);
    }
  }
  
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM(Object.values(ROLES)),
      allowNull: false,
      defaultValue: ROLES.FRONT_DESK
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
      { fields: ['propertyId'] },
      { fields: ['isActive'] }
    ]
  });
  
  return User;
};
