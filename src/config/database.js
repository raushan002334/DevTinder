const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://raushan:br0fOejoByPoiUyv@cluster0.ouhdxkl.mongodb.net/");
};

module.exports = connectDB;