const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/ErrorResponse');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

const authorize = (...roles) => (req, res, next) => {
  const { role } = req.user;
  if (!roles.includes(role)) {
    return next(new ErrorResponse(`User role ${role} is not authorized to access this route`, 403));
  }
  next();
};

exports.protect = protect;
exports.authorize = authorize;
