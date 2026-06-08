const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products/seed (Run once to populate DB)
router.get('/seed', async (req, res) => {
    try {
        await Product.deleteMany({});
        const fakeProducts = [
            { name: "Cashmere Overcoat", price: 450, category: "Women", badge: "New", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", rating: 4.9, sizes: ['XS','S','M','L'] },
            { name: "Urban Leather Jacket", price: 380, category: "Men", badge: "Trending", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", rating: 4.8, sizes: ['S','M','L','XL'] },
            { name: "Silk Evening Dress", price: 290, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", rating: 5.0, sizes: ['XS','S','M'] },
            { name: "Tailored Wool Suit", price: 520, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", rating: 4.7, sizes: ['M','L','XL'] },
            { name: "Minimalist Watch", price: 220, category: "Accessories", badge: "New", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", rating: 4.9, sizes: ['One Size'] },
            { name: "Premium Sneakers", price: 180, category: "Accessories", badge: "Sale", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", rating: 4.8, sizes: ['8','9','10','11'] }
        ];
        
        await Product.insertMany(fakeProducts);
        res.send('Database seeded successfully with real images!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/products (With filtering & search)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;