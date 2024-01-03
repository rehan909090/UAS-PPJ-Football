const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk sign-up
router.post('/signup', authController.signUp);

// Route untuk login
router.post('/login', authController.login);

module.exports = router;
