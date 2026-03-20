const Message = require('../models/message');

const registerChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User ${socket.user.firstName} connected: ${socket.id}`);

        socket.on('joinChat', ({ targetUserId }) => {
            const userId = socket.user._id.toString();
            const roomId = [userId, targetUserId].sort().join('_');
            socket.join(roomId);
            console.log(`User ${socket.user.firstName} joined room: ${roomId}`);
        });

        socket.on('sendMessage', async ({ receiverId, text }) => {
            try {
                const senderId = socket.user._id;
                const message = new Message({ senderId, receiverId, text });
                await message.save();

                const roomId = [senderId.toString(), receiverId].sort().join('_');
                io.to(roomId).emit('receiveMessage', {
                    senderId,
                    receiverId,
                    text,
                    createdAt: message.createdAt
                });
            } catch (err) {
                console.error('Error sending message:', err.message);
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = registerChatSocket;
