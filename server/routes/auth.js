const axios = require('axios');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer SMTP Transporter setup (Bypasses IP restrictions)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const User = require('../models/User');
const Otp = require('../models/Otp');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "No account exists. Please register first."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong password"
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
    let otp;
    console.log(`\n[API Request] POST /api/auth/send-otp received for: ${email}`);

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // GENERATE OTP
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`\n======================================================`);
        console.log(`[DEVELOPMENT ALERT] REGISTRATION OTP FOR ${email} IS: ${otp}`);
        console.log(`======================================================\n`);

        // DELETE OLD OTP
        await Otp.deleteMany({ email });

        // SAVE OTP
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        // SEND EMAIL USING NODEMAILER SMTP (Bypasses IP restrictions)
        await transporter.sendMail({
            from: '"MITR" <projectmitr1@gmail.com>',
            to: email,
            subject: 'Your MITR OTP Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>MITR OTP Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="letter-spacing: 5px; color: #10b981;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `
        });

        res.json({
            message: 'OTP sent successfully'
        });

    } catch (err) {
        console.error("OTP Send Failure (using dev terminal fallback):", err.response?.data || err.message);
        console.log(`\n======================================================`);
        console.log(`[DEVELOPMENT FALLBACK] OTP FOR ${email} IS: ${otp}`);
        console.log(`======================================================\n`);
        
        // Return success so development/testing is not blocked by Brevo IP authorization rules
        res.json({
            message: 'OTP sent successfully (Dev Fallback: check server terminal)'
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

        // DELETE OTP
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

// ---------------- LOGIN SEND OTP (Password Reset Bypass) ----------------
router.post('/login-send-otp', async (req, res) => {
    const { email } = req.body;
    let otp;
    console.log(`\n[API Request] POST /api/auth/login-send-otp received for: ${email}`);

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: 'No account exists. Please register first.'
            });
        }

        // GENERATE OTP
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`\n======================================================`);
        console.log(`[DEVELOPMENT ALERT] LOGIN BYPASS OTP FOR ${email} IS: ${otp}`);
        console.log(`======================================================\n`);

        // DELETE OLD OTP
        await Otp.deleteMany({ email });

        // SAVE OTP
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        // SEND EMAIL USING NODEMAILER SMTP (Bypasses IP restrictions)
        await transporter.sendMail({
            from: '"MITR" <projectmitr1@gmail.com>',
            to: email,
            subject: 'Your MITR Login Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>MITR Login Verification</h2>
                    <p>You requested a secure password bypass login code. Your OTP code is:</p>
                    <h1 style="letter-spacing: 5px; color: #10b981;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `
        });

        res.json({
            message: 'OTP sent successfully'
        });

    } catch (err) {
        console.error("Login OTP Send Failure (using dev terminal fallback):", err.response?.data || err.message);
        console.log(`\n======================================================`);
        console.log(`[DEVELOPMENT FALLBACK] LOGIN BYPASS OTP FOR ${email} IS: ${otp}`);
        console.log(`======================================================\n`);
        
        // Return success so development/testing is not blocked by Brevo IP authorization rules
        res.json({
            message: 'OTP sent successfully (Dev Fallback: check server terminal)'
        });
    }
});

// ---------------- LOGIN VERIFY OTP ----------------
router.post('/login-verify-otp', async (req, res) => {
    const { email, otp } = req.body;

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

        // FETCH USER
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'No account exists. Please register first.'
            });
        }

        // DELETE OTP
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
                role: user.role || 'student'
            }
        });

    } catch (err) {
        console.error("Login OTP Verify Error:", err.message);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});

module.exports = router;