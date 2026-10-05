const jwt = require('jsonwebtoken');
const memoryStore = require('../data/memoryStore');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'caresetu_super_secure_jwt_secret_2026';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login to view your secure health records.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check in MemoryStore first (or MongoDB if active)
    let user = memoryStore.findUserById(decoded.id);

    if (!user && memoryStore.isMongoConnected) {
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // fallback
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(', ')} roles.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
  JWT_SECRET
};
