import { sendMail } from "./services/mail.service.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------- ENV CHECK --------------------
const isProduction = process.env.NODE_ENV === "production";

// -------------------- MIDDLEWARE --------------------
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// ✅ Dynamic CORS (local + production)
app.use(
    cors({
        origin: isProduction
            ? "https://preplexity.onrender.com"
            : "http://localhost:5173",
        // origin: true,
        credentials: true,
    })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- STATIC (ONLY IN PRODUCTION) --------------------
if (isProduction) {
    app.use(express.static(path.join(__dirname, "../public")));
}

// -------------------- ROUTES --------------------
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// -------------------- TEST MAIL --------------------
app.get("/api/test-mail", async (req, res) => {
    try {
        await sendMail({
            to: "bhardwajkartikay489@gmail.com",
            subject: "Brevo Test 🚀",
            html: "<h1>It works!</h1>",
        });

        res.send("Email sent ✅");
    } catch (err) {
        res.status(500).send("Email failed ❌");
    }
});

// -------------------- REACT FALLBACK --------------------
if (isProduction) {
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../public", "index.html"));
    });
}

// -------------------- HEALTH CHECK --------------------
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running 🚀" });
// });

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        err: process.env.NODE_ENVV === "development" ? err : undefined,
    });
});

export default app;