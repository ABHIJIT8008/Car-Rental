// File Path: backend/controllers/driverController.js

const Driver = require('../models/Driver');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get current driver's profile
 * @route   GET /api/v1/driver/profile/me
 * @access  Private (Driver)
 */
exports.getMyDriverProfile = asyncHandler(async (req, res, next) => {
    // req.user.id comes from the 'protect' middleware
    const driver = await Driver.findOne({ userId: req.user.id });

    if (!driver) {
        res.status(404);
        throw new Error('Driver profile not found.');
    }

    res.status(200).json({
        success: true,
        data: driver
    });
});


/**
 * @desc    Update current driver's profile (for onboarding)
 * @route   PUT /api/v1/driver/profile/me
 * @access  Private (Driver)
 */
exports.updateMyDriverProfile = asyncHandler(async (req, res, next) => {
    const { vehicleModel, licensePlate, vehicleColor, initialLocation } = req.body;

    const driver = await Driver.findOne({ userId: req.user.id });

    if (!driver) {
        res.status(404);
        throw new Error('Driver profile not found.');
    }

    // Update the fields
    driver.vehicleDetails = {
        model: vehicleModel,
        licensePlate: licensePlate,
        color: vehicleColor
    };
    
    if (initialLocation && initialLocation.coordinates) {
        driver.currentLocation = {
            type: 'Point',
            coordinates: initialLocation.coordinates
        };
    }

    // Mark the profile as complete by setting vehicle details
    await driver.save();

    res.status(200).json({
        success: true,
        data: driver
    });
});
