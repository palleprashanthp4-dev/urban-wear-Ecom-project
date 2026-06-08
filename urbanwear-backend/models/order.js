const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String },
        qty: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: { type: String, default: 'Processing' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);