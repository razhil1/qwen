'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Building extends Model {
    static associate(models) {
      // A building belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A building has many floors
      this.hasMany(models.Floor, { 
        foreignKey: 'buildingId', 
        as: 'floors',
        onDelete: 'CASCADE'
      });
      
      // A building has many rooms
      this.hasMany(models.Room, { 
        foreignKey: 'buildingId', 
        as: 'rooms',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Building.init({
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    photos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Building',
    tableName: 'buildings',
    timestamps: true,
    indexes: [
      { fields: ['propertyId'] },
      { fields: ['code'] }
    ]
  });
  
  return Building;
};
