const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");



const adminAuth = (req, res, next) => {
    console.log("Admin Auth is getting checked!")
    const token = req.headers["x-admin-token"];
    const isAdminAuthorized =
        Boolean(token) &&
        Boolean(process.env.ADMIN_TOKEN) &&
        token === process.env.ADMIN_TOKEN;
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
};

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
        const decode = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const userId = decode._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized request");
    } 

};

module.exports = {
    adminAuth,
    userAuth
}