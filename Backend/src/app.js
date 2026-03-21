import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from 'path';

const app = express()

// Security Middleware
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, methods: ["GET", "POST", "PUT", "DELETE"] }))

// Logging
app.use(morgan("dev"))

// Built-in Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('./public'))

import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

app.use('/api/auth', authRouter)
app.use('/api/chats', chatRouter)

// React fallback (Express 5 compatible)
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve("./public/index.html"));
});


// Health check
// app.get('/', (req, res) => {
//     res.json({ "message": "Server is running." })
// })

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        err: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

export default app;