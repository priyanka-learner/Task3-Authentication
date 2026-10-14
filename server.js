const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();

// Check required environment variables
if (!process.env.JWT_SECRET || !process.env.DB_NAME) {
throw new Error('Please configure your .env file');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Routes
app.use('/api', authRoutes);

// Test Route
app.get('/api', (req, res) => {
res.json({
message: 'Authentication API is running!'
});
});

// Protected Dashboard API
app.get('/api/dashboard', authenticateToken, async (req, res) => {
try {
const [users] = await db.execute(
'SELECT id, username, email FROM users WHERE id = ?',
[req.user.id]
);


    if (users.length === 0) {
        return res.status(401).json({
            message: 'User account not found.'
        });
    }

    return res.json({
        message: 'Welcome to your protected dashboard!',
        user: users[0]
    });

} catch (error) {
    console.error('Dashboard error:', error.message);

    return res.status(500).json({
        message: 'Could not load dashboard.'
    });
}


});

// Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
try {
await db.query('SELECT 1');


    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log('MySQL Database connected successfully!');
    });
} catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
}


}

startServer();
