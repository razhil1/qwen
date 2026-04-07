'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class HousekeepingTask extends Model {
    static associate(models) {
      // A task belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A task is for a room
      this.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'room' 
      });
      
      // A task is assigned to a user
      this.belongsTo(models.User, { 
        foreignKey: 'assignedTo', 
        as: 'assignee' 
      });
      
      // A task is created by a user
      this.belongsTo(models.User, { 
        foreignKey: 'createdBy', 
        as: 'creator',
        key: 'createdBy'
      });
      
      // A task can have checklist items
      this.hasMany(models.HousekeepingChecklist, { 
        foreignKey: 'taskId', 
        as: 'checklist',
        onDelete: 'CASCADE'
      });
      
      // A task can have photos
      this.hasMany(models.HousekeepingPhoto, { 
        foreignKey: 'taskId', 
        as: 'photos',
        onDelete: 'CASCADE'
      });
    }
    
    // Update room status based on task completion
    async updateRoomStatus() {
      const Room = sequelize.models.Room;
      
      if (this.status === CONSTANTS.HOUSEKEEPING_STATUS.COMPLETED) {
        await Room.update(
          { status: CONSTANTS.ROOM_STATUS.INSPECTED },
          { where: { id: this.roomId } }
        );
      } else if (this.status === CONSTANTS.HOUSEKEEPING_STATUS.IN_PROGRESS) {
        await Room.update(
          { status: CONSTANTS.ROOM_STATUS.CLEANING },
          { where: { id: this.roomId } }
        );
      }
    }
  }
  
  HousekeepingTask.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    taskNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('DAILY_CLEAN', 'CHECKOUT_CLEAN', 'DEEP_CLEAN', 'TURNDOWN', 'ON_DEMAND'),
      allowNull: false,
      defaultValue: 'DAILY_CLEAN'
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.HOUSEKEEPING_STATUS)),
      defaultValue: CONSTANTS.HOUSEKEEPING_STATUS.PENDING
    },
    priority: {
      type: DataTypes.ENUM('URGENT', 'HIGH', 'NORMAL', 'LOW'),
      defaultValue: 'NORMAL'
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    inspectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    inspectorNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    },
    actualDuration: {
      type: DataTypes.INTEGER,
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
      allowNull: false,
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
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'HousekeepingTask',
    tableName: 'housekeeping_tasks',
    timestamps: true,
    indexes: [
      { fields: ['taskNumber'] },
      { fields: ['status'] },
      { fields: ['propertyId'] },
      { fields: ['roomId'] },
      { fields: ['assignedTo'] },
      { fields: ['scheduledDate'] }
    ]
  });
  
  return HousekeepingTask;
};
