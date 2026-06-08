const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/urbanwear');

const products = [
    // ================= MEN (18) =================
    { name: "Classic Denim Jacket", price: 299, category: "Men", badge: "New", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", rating: 4.7, sizes: ["S","M","L","XL"] },
    { name: "Urban Hoodie Black", price: 199, category: "Men", badge: "Trending", image: "https://images.unsplash.com/photo-1520975958225-9e5d5d6a0f0a?w=800", rating: 4.6, sizes: ["S","M","L","XL"] },
    { name: "Slim Fit Formal Shirt", price: 149, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800", rating: 4.5, sizes: ["S","M","L","XL"] },
    { name: "Casual White T-Shirt", price: 99, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", rating: 4.4, sizes: ["S","M","L","XL"] },
    { name: "Black Leather Jacket", price: 399, category: "Men", badge: "Hot", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", rating: 4.9, sizes: ["M","L","XL"] },
    { name: "Formal Blazer", price: 450, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", rating: 4.7, sizes: ["M","L","XL"] },
    { name: "Jogger Pants", price: 129, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1520975922284-7a5b2c7d5c12?w=800", rating: 4.3, sizes: ["S","M","L"] },
    { name: "Casual Polo T-Shirt", price: 120, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=800", rating: 4.4, sizes: ["S","M","L","XL"] },
    { name: "Cargo Pants", price: 180, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800", rating: 4.5, sizes: ["S","M","L","XL"] },
    { name: "Winter Sweatshirt", price: 160, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800", rating: 4.6, sizes: ["S","M","L","XL"] },
    { name: "Street Style Jacket", price: 220, category: "Men", badge: "New", image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800", rating: 4.7, sizes: ["M","L","XL"] },
    { name: "Graphic T-Shirt", price: 110, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800", rating: 4.3, sizes: ["S","M","L","XL"] },
    { name: "Denim Jeans Blue", price: 199, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", rating: 4.6, sizes: ["30","32","34","36"] },
    { name: "Winter Coat", price: 480, category: "Men", badge: "Premium", image: "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800", rating: 4.9, sizes: ["M","L","XL"] },
    { name: "Track Jacket", price: 170, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1520975744811-0bcd3f1d3f18?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "Basic Hoodie Grey", price: 150, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1520975913658-3b3a8c6c9f45?w=800", rating: 4.4, sizes: ["S","M","L","XL"] },
    { name: "Streetwear Oversized Tee", price: 130, category: "Men", badge: "Trending", image: "https://images.unsplash.com/photo-1520975682031-a8f9b9c8f7c2?w=800", rating: 4.6, sizes: ["S","M","L","XL"] },
    { name: "Formal Pants Black", price: 180, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800", rating: 4.5, sizes: ["30","32","34","36"] },

    // ================= WOMEN (18) =================
    { name: "Silk Evening Dress", price: 399, category: "Women", badge: "New", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", rating: 4.9, sizes: ["XS","S","M","L"] },
    { name: "Elegant Summer Dress", price: 249, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "Floral Maxi Dress", price: 299, category: "Women", badge: "Trending", image: "https://images.unsplash.com/photo-1520975869010-0c9c3a8d7c34?w=800", rating: 4.7, sizes: ["S","M","L"] },
    { name: "Casual Top Pink", price: 120, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", rating: 4.4, sizes: ["XS","S","M"] },
    { name: "Designer Saree", price: 550, category: "Women", badge: "Premium", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800", rating: 4.9, sizes: ["Free Size"] },
    { name: "Office Formal Shirt", price: 180, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975691792-3c5a9d4d9c6c?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "High Waist Jeans", price: 210, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", rating: 4.6, sizes: ["26","28","30","32"] },
    { name: "Winter Coat Women", price: 420, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800", rating: 4.8, sizes: ["S","M","L"] },
    { name: "Party Wear Gown", price: 600, category: "Women", badge: "Hot", image: "https://images.unsplash.com/photo-1520975957740-3c8c6a2c2c3f?w=800", rating: 5.0, sizes: ["S","M","L"] },
    { name: "Casual T-Shirt Women", price: 99, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975931382-3c5b8c6a1c4d?w=800", rating: 4.3, sizes: ["S","M","L"] },
    { name: "Denim Jacket Women", price: 250, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", rating: 4.6, sizes: ["S","M","L"] },
    { name: "Ethnic Kurti", price: 180, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "Party Crop Top", price: 140, category: "Women", badge: "Trending", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", rating: 4.6, sizes: ["S","M","L"] },
    { name: "Designer Skirt", price: 160, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975869010-0c9c3a8d7c34?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "Silk Blouse", price: 190, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975691792-3c5a9d4d9c6c?w=800", rating: 4.6, sizes: ["S","M","L"] },
    { name: "Casual Hoodie Women", price: 150, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975913658-3b3a8c6c9f45?w=800", rating: 4.4, sizes: ["S","M","L"] },
    { name: "Printed Dress", price: 230, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1520975869010-0c9c3a8d7c34?w=800", rating: 4.5, sizes: ["S","M","L"] },
    { name: "Luxury Evening Gown", price: 750, category: "Women", badge: "Premium", image: "https://images.unsplash.com/photo-1520975957740-3c8c6a2c2c3f?w=800", rating: 5.0, sizes: ["S","M","L"] },

    // ================= ACCESSORIES (14) =================
    { name: "Luxury Wrist Watch", price: 199, category: "Accessories", badge: "Hot", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", rating: 4.8, sizes: ["One Size"] },
    { name: "Minimal Watch Black", price: 180, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", rating: 4.6, sizes: ["One Size"] },
    { name: "Leather Belt", price: 90, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e0?w=800", rating: 4.4, sizes: ["One Size"] },
    { name: "Sunglasses Classic", price: 120, category: "Accessories", badge: "Trending", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", rating: 4.7, sizes: ["One Size"] },
    { name: "Premium Sneakers", price: 220, category: "Accessories", badge: "Sale", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", rating: 4.8, sizes: ["8","9","10","11"] },
    { name: "Sports Shoes", price: 180, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1528701800489-20be3c3ea9d6?w=800", rating: 4.6, sizes: ["7","8","9","10"] },
    { name: "Backpack Urban", price: 160, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", rating: 4.5, sizes: ["One Size"] },
    { name: "Leather Wallet", price: 80, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800", rating: 4.4, sizes: ["One Size"] },
    { name: "Cap Street Style", price: 60, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1520975957740-3c8c6a2c2c3f?w=800", rating: 4.3, sizes: ["One Size"] },
    { name: "Smart Watch", price: 300, category: "Accessories", badge: "New", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", rating: 4.8, sizes: ["One Size"] },
    { name: "Bracelet Set", price: 70, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", rating: 4.4, sizes: ["One Size"] },
    { name: "Neck Chain Gold", price: 150, category: "Accessories", badge: "Hot", image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e0?w=800", rating: 4.7, sizes: ["One Size"] },
    { name: "Travel Bag", price: 250, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", rating: 4.6, sizes: ["One Size"] },
    { name: "Ring Set Fashion", price: 50, category: "Accessories", badge: "", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800", rating: 4.3, sizes: ["One Size"] }
];

async function seed() {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);

        console.log("✅ 50 Products seeded successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
}

seed();