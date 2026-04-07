'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // An invoice belongs to a property
      this.belongsTo(models.Property, { 
        foreignKey: 'propertyId', 
        as: 'property' 
      });
      
      // An invoice can be linked to a reservation
      this.belongsTo(models.Reservation, { 
        foreignKey: 'reservationId', 
        as: 'reservation' 
      });
      
      // An invoice belongs to a guest
      this.belongsTo(models.Guest, { 
        foreignKey: 'guestId', 
        as: 'guest' 
      });
      
      // An invoice has many payments
      this.hasMany(models.Payment, { 
        foreignKey: 'invoiceId', 
        as: 'payments',
        onDelete: 'CASCADE'
      });
      
      // An invoice has many line items
      this.hasMany(models.InvoiceItem, { 
        foreignKey: 'invoiceId', 
        as: 'items',
        onDelete: 'CASCADE'
      });
    }
    
    // Calculate totals
    async calculateTotals() {
      const items = await this.getItems();
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const taxAmount = subtotal * (parseFloat(this.taxRate) / 100);
      const total = subtotal + taxAmount;
      
      await this.update({
        subtotal,
        taxAmount,
        totalAmount: total
      });
      
      return { subtotal, taxAmount, total };
    }
    
    // Get balance due
    async getBalanceDue() {
      const Payment = sequelize.models.Payment;
      const paidAmount = await Payment.sum('amount', {
        where: {
          invoiceId: this.id,
          status: CONSTANTS.PAYMENT_STATUS.COMPLETED
        }
      });
      
      return parseFloat(this.totalAmount) - (paidAmount || 0);
    }
  }
  
  Invoice.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.INVOICE_STATUS)),
      defaultValue: CONSTANTS.INVOICE_STATUS.DRAFT
    },
    type: {
      type: DataTypes.ENUM('ROOM_CHARGE', 'SERVICE', 'PRODUCT', 'MISCELLANEOUS', 'RENT'),
      defaultValue: 'ROOM_CHARGE'
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    billingPeriodStart: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    billingPeriodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 12.00
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    serviceFeeRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    serviceFeeAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    discountDescription: {
      type: DataTypes.STRING,
      allowNull: true
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
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'PHP'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    footer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidAt: {
      type: DataTypes.DATE,
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
    reservationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Reservations',
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
    billingAddress: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    indexes: [
      { fields: ['invoiceNumber'] },
      { fields: ['status'] },
      { fields: ['propertyId'] },
      { fields: ['reservationId'] },
      { fields: ['guestId'] },
      { fields: ['issueDate'] }
    ]
  });
  
  return Invoice;
};
