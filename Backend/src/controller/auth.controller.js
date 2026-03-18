import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { sendMail } from "../services/mail.service.js";
import asyncHandler from 'express-async-handler';


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */

export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendMail({
        to: email,
        subject: "Welcome to Perplexity-Krt!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>KRT AI</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${process.env.DOMAIN_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});

/**
 * @desc Login a user 
 * @route POST /api/auth/login
 * @access Public
 * @body {username, password}
 */

export const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { email: identifier },
            { username: identifier }
        ]
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Username/Email Or Password",
            success: false,
            err: "User not Found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid Username or password",
            success: false,
            err: "Wrong Credentials"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email Not Verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User LoggedIn successfully.",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
});

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */

export const getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
});

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query {token}
 */

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">Go to Login</a>
    `

        return res.send(html);

    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
});

/**
 * @desc Logout a user by clearing cookies
 * @route GET /api/auth/logout
 * @access Private
 */

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully",
        success: true
    });
});