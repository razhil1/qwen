'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class MaintenanceWorkOrder extends Model {
    static associate(models) {
      // A work order belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A work order can be for a room
      this.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'room' 
      });
      
      // A work order is assigned to a user
      this.belongsTo(models.User, { 
        foreignKey: 'assignedTo', 
        as: 'assignee' 
      });
      
      // A work order is created by a user or guest
      this.belongsTo(models.User, { 
        foreignKey: 'createdBy', 
        as: 'creator' 
      });
      
      // A work order can be reported by a guest
      this.belongsTo(models.Guest, { 
        foreignKey: 'reportedBy', 
        as: 'reporter' 
      });
      
      // A work order can have photos
      this.hasMany(models.MaintenancePhoto, { 
        foreignKey: 'workOrderId', 
        as: 'photos',
        onDelete: 'CASCADE'
      });
      
      // A work order can have comments
      this.hasMany(models.MaintenanceComment, { 
        foreignKey: 'workOrderId', 
        as: 'comments',
        onDelete: 'CASCADE'
      });
      
      // A work order can have parts used
      this.hasMany(models.MaintenancePart, { 
        foreignKey: 'workOrderId', 
        as: 'parts',
        onDelete: 'CASCADE'
      });
    }
    
    // Calculate time to resolve
    getTimeToResolve() {
      if (!this.resolvedAt || !this.createdAt) return null;
      return new Date(this.resolvedAt) - new Date(this.createdAt);
    }
  }
  
  MaintenanceWorkOrder.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    workOrderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.MAINTENANCE_STATUS)),
      defaultValue: CONSTANTS.MAINTENANCE_STATUS.OPEN
    },
    priority: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.MAINTENANCE_PRIORITY)),
      defaultValue: CONSTANTS.MAINTENANCE_PRIORITY.NORMAL
    },
    category: {
      type: DataTypes.ENUM('ELECTRICAL', 'PLUMBING', 'HVAC', 'APPLIANCE', 'FURNITURE', 'STRUCTURAL', 'IT', 'OTHER'),
      allowNull: true
    },
    requestedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    actualCost: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isPreventive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurrencePattern: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nextDueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vendorName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorContact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    warrantyInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Rooms',
        key: 'id'
      }
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Guests',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'MaintenanceWorkOrder',
    tableName: 'maintenance_work_orders',
    timestamps: true,
    indexes: [
      { fields: ['workOrderNumber'] },
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['propertyId'] },
      { fields: ['roomId'] },
      { fields: ['assignedTo'] },
      { fields: ['category'] }
    ]
  });
  
  return MaintenanceWorkOrder;
};
