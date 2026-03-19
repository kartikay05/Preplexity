import { Router } from "express";
import { register, login, getMe, verifyEmail, logout } from "../controller/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

const authRouter = Router()

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs for auth routes
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */

authRouter.post('/register', authLimiter, registerValidator, register)

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */

authRouter.post('/login', authLimiter, loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */

authRouter.get('/get-me', authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */

authRouter.get('/verify-email', verifyEmail)

/**
 * @route GET /api/auth/logout [Protected]
 * @desc Logout a user by clear it's cookies
 * @access Public
 */

authRouter.get('/logout', logout)

export default authRouter; 