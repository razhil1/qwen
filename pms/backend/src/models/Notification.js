'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // A notification belongs to a user
      this.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'user' 
      });
      
      // A notification can be related to a reservation
      this.belongsTo(models.Reservation, { 
        foreignKey: 'reservationId', 
        as: 'reservation' 
      });
    }
  }
  
  Notification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
      defaultValue: 'NORMAL'
    },
    channel: {
      type: DataTypes.JSONB,
      defaultValue: {
        email: false,
        sms: false,
        push: true,
        inApp: true
      }
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reservationId: {
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
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['isRead'] },
      { fields: ['type'] },
      { fields: ['priority'] }
    ]
  });
  
  return Notification;
};
