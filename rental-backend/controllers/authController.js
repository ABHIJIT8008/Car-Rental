// File Path: backend/controllers/authController.js

const User = require('../models/User');
const Driver = require('../models/Driver');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Register a new user or driver
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // If the role is 'driver', create a corresponding driver profile
    if (role === 'driver') {
        await Driver.create({
            userId: user._id,
        });
    }

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user,
    });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});

