const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/users');
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

router.get('/', userController.getUsers);
router.post('/', checkAuth, fileUpload.single('avatar'), userValidator, userController.createUser);
router.get('/:uid', userController.getUserById);
router.patch('/:uid', checkAuth, userController.updateUser);
router.delete('/:uid', checkAuth, userController.deleteUser);

module.exports = router;
