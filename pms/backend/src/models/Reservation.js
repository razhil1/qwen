'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // A reservation belongs to a guest
      this.belongsTo(models.Guest, { 
        foreignKey: 'guestId', 
        as: 'guest' 
      });
      
      // A reservation belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A reservation can be for a room
      this.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'room' 
      });
      
      // A reservation can be for a room type
      this.belongsTo(models.RoomType, { 
        foreignKey: 'roomTypeId', 
        as: 'roomType' 
      });
      
      // A reservation is created by a user (staff)
      this.belongsTo(models.User, { 
        foreignKey: 'createdBy', 
        as: 'creator' 
      });
      
      // A reservation can have many payments
      this.hasMany(models.Payment, { 
        foreignKey: 'reservationId', 
        as: 'payments',
        onDelete: 'CASCADE'
      });
      
      // A reservation has one invoice
      this.hasOne(models.Invoice, { 
        foreignKey: 'reservationId', 
        as: 'invoice',
        onDelete: 'SET NULL'
      });
      
      // A reservation can have additional guests
      this.hasMany(models.ReservationGuest, { 
        foreignKey: 'reservationId', 
        as: 'additionalGuests',
        onDelete: 'CASCADE'
      });
      
      // A reservation can have rate plans applied
      this.belongsTo(models.RatePlan, { 
        foreignKey: 'ratePlanId', 
        as: 'ratePlan' 
      });
      
      // Group booking support - parent reservation
      this.belongsTo(models.Reservation, { 
        foreignKey: 'parentReservationId', 
        as: 'parentReservation' 
      });
      this.hasMany(models.Reservation, { 
        foreignKey: 'parentReservationId', 
        as: 'childReservations' 
      });
    }
    
    // Calculate total nights
    getNights() {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Calculate total amount
    async calculateTotal() {
      const nights = this.getNights();
      let total = parseFloat(this.roomRate) * nights * (this.numberOfRooms || 1);
      
      // Add extra person fees
      if (this.extraPersons > 0 && this.extraPersonFee) {
        total += parseFloat(this.extraPersonFee) * this.extraPersons * nights;
      }
      
      // Add cleaning fee
      if (this.cleaningFee) {
        total += parseFloat(this.cleaningFee);
      }
      
      // Apply discounts
      if (this.discountAmount) {
        total -= parseFloat(this.discountAmount);
      }
      
      if (this.discountPercent) {
        total = total * (1 - parseFloat(this.discountPercent) / 100);
      }
      
      // Add taxes
      if (this.taxRate) {
        total = total * (1 + parseFloat(this.taxRate) / 100);
      }
      
      return total;
    }
    
    // Check for conflicts
    async hasConflict() {
      const { Op } = require('sequelize');
      
      const whereClause = {
        roomId: this.roomId,
        status: {
          [Op.in]: [CONSTANTS.RESERVATION_STATUS.CONFIRMED, CONSTANTS.RESERVATION_STATUS.CHECKED_IN]
        },
        [Op.or]: [
          {
            checkInDate: { [Op.lt]: this.checkOutDate },
            checkOutDate: { [Op.gt]: this.checkInDate }
          }
        ]
      };
      
      if (this.id) {
        whereClause.id = { [Op.ne]: this.id };
      }
      
      const conflicts = await sequelize.models.Reservation.count({ where: whereClause });
      return conflicts > 0;
    }
  }
  
  Reservation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    reservationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.RESERVATION_STATUS)),
      defaultValue: CONSTANTS.RESERVATION_STATUS.PENDING
    },
    source: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.BOOKING_SOURCE)),
      defaultValue: CONSTANTS.BOOKING_SOURCE.DIRECT
    },
    channelName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    channelReservationId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualCheckIn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualCheckOut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    numberOfRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    numberOfAdults: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    numberOfChildren: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    extraPersons: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    roomRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
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
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    discountCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 12.00
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    paidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    securityDeposit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    depositPaid: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    depositRefunded: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purpose: {
      type: DataTypes.ENUM('LEISURE', 'BUSINESS', 'GROUP', 'EVENT', 'OTHER'),
      defaultValue: 'LEISURE'
    },
    earlyCheckIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lateCheckOut: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    earlyCheckInFee: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    lateCheckOutFee: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    cancellationPolicy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellationReason: {
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
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'RoomTypes',
        key: 'id'
      }
    },
    guestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Guests',
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
    ratePlanId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'RatePlans',
        key: 'id'
      }
    },
    parentReservationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Reservations',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
    indexes: [
      { fields: ['reservationNumber'] },
      { fields: ['status'] },
      { fields: ['propertyId'] },
      { fields: ['roomId'] },
      { fields: ['guestId'] },
      { fields: ['checkInDate'] },
      { fields: ['checkOutDate'] },
      { fields: ['source'] },
      { fields: ['createdBy'] }
    ]
  });
  
  return Reservation;
};
