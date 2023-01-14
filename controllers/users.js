const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/async-handler');
const AppError = require('../utils/app-error');
const User = require('../models/User');

// Get all users
// /api/v1/users, GET, PUBLIC
exports.getUsers = asyncHandler(async (_req, res, next) => {
  const users = await User.find();
  if (users.length === 0) {
    return next(new AppError('No user found', 404));
  }
  return res.status(200).json({ users });
});

// Get a user
// /api/v1/users/:uid, GET, PUBLIC
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.uid);
  res.status(200).json({ user });
});

// Create a user
// /api/v1/users/:uid, POST, PRIVATE(admin)
exports.createUser = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Inputs do not meet requirements', 422));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const createdUser = new User({
    username: req.body.username,
    email: req.body.email,
    avatar: req.file === undefined ? req.body.image : req.file.path,
    password: hashedPassword,
    role: req.body.role,
  });
  const user = await createdUser.save();
  return res.status(201).json({ user });
});

// Update a user
// /api/v1/users/:uid, PATCH, PRIVATE
exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  const user = await User.findByIdAndUpdate(req.params.uid, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({ user });
});

// DELETE a user
// /api/v1/users/:uid, DELETE, PRIVATE
exports.deleteUser = asyncHandler(async (req, res, next) => {
  if (req.userData.role !== 'admin') {
    return next(new AppError('You are not authorized', 403));
  }
  await User.findByIdAndDelete(req.params.uid);
  return res.status(204).json({ message: 'user deleted' });
});
