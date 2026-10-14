const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
try {
const { username, email, password } = req.body;


    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3 || cleanUsername.length > 100) {
        return res.status(400).json({
            message: 'Username must be 3-100 characters long.'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({
            message: 'Please enter a valid email address.'
        });
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters.'
        });
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({
            message: 'Password is too long.'
        });
    }

    const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [cleanUsername, cleanEmail]
    );

    if (existingUsers.length > 0) {
        return res.status(409).json({
            message: 'Username or email already exists.'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [cleanUsername, cleanEmail, hashedPassword]
    );

    return res.status(201).json({
        message: 'Registration successful! Please login.'
    });

} catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Username or email already exists.'
        });
    }

    console.error('Registration error:', error.message);

    return res.status(500).json({
        message: 'Registration failed. Please try again.'
    });
}


});

// User Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;


    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await db.execute(
        'SELECT id, username, email, password FROM users WHERE email = ?',
        [cleanEmail]
    );

    if (users.length === 0) {
        return res.status(401).json({
            message: 'Invalid email or password.'
        });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        return res.status(401).json({
            message: 'Invalid email or password.'
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );

    return res.json({
        message: 'Login successful!',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });

} catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
        message: 'Login failed. Please try again.'
    });
}


});

module.exports = router;
