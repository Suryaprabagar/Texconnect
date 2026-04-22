const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { apiResponse } = require('../utils/apiResponse');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return apiResponse(res, 401, false, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-passwordHash');
    if (!req.user || req.user.status !== 'active') {
      return apiResponse(res, 401, false, 'Unauthorized or account suspended');
    }

    next();
  } catch (error) {
    return apiResponse(res, 401, false, 'Invalid or expired token');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return apiResponse(res, 403, false, 'Forbidden: Access denied');
    }
    next();
  };
};

module.exports = { auth, authorize };
