import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: `${process.env.CLIENT_URL}` || "http://localhost:5173",
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id)
    })
}


export function getIO(){
    if (!io) {
        throw new Error("Socket.io is not Initialized");
    }

    return io
}