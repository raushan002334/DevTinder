const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    }
});
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const socketAuth = require("./middlewares/socketAuth");
const registerChatSocket = require("./socket/chatSocket");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

// Routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


// Socket.IO - Real-time chat
io.use(socketAuth);
registerChatSocket(io);

connectDB()
    .then(() => {
        console.log("Database connected!");
        server.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}!`);
        });
    })
    .catch((err) => {
        console.log(err);
        console.log("Database connection failed!");
    });



module.exports = app;

