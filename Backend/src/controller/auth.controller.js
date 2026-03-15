import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { sendMail } from "../services/mail.service.js";


export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "user already exists"
        })
    }

    await sendMail({
        to: email,
        subject: "Welcome to Perplexity-Krt!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    const user = await userModel.create({ username, email, password })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}