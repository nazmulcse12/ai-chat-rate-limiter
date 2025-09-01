const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null; // No token means guest access
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

function getClientIdentity(req) {
    if (req.user?.userId) {
        return { key: `user:${req.user.userId}`, role: req.user.role || 'free' };
    }
    return { key: `ip:${req.ip}`, role: 'guest' };
}

module.exports = { authenticateToken, getClientIdentity };