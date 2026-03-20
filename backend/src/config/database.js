const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set. Add it in backend/.env");
    }
    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;