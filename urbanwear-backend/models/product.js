const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCat: { type: String },
    badge: { type: String },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    sizes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);