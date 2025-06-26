const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ MONGO_URI not set in environment variables');
        process.exit(1);
    }
    try {
        await mongoose.connect(uri); // No options needed for Mongoose 6+
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

