const jwt = require('jsonwebtoken');
const User = require('../models/user');

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake?.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: Token not found'));
        }

        if (!process.env.JWT_SECRET) {
            return next(new Error('Authentication error: JWT secret is not configured'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = user;
        return next();
    } catch (err) {
        return next(new Error('Authentication error: ' + err.message));
    }
};

module.exports = socketAuth;
