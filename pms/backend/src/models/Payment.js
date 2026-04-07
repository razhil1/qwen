'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // A payment can be linked to an invoice
      this.belongsTo(models.Invoice, { 
        foreignKey: 'invoiceId', 
        as: 'invoice' 
      });
      
      // A payment can be linked to a reservation
      this.belongsTo(models.Reservation, { 
        foreignKey: 'reservationId', 
        as: 'reservation' 
      });
      
      // A payment belongs to a guest
      this.belongsTo(models.Guest, { 
        foreignKey: 'guestId', 
        as: 'guest' 
      });
      
      // A payment is processed by a user
      this.belongsTo(models.User, { 
        foreignKey: 'processedBy', 
        as: 'processor' 
      });
      
      // A payment can have a refund
      this.hasOne(models.PaymentRefund, { 
        foreignKey: 'paymentId', 
        as: 'refund',
        onDelete: 'CASCADE'
      });
    }
    
    // Generate receipt number
    static generateReceiptNumber() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `RCP-${year}${month}-${random}`;
    }
  }
  
  Payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.PAYMENT_STATUS)),
      defaultValue: CONSTANTS.PAYMENT_STATUS.PENDING
    },
    method: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.PAYMENT_METHOD)),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'PHP'
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentType: {
      type: DataTypes.ENUM('DEPOSIT', 'PARTIAL', 'FULL', 'REFUND', 'ADJUSTMENT'),
      defaultValue: 'PARTIAL'
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gatewayResponse: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isRefundable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    refundedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Invoices',
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
    processedBy: {
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
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    indexes: [
      { fields: ['receiptNumber'] },
      { fields: ['status'] },
      { fields: ['method'] },
      { fields: ['propertyId'] },
      { fields: ['invoiceId'] },
      { fields: ['reservationId'] },
      { fields: ['guestId'] },
      { fields: ['paymentDate'] }
    ]
  });
  
  return Payment;
};
