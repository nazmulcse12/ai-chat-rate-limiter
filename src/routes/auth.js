const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// POST /api/login
router.post('/', (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ success: false, error: 'userId and role are required' });
    }

    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token, role });
});

module.exports = router;