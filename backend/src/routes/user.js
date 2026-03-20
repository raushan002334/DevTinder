const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const mongoose = require('mongoose');

const USER_SAFE_DATA = 'firstName lastName photoURL gender age about skills';

// Get all connection requests for the authenticated user

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({ 
            toUserId: userId,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName emailId photoURL about');
        res.send({ 
            message: "Connection requests found for " + req.user.firstName,
            connectionRequests
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}); 


// Get all accepted connections for the authenticated user (either sent or received)
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        })
          .populate('fromUserId', USER_SAFE_DATA)
          .populate('toUserId', USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === userId.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.send({ 
            message: "Connections found for " + req.user.firstName,
            connections: data
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// feed for authenticated user
userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 50) limit = 50; // max limit
        const skip = (page - 1) * limit;
        // Exclude users who are already connected or have pending requests
        const excludedUserIds = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        }).then(requests => {
            const ids = requests.map(req => [req.fromUserId.toString(), req.toUserId.toString()]).flat();
            ids.push(userId.toString()); // Exclude self
            return Array.from(new Set(ids)); // Unique IDs
        });

        const users = await User.find({
            _id: {
                $nin: excludedUserIds,
                $ne: userId,
            },
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send({ 
            message: "Feed found for " + req.user.firstName,
            users
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(userId).select(USER_SAFE_DATA + ' emailId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

module.exports = userRouter;