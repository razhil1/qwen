'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    static associate(models) {
      // A room type belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A room type has many rooms
      this.hasMany(models.Room, { 
        foreignKey: 'roomTypeId', 
        as: 'rooms',
        onDelete: 'SET NULL'
      });
      
      // A room type has many rate plans
      this.hasMany(models.RatePlan, { 
        foreignKey: 'roomTypeId', 
        as: 'ratePlans',
        onDelete: 'CASCADE'
      });
    }
  }
  
  RoomType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.ROOM_TYPE)),
      allowNull: false,
      defaultValue: CONSTANTS.ROOM_TYPE.SINGLE
    },
    description: {
      type: DataTypes.TEXT,
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
      defaultValue: [
        { type: 'Queen', count: 1 }
      ]
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
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    smokingAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    petsAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
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
    modelName: 'RoomType',
    tableName: 'room_types',
    timestamps: true,
    indexes: [
      { fields: ['propertyId'] },
      { fields: ['type'] },
      { fields: ['isActive'] }
    ]
  });
  
  return RoomType;
};
