const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const validator = require("validator");

// profile route to get user profile
profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).send("User not found.");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// profile route to update user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // Validate edit data
        validateEditProfileData(req);

        const user = req.user;
        const updates = req.body;
        if (!user) {
            return res.status(404).send("User not found.");
        }    

        const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true }).select('-password');
        res.json({message: "Profile updated successfully", user: updatedUser});
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

//forgot password route
profileRouter.post("/profile/password",userAuth, async (req, res) => {
      
    try {
        const { newPassword } = req.body;
        const user = req.user;
        if(!validator.isStrongPassword(newPassword)) {
            throw new Error("Please enter strong password");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });                 
        }
});     

module.exports = profileRouter;
