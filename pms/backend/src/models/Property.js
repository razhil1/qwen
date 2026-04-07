'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // A property has many buildings
      this.hasMany(models.Building, { 
        foreignKey: 'propertyId', 
        as: 'buildings',
        onDelete: 'CASCADE'
      });
      
      // A property has many rooms (directly or through buildings)
      this.hasMany(models.Room, { 
        foreignKey: 'propertyId', 
        as: 'rooms',
        onDelete: 'CASCADE'
      });
      
      // A property has many room types
      this.hasMany(models.RoomType, { 
        foreignKey: 'propertyId', 
        as: 'roomTypes',
        onDelete: 'CASCADE'
      });
      
      // A property has many users (staff)
      this.hasMany(models.User, { 
        foreignKey: 'propertyId', 
        as: 'staff',
        onDelete: 'SET NULL'
      });
      
      // A property has many reservations
      this.hasMany(models.Reservation, { 
        foreignKey: 'propertyId', 
        as: 'reservations',
        onDelete: 'SET NULL'
      });
      
      // A property has many rate plans
      this.hasMany(models.RatePlan, { 
        foreignKey: 'propertyId', 
        as: 'ratePlans',
        onDelete: 'CASCADE'
      });
      
      // A property has many invoices
      this.hasMany(models.Invoice, { 
        foreignKey: 'propertyId', 
        as: 'invoices',
        onDelete: 'SET NULL'
      });
      
      // A property has many housekeeping tasks
      this.hasMany(models.HousekeepingTask, { 
        foreignKey: 'propertyId', 
        as: 'housekeepingTasks',
        onDelete: 'SET NULL'
      });
      
      // A property has many maintenance work orders
      this.hasMany(models.MaintenanceWorkOrder, { 
        foreignKey: 'propertyId', 
        as: 'maintenanceWorkOrders',
        onDelete: 'SET NULL'
      });
      
      // A property has many announcements
      this.hasMany(models.Announcement, { 
        foreignKey: 'propertyId', 
        as: 'announcements',
        onDelete: 'CASCADE'
      });
      
      // Self-reference for property groups/chains
      this.belongsTo(models.Property, { 
        foreignKey: 'parentPropertyId', 
        as: 'parentProperty' 
      });
      this.hasMany(models.Property, { 
        foreignKey: 'parentPropertyId', 
        as: 'childProperties' 
      });
    }
    
    // Calculate occupancy rate
    async getOccupancyRate(startDate, endDate) {
      const { Op } = require('sequelize');
      const Reservation = sequelize.models.Reservation;
      
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalRoomDays = this.totalRooms * totalDays;
      
      const occupiedRoomDays = await Reservation.sum('numberOfRooms', {
        where: {
          propertyId: this.id,
          status: {
            [Op.in]: [CONSTANTS.RESERVATION_STATUS.CHECKED_IN, CONSTANTS.RESERVATION_STATUS.CONFIRMED]
          },
          checkInDate: { [Op.lt]: endDate },
          checkOutDate: { [Op.gt]: startDate }
        }
      });
      
      return totalRoomDays > 0 ? (occupiedRoomDays / totalRoomDays) * 100 : 0;
    }
  }
  
  Property.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.PROPERTY_TYPE)),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Philippines'
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    totalRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalBuildings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    checkInTime: {
      type: DataTypes.TIME,
      defaultValue: '14:00:00'
    },
    checkOutTime: {
      type: DataTypes.TIME,
      defaultValue: '12:00:00'
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'Asia/Manila'
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'PHP'
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 12.00
    },
    serviceFeeRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    policies: {
      type: DataTypes.JSONB,
      defaultValue: {
        cancellation: '',
        petPolicy: '',
        smokingPolicy: '',
        childrenPolicy: '',
        extraBedPolicy: ''
      }
    },
    branding: {
      type: DataTypes.JSONB,
      defaultValue: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    parentPropertyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        allowOnlineBooking: true,
        requireApproval: false,
        enableWaitlist: true,
        autoConfirmMinutes: 30,
        enableOverbooking: false,
        overbookingLimit: 0
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['city'] },
      { fields: ['country'] },
      { fields: ['isActive'] },
      { fields: ['parentPropertyId'] }
    ]
  });
  
  return Property;
};
