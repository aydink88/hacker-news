const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/async-handler');
const AppError = require('../utils/app-error');

exports.signIn = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username }).select('+password +email').lean().exec();
  if (!existingUser) {
    return next(new AppError('Email or password wrong', 403));
  }

  const isValidPassword = await bcrypt.compare(password.toString(), existingUser.password);

  if (!isValidPassword) {
    return next(new AppError('Email or password wrong', 403));
  }

  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return res.status(200).json({ ...existingUser, password: undefined, token });
});

// POST /api/v1/auth/signup
exports.signUp = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Inputs do not meet requirements', 422));
  }

  const { username, email, password } = req.body;

  const existingEmail = await User.findOne({ email }).select('+email').exec();

  if (existingEmail) {
    return next(new AppError('User already exists', 422));
  }

  let avatarImage;
  if (req.file === undefined) {
    avatarImage = 'uploads/avatar.png';
  } else {
    avatarImage = req.file.path;
  }

  const createdUser = new User({
    username,
    email,
    password,
    avatar: avatarImage,
  });

  await createdUser.save();

  const token = jwt.sign(
    { id: createdUser._id, email: createdUser.email, role: createdUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return res.status(201).json({
    id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    date: createdUser.createdAt,
    token,
  });
});

exports.me = asyncHandler(async (req, res) => {
  const { userId } = req.userData;
  const user = await User.findById(userId).select('+email').exec();
  return res.status(200).json({ user });
});
