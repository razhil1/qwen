'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      // An audit log is created by a user
      this.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'user' 
      });
      
      // An audit log can be related to various entities
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
    }
  }
  
  AuditLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    entityData: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    previousData: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    changes: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
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
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: true,
    indexes: [
      { fields: ['action'] },
      { fields: ['entityType'] },
      { fields: ['entityId'] },
      { fields: ['userId'] },
      { fields: ['propertyId'] },
      { fields: ['createdAt'] }
    ]
  });
  
  return AuditLog;
};
