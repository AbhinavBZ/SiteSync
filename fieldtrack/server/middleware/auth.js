const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Verify JWT token ──────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    // 2. Extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

// ── Role guard ────────────────────────────────────────────
// Usage: restrictTo('manager') or restrictTo('manager', 'worker')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action is for ${roles.join(' or ')}s only.`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
