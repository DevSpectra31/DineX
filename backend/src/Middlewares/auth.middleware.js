const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT from HTTP-only cookie
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
// Attaches user to req if token exists, but doesn't block the request if not
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return next(); // no token — continue as guest
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // Invalid token — just continue as guest
  }
  next();
};

module.exports = { protect, restrictTo, optionalAuth };
