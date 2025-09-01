const express = require('express');
const { getClientIdentity } = require('../middleware/auth');
const { buckets, getWindowId } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/', (req, res) => {
  const { key, role } = getClientIdentity(req);
  const windowId = getWindowId();
  const bucketKey = `chat:${key}:${windowId}`;
  const entry = buckets.get(bucketKey) || { count: 0 };

  const limit = { guest: 3, free: 10, premium: 50 }[role] || 3;
  const remaining = limit - entry.count;

  res.json({
    success: true,
    used: entry.count,
    remaining: remaining < 0 ? 0 : remaining,
    role,
  });
});

module.exports = router;