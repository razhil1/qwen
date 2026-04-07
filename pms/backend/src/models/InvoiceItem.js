'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    static associate(models) {
      // An invoice item belongs to an invoice
      this.belongsTo(models.Invoice, { 
        foreignKey: 'invoiceId', 
        as: 'invoice' 
      });
      
      // An invoice item can be linked to a room
      this.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'room' 
      });
    }
  }
  
  InvoiceItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('ROOM_NIGHT', 'SERVICE', 'PRODUCT', 'FEE', 'TAX', 'DISCOUNT', 'DEPOSIT'),
      allowNull: false,
      defaultValue: 'ROOM_NIGHT'
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 1
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Invoices',
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
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'InvoiceItem',
    tableName: 'invoice_items',
    timestamps: true,
    indexes: [
      { fields: ['invoiceId'] },
      { fields: ['type'] }
    ]
  });
  
  return InvoiceItem;
};
