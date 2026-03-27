const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    payment_method: { type: DataTypes.ENUM('card','paypal','cash'), allowNull: false },
    status: { type: DataTypes.ENUM('pending','completed','failed'), defaultValue: 'pending' }
}, { timestamps: true });

Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Payment;
