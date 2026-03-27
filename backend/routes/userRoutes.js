const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Create a new order (customer)
router.post('/', async (req, res) => {
    const { customer_id, pickup_address, delivery_address, total_price } = req.body;
    try {
        const order = await Order.create({
            customer_id,
            pickup_address,
            delivery_address,
            total_price
        });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Assign a driver to an order (admin/system)
router.put('/assign/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { driver_id } = req.body;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.driver_id = driver_id;
        order.status = 'accepted';
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update order status (driver/system)
router.put('/status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // 'picked_up','delivered','canceled'
    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch orders for customer
router.get('/customer/:customerId', async (req, res) => {
    const { customerId } = req.params;
    try {
        const orders = await Order.findAll({ where: { customer_id: customerId } });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch orders for driver
router.get('/driver/:driverId', async (req, res) => {
    const { driverId } = req.params;
    try {
        const orders = await Order.findAll({ where: { driver_id: driverId } });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch all orders (admin)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
