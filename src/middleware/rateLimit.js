const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map();

function getWindowId(now = Date.now()) {
  return Math.floor(now / WINDOW_MS);
}

function rateLimit(routeName = 'chat') {
  return (req, res, next) => {
    const { getClientIdentity } = require('./auth');
    const { key, role } = getClientIdentity(req);
    const limit = { guest: 3, free: 10, premium: 50 }[role] || 3;
    const windowId = getWindowId();
    const bucketKey = `${routeName}:${key}:${windowId}`;
    const entry = buckets.get(bucketKey) || { count: 0 };

    if (entry.count >= limit) {
      const resetMs = ((windowId + 1) * WINDOW_MS) - Date.now();
      return res.status(429).json({
        success: false,
        error: `Too many requests. ${capitalize(role)} users can make ${limit} requests per hour.`,
        remaining_requests: 0,
        reset_in_seconds: Math.ceil(resetMs / 1000),
        role,
      });
    }

    entry.count += 1;
    buckets.set(bucketKey, entry);
    res.locals.rateLimit = { limit, used: entry.count, remaining: limit - entry.count, role };
    next();
  };
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { rateLimit, buckets, getWindowId };