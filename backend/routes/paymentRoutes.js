const express = require('express');
const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const router = express.Router();

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    const { order_id, amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // cents
            currency: 'usd',
        });

        // Save payment in DB
        const payment = await Payment.create({
            order_id,
            amount,
            payment_method: 'card',
            status: 'pending'
        });

        res.json({ clientSecret: paymentIntent.client_secret, paymentId: payment.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
    const { paymentId } = req.body;
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        payment.status = 'completed';
        await payment.save();

        // Update corresponding order status if needed
        const order = await Order.findByPk(payment.order_id);
        order.status = 'accepted'; // Example: order confirmed after payment
        await order.save();

        res.json({ message: 'Payment confirmed', payment, order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
