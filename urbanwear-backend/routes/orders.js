const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders (Protected Route)
router.post('/', protect, async (req, res) => {
    try {
        const { items, total, shippingAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No order items' });
        }

        const newOrder = new Order({
            user: req.user, // Comes from the auth middleware token
            items,
            total,
            shippingAddress
        });

        const createdOrder = await newOrder.save();
        res.status(201).json({ msg: 'Order placed successfully', order: createdOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/orders/myorders (Protected Route)
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;