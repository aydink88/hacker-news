const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const userValidator = [
  check('username', 'username is required').not().isEmpty(),
  check('email', 'Please include a valid email').normalizeEmail().isEmail(),
  check('password', 'Password should be at least 6 characters').isLength({
    min: 6,
  }),
];

router.post('/signin', authController.signIn);
router.post('/signup', fileUpload.single('avatar'), userValidator, authController.signUp);
router.get('/me', checkAuth, authController.me);

module.exports = router;
