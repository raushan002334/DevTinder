const express = require('express');
const chatRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const Message = require('../models/message');

// GET /chat/:targetUserId - fetch chat history between logged-in user and target user
chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { targetUserId } = req.params;

        // Check if both users are connected (accepted)
        const isConnected = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: 'accepted' },
                { fromUserId: targetUserId, toUserId: userId, status: 'accepted' }
            ]
        });

        if (!isConnected) {
            return res.status(403).json({ message: 'You are not connected with this user' });
        }

        // Fetch messages between both users (both directions)
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: userId }
            ]
        })
        .populate('senderId', 'firstName lastName photoURL')
        .sort({ createdAt: 1 }); // oldest first

        res.json({ messages });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = chatRouter;
