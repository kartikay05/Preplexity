import "dotenv/config";
import app from "./src/app.js";
import http from 'http'
import connectionToDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app)

initSocket(httpServer)

const server = httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

connectionToDB();

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});