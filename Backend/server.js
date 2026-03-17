import "dotenv/config";
import app from "./src/app.js";
import { connectionToDB } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectionToDB();


const server = app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

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