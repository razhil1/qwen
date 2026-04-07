'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    static associate(models) {
      // A guest can have many reservations
      this.hasMany(models.Reservation, { 
        foreignKey: 'guestId', 
        as: 'reservations',
        onDelete: 'SET NULL'
      });
      
      // A guest can be linked to a user account
      this.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'userAccount' 
      });
      
      // A guest can have many ID documents
      this.hasMany(models.GuestDocument, { 
        foreignKey: 'guestId', 
        as: 'documents',
        onDelete: 'CASCADE'
      });
      
      // A guest can have many preferences
      this.hasMany(models.GuestPreference, { 
        foreignKey: 'guestId', 
        as: 'preferences',
        onDelete: 'CASCADE'
      });
      
      // A guest can have many communications
      this.hasMany(models.GuestCommunication, { 
        foreignKey: 'guestId', 
        as: 'communications',
        onDelete: 'CASCADE'
      });
    }
    
    // Get total spend
    async getTotalSpend() {
      const { Op } = require('sequelize');
      const Payment = sequelize.models.Payment;
      
      const result = await Payment.sum('amount', {
        where: {
          guestId: this.id,
          status: CONSTANTS.PAYMENT_STATUS.COMPLETED
        }
      });
      
      return result || 0;
    }
    
    // Get stay count
    async getStayCount() {
      const Reservation = sequelize.models.Reservation;
      
      const count = await Reservation.count({
        where: {
          guestId: this.id,
          status: {
            [require('sequelize').Op.in]: [
              CONSTANTS.RESERVATION_STATUS.CHECKED_OUT,
              CONSTANTS.RESERVATION_STATUS.CHECKED_IN
            ]
          }
        }
      });
      
      return count;
    }
  }
  
  Guest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Filipino'
    },
    idType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVIP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isBlacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    blacklistReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'English'
    },
    preferredContactMethod: {
      type: DataTypes.ENUM('EMAIL', 'PHONE', 'SMS', 'WHATSAPP'),
      defaultValue: 'EMAIL'
    },
    marketingOptIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
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
    modelName: 'Guest',
    tableName: 'guests',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['idNumber'] },
      { fields: ['isVIP'] },
      { fields: ['isBlacklisted'] },
      { fields: ['lastName', 'firstName'] }
    ]
  });
  
  return Guest;
};
