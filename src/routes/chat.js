const express = require('express');
const { rateLimit } = require('../middleware/rateLimit.js');
const { askAI } = require('../services/ai.js');

const router = express.Router();

router.post('/', rateLimit('chat'), async (req, res) => {
    try {
        const aiResponse = await askAI(req.body.message);
        return res.json({
            success: true,
            message: aiResponse,
            remaining_requests: res.locals.rateLimit?.remaining ?? null,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request.',
        });
    }
});

module.exports = router;