const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// Access the secret from .env or use a fallback for development
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Login check for ${email}: ${isMatch ? "MATCHED" : "FAILED"}`);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const payload = { user: { id: user.id } };

        // Sign the token using the secret
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

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
        res.status(500).json({ message: "Server Error during token generation" });
    }
});

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ email, password, role: 'student' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log(`✅ New user registered: ${email}`);

        const payload = { user: { id: user.id } };
        
        // Sign the token using the secret
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ message: "Server Error during token generation" });
    }
});

module.exports = router;