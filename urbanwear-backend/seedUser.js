const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/urbanwear');

async function seedUsers() {
    try {
        // Clear existing users (recommended for testing)
        await User.deleteMany({});

        const users = [
            {
                name: "Prashanth Kumar",
                email: "prashanth@gmail.com",
                password: await bcrypt.hash("123456", 10)
            },
            {
                name: "Anjali Reddy",
                email: "anjali@gmail.com",
                password: await bcrypt.hash("123456", 10)
            },
            {
                name: "Ravi Teja",
                email: "ravi@gmail.com",
                password: await bcrypt.hash("123456", 10)
            },
            {
                name: "Sneha Sharma",
                email: "sneha@gmail.com",
                password: await bcrypt.hash("123456", 10)
            },
            {
                name: "Arjun Naidu",
                email: "arjun@gmail.com",
                password: await bcrypt.hash("123456", 10)
            },
            {
                name: "Test User",
                email: "test@gmail.com",
                password: await bcrypt.hash("123456", 10)
            }
        ];

        await User.insertMany(users);

        console.log("✅ 6 Users inserted successfully");

    } catch (err) {
        console.log("❌ Error:", err.message);
    } finally {
        mongoose.disconnect();
    }
}

seedUsers();