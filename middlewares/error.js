const ErrorResponse = require('../utils/ErrorResponse');

const createError = err => {
  const { name, code } = err;

  if (name === 'CastError') {
    const message = 'Resource not found';
    return new ErrorResponse(message, 404);
  }

  if (name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return new ErrorResponse(message, 400);
  }

  if (code === 11000) {
    const message = 'Duplicate key';
    return new ErrorResponse(message, 400);
  }

  return new ErrorResponse(err.message || 'Server Error', 500);
};

const errorHandler = (err, req, res, next) => {
  //console.log(err.stack);

  const { statusCode, message } = createError(err);
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
