const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Otp = require('../models/Otp');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role || 'student'
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// ---------------- SEND OTP ----------------
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // GENERATE OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // DELETE OLD OTP
        await Otp.deleteMany({ email });

        // SAVE NEW OTP
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        // SEND EMAIL
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'MITR Email Verification OTP',
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1>${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `
        });

        res.json({
            message: 'OTP sent successfully'
        });

    } catch (err) {
        console.error("OTP Error:", err.message);

        res.status(500).json({
            message: 'Failed to send OTP'
        });
    }
});

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
    const { email, password, otp } = req.body;

    try {

        // FIND OTP
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'OTP not found'
            });
        }

        // CHECK OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        // CHECK EXPIRY
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                message: 'OTP expired'
            });
        }

        // CHECK USER EXISTS
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // CREATE USER
        user = new User({
            email,
            password,
            role: 'student'
        });

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // DELETE OTP AFTER SUCCESS
        await Otp.deleteMany({ email });

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Register Error:", err.message);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});

module.exports = router;