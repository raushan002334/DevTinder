const jwt = require('jsonwebtoken');
const User = require('../models/user');

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake?.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: Token not found'));
        }

        const decoded = jwt.verify(token, 'DEVTINDERSECRETKEY');
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
