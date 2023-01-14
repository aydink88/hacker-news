const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');
const asyncHandler = require('../utils/async-handler');

module.exports = asyncHandler((req, _res, next) => {
  // if (req.method === 'OPTIONS') {
  //   return next();
  // }

  if (!req.headers.authorization) {
    return next(new AppError('Authentication failed.', 403));
  }

  const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.userData = { userId: decodedToken.id, role: decodedToken.role };
  return next();
});
