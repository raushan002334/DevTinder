const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


// Request a connection route
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {


        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Validate status
        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value: " + status });
        }

        // validate toUserId
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "The user you are trying to connect with does not exist" });
        }

        //check if a connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }



        // Restrict self connection requests
        if (fromUserId.toString() === toUserId) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({ message: req.user.firstName + " has marked " + status + " for " + toUser.firstName, data });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const status = req.params.status;
        const requestId = req.params.requestId;

        //if requested user has shown interested status then only allow accept or reject


        // Validate status
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value: " + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: 'interested'
        }).populate('fromUserId', 'firstName');
        if (!connectionRequest) {
            return res.status(404).json({ message: "No pending connection request found to review" });
        }   

        // Update the request status
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: req.user.firstName + " has " + status + " the connection request of " + connectionRequest.fromUserId.firstName, data });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = requestRouter;