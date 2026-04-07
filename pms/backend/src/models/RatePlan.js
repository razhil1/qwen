'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RatePlan extends Model {
    static associate(models) {
      // A rate plan belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // A rate plan can be for a specific room type
      this.belongsTo(models.RoomType, { 
        foreignKey: 'roomTypeId', 
        as: 'roomType' 
      });
      
      // A rate plan has many seasonal rates
      this.hasMany(models.SeasonalRate, { 
        foreignKey: 'ratePlanId', 
        as: 'seasonalRates',
        onDelete: 'CASCADE'
      });
      
      // A rate plan can be applied to many reservations
      this.hasMany(models.Reservation, { 
        foreignKey: 'ratePlanId', 
        as: 'reservations',
        onDelete: 'SET NULL'
      });
    }
    
    // Get rate for a specific date
    async getRateForDate(date) {
      const SeasonalRate = sequelize.models.SeasonalRate;
      const targetDate = new Date(date);
      
      // Check for seasonal rates first
      const seasonalRate = await SeasonalRate.findOne({
        where: {
          ratePlanId: this.id,
          startDate: { [require('sequelize').Op.lte]: targetDate },
          endDate: { [require('sequelize').Op.gte]: targetDate }
        }
      });
      
      if (seasonalRate) {
        return seasonalRate.rate;
      }
      
      // Check for day-of-week pricing
      const dayOfWeek = targetDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        return this.weekendRate || this.baseRate;
      }
      
      return this.baseRate;
    }
  }
  
  RatePlan.init({
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
      allowNull: true,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    baseRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    weekendRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    weeklyRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    monthlyRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    minStay: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    maxStay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    advanceBookingMin: {
      type: DataTypes.INTEGER, // days
      defaultValue: 0
    },
    advanceBookingMax: {
      type: DataTypes.INTEGER, // days
      allowNull: true
    },
    cancellationPolicy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isRefundable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    includesBreakfast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    includesWifi: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    includesParking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    adultCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    childCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    extraPersonRate: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'RoomTypes',
        key: 'id'
      }
    },
    restrictions: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'RatePlan',
    tableName: 'rate_plans',
    timestamps: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['propertyId'] },
      { fields: ['roomTypeId'] },
      { fields: ['isActive'] },
      { fields: ['isDefault'] }
    ]
  });
  
  return RatePlan;
};
