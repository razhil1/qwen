'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SeasonalRate extends Model {
    static associate(models) {
      // A seasonal rate belongs to a rate plan
      this.belongsTo(models.RatePlan, { 
        foreignKey: 'ratePlanId', 
        as: 'ratePlan' 
      });
      
      // A seasonal rate belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
    }
  }
  
  SeasonalRate.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    minStay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ratePlanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'RatePlans',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'SeasonalRate',
    tableName: 'seasonal_rates',
    timestamps: true,
    indexes: [
      { fields: ['ratePlanId'] },
      { fields: ['propertyId'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] }
    ]
  });
  
  return SeasonalRate;
};
