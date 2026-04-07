'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    static associate(models) {
      // A floor belongs to a building
      this.belongsTo(models.Building, { 
        foreignKey: 'buildingId', 
        as: 'building' 
      });
      
      // A floor can also belong directly to a property (for properties without buildings)
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A floor has many rooms
      this.hasMany(models.Room, { 
        foreignKey: 'floorId', 
        as: 'rooms',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Floor.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    floorNumber: {
      type: DataTypes.INTEGER,
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
    totalRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    buildingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Buildings',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Properties',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Floor',
    tableName: 'floors',
    timestamps: true,
    indexes: [
      { fields: ['buildingId'] },
      { fields: ['propertyId'] },
      { fields: ['floorNumber'] }
    ]
  });
  
  return Floor;
};
