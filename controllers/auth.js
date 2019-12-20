const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/ErrorResponse');

const cookieExpire = process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  const options = {
    expires: new Date(Date.now() + cookieExpire),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true });
};

const registration = asyncHandler(async (req, res, next) => {
  const { cellNumber, name, password } = req.body;
  const user = await User.create({ cellNumber, name, password });
  sendToken(user, 200, res);
});

const login = asyncHandler(async (req, res, next) => {
  const { cellNumber, password } = req.body;
  if (!password || !cellNumber) {
    return next(new ErrorResponse('Please provide cell number and password', 400));
  }
  const user = await User.findOne({ cellNumber }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Authorization failed', 401));
  }

  const passwordsMatch = await user.matchPassword(password);
  if (!passwordsMatch) {
    return next(new ErrorResponse('Authorization failed', 401));
  }
  sendToken(user, 200, res);
});

const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).redirect('/login');
};

module.exports = {
  registration,
  login,
  logout,
};
