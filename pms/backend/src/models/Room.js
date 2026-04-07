'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // A room belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A room can belong to a building
      this.belongsTo(models.Building, { 
        foreignKey: 'buildingId', 
        as: 'building' 
      });
      
      // A room can belong to a floor
      this.belongsTo(models.Floor, { 
        foreignKey: 'floorId', 
        as: 'floor' 
      });
      
      // A room has a room type
      this.belongsTo(models.RoomType, { 
        foreignKey: 'roomTypeId', 
        as: 'roomType' 
      });
      
      // A room can have many reservations
      this.hasMany(models.Reservation, { 
        foreignKey: 'roomId', 
        as: 'reservations',
        onDelete: 'SET NULL'
      });
      
      // A room can have many housekeeping tasks
      this.hasMany(models.HousekeepingTask, { 
        foreignKey: 'roomId', 
        as: 'housekeepingTasks',
        onDelete: 'CASCADE'
      });
      
      // A room can have many maintenance work orders
      this.hasMany(models.MaintenanceWorkOrder, { 
        foreignKey: 'roomId', 
        as: 'maintenanceWorkOrders',
        onDelete: 'SET NULL'
      });
      
      // A room can have many inventory items
      this.hasMany(models.RoomInventory, { 
        foreignKey: 'roomId', 
        as: 'inventory',
        onDelete: 'CASCADE'
      });
    }
    
    // Check if room is available for given dates
    async isAvailable(startDate, endDate, excludeReservationId = null) {
      const { Op } = require('sequelize');
      const Reservation = sequelize.models.Reservation;
      
      const whereClause = {
        roomId: this.id,
        status: {
          [Op.in]: [CONSTANTS.RESERVATION_STATUS.CONFIRMED, CONSTANTS.RESERVATION_STATUS.CHECKED_IN]
        },
        [Op.or]: [
          {
            checkInDate: { [Op.lt]: endDate },
            checkOutDate: { [Op.gt]: startDate }
          }
        ]
      };
      
      if (excludeReservationId) {
        whereClause.id = { [Op.ne]: excludeReservationId };
      }
      
      const conflictingReservations = await Reservation.count({ where: whereClause });
      return conflictingReservations === 0;
    }
    
    // Get current status based on reservations and housekeeping
    async getCurrentStatus() {
      const { Op } = require('sequelize');
      const Reservation = sequelize.models.Reservation;
      const HousekeepingTask = sequelize.models.HousekeepingTask;
      
      // Check for active reservation
      const now = new Date();
      const activeReservation = await Reservation.findOne({
        where: {
          roomId: this.id,
          status: {
            [Op.in]: [CONSTANTS.RESERVATION_STATUS.CHECKED_IN, CONSTANTS.RESERVATION_STATUS.CONFIRMED]
          },
          checkInDate: { [Op.lte]: now },
          checkOutDate: { [Op.gte]: now }
        }
      });
      
      if (activeReservation && activeReservation.status === CONSTANTS.RESERVATION_STATUS.CHECKED_IN) {
        return CONSTANTS.ROOM_STATUS.OCCUPIED;
      }
      
      if (activeReservation) {
        return CONSTANTS.ROOM_STATUS.RESERVED;
      }
      
      // Check housekeeping status
      const latestTask = await HousekeepingTask.findOne({
        where: { roomId: this.id },
        order: [['createdAt', 'DESC']]
      });
      
      if (latestTask && latestTask.status === CONSTANTS.HOUSEKEEPING_STATUS.COMPLETED) {
        return CONSTANTS.ROOM_STATUS.INSPECTED;
      }
      
      if (latestTask && latestTask.status === CONSTANTS.HOUSEKEEPING_STATUS.IN_PROGRESS) {
        return CONSTANTS.ROOM_STATUS.CLEANING;
      }
      
      if (this.status === CONSTANTS.ROOM_STATUS.MAINTENANCE || 
          this.status === CONSTANTS.ROOM_STATUS.OUT_OF_ORDER) {
        return this.status;
      }
      
      return CONSTANTS.ROOM_STATUS.AVAILABLE;
    }
  }
  
  Room.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.ROOM_STATUS)),
      defaultValue: CONSTANTS.ROOM_STATUS.AVAILABLE
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    maxOccupancy: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    adultCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    childCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    bedConfiguration: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    photos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    floorPlan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    weekendPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    weeklyDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    monthlyDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    extraPersonFee: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    cleaningFee: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    securityDeposit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    smokingAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    petsAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    buildingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Buildings',
        key: 'id'
      }
    },
    floorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Floors',
        key: 'id'
      }
    },
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'RoomTypes',
        key: 'id'
      }
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
    indexes: [
      { fields: ['propertyId'] },
      { fields: ['buildingId'] },
      { fields: ['floorId'] },
      { fields: ['roomTypeId'] },
      { fields: ['status'] },
      { fields: ['roomNumber'] },
      { fields: ['propertyId', 'status'] }
    ]
  });
  
  return Room;
};
