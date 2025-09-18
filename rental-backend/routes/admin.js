const express = require('express');
const { protect, authorize } = require('../middleware/auth');

// Import models to fetch data
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get system-wide statistics
 * @access  Private (Admin)
 */
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' });
        const driverCount = await Driver.countDocuments();
        const totalRides = await Ride.countDocuments();
        const completedRides = await Ride.countDocuments({ status: 'completed' });

        const stats = {
            users: userCount,
            drivers: driverCount,
            totalRides,
            completedRides
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all registered users (excluding admins)
 * @access  Private (Admin)
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

/**
 * @route   GET /api/v1/admin/drivers
 * @desc    Get all drivers
 * @access  Private (Admin)
 */
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find().populate('userId', 'name email phoneNumber');
        res.status(200).json({ success: true, count: drivers.length, data: drivers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

/**
 * @route   GET /api/v1/admin/rides
 * @desc    Get a list of all rides in the system
 * @access  Private (Admin)
 */
router.get('/rides', async (req, res) => {
    try {
        const rides = await Ride.find()
            .populate('userId', 'name email')
            .populate({
                path: 'driverId',
                select: 'userId vehicleDetails',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            });
        res.status(200).json({ success: true, count: rides.length, data: rides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


module.exports = router;
