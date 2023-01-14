const fs = require('fs');
const AppError = require('../utils/app-error');

const errorHandler = (err, req, res, next) => {
  if (req.file && req.file.path !== 'uploads/avatar.png') {
    fs.unlink(req.file.path, (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    });
  }

  let error = { ...err };

  if (res.headerSent) {
    return next(error);
  }

  error.message = err.message;

  // Log to console for dev
  // eslint-disable-next-line no-console
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new AppError(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
