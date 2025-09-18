// File Path: backend/routes/auth.js

const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/v1/auth/register
router.post('/register', register);

// @route   POST /api/v1/auth/login
router.post('/login', login);

// This line is crucial for fixing the error.
// It ensures that we are exporting the router object itself.
module.exports = router;

