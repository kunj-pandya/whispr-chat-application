import { Server } from "socket.io";

const userSocketMap = {};

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL],
        },
    });

    io.on("connection", (socket) => {

        const userId = socket.handshake.query.userId

        if (userId) userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
}

export function getRecevierSocketId(userId) {
    return userSocketMap[userId];
}

export { io };
