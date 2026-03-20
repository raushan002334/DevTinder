const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");



const adminAuth = (req, res, next) => {
    console.log("Admin Auth is getting checked!")
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
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
        const decode = await jsonwebtoken.verify(token, "DEVTINDERSECRETKEY");
        const userId = decode._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized request" + error.message);
    } 

};

module.exports = {
    adminAuth,
    userAuth
}