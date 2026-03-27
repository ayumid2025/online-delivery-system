const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  pickup_address: { type: DataTypes.TEXT, allowNull: false },
  delivery_address: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('pending','accepted','picked_up','delivered','canceled'), defaultValue: 'pending' },
  total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { timestamps: true });

Order.belongsTo(User, { as: 'customer', foreignKey: 'customer_id' });
Order.belongsTo(User, { as: 'driver', foreignKey: 'driver_id' });

module.exports = Order;
