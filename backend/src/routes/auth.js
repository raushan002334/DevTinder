const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');

// Sign Up Route
authRouter.post("/signup", async (req, res) => {

    try {
        // Validation of data
        validateSignUpData(req);

        const {password} = req.body;
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        //creating a new instance of user model
        const user = new User(req.body);
        await user.save();

        const token = await user.getJWT();
        res.cookie("token", token, { httpOnly: true });

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: safeUser,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}); 

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const isPasswordMatch = await user.validatePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = await user.getJWT();

        res.cookie("token", token, { httpOnly: true });

        const safeUser = user.toObject();
        delete safeUser.password;

        res.json({
            success: true,
            message: "Login successful",
            data: safeUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout successfully" });
});

module.exports = authRouter;
