import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express()

// Security Middleware
app.use(helmet())
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