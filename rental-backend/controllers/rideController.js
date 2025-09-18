// File Path: backend/controllers/rideController.js

const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const asyncHandler = require('express-async-handler');

// ... (existing functions: requestRide, getNearbyDrivers, getPendingRides)

/**
 * @desc    Driver accepts a pending ride
 * @route   PATCH /api/v1/rides/accept/:id
 * @access  Private (Driver)
 */
exports.acceptRide = asyncHandler(async (req, res, next) => {
    const ride = await Ride.findById(req.params.id);
    if (!ride) { res.status(404); throw new Error('Ride not found'); }
    if (ride.status !== 'pending') { res.status(400); throw new Error(`Ride is no longer pending.`); }
    
    const driver = await Driver.findOne({ userId: req.user.id });
    if (!driver) { res.status(404); throw new Error('Driver profile not found'); }

    ride.driverId = driver._id;
    ride.status = 'accepted';
    await ride.save();

    driver.isAvailable = false;
    await driver.save();

    // After saving, find the ride again to populate the user details for the response
    const populatedRide = await Ride.findById(ride._id).populate('userId', 'name email');

    res.status(200).json({
        success: true,
        data: populatedRide // Send the fully detailed ride back to the driver's frontend
    });
});




exports.requestRide = asyncHandler(async (req, res, next) => {
    const { pickupLocation, dropoffLocation } = req.body;
    const userId = req.user.id;

    if (!pickupLocation || !dropoffLocation) {
        res.status(400); throw new Error('Please provide pickup and dropoff locations');
    }

    const nearbyDrivers = await Driver.find({
        currentLocation: { $near: { $geometry: { type: "Point", coordinates: pickupLocation.coordinates }, $maxDistance: 20000 } },
        isAvailable: true
    });

    if (nearbyDrivers.length === 0) {
        res.status(404); throw new Error('No available drivers found nearby.');
    }

    const ride = await Ride.create({
        userId,
        pickupLocation,   // This now includes coordinates AND the address string
        dropoffLocation,  // This now includes coordinates AND the address string
        estimatedFare: Math.floor(Math.random() * (350 - 100 + 1)) + 100,
    });

    res.status(201).json({ success: true, ride });
});

/**
 * @desc    Get nearby available drivers
 * @route   GET /api/v1/rides/nearby
 * @access  Private (User)
 */
exports.getNearbyDrivers = asyncHandler(async (req, res, next) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Please provide latitude and longitude');
    }

    const drivers = await Driver.find({
        currentLocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: 10000 // 10km
            }
        },
        isAvailable: true
    }).populate('userId', 'name');

    res.status(200).json({
        success: true,
        count: drivers.length,
        data: drivers
    });
});

/**
 * @desc    Get all pending rides for drivers
 * @route   GET /api/v1/rides/pending
 * @access  Private (Driver)
 */
exports.getPendingRides = asyncHandler(async (req, res, next) => {
    const rides = await Ride.find({ status: 'pending' }).populate('userId', 'name');
    res.status(200).json({
        success: true,
        count: rides.length,
        data: rides,
    });
});

// ... after the last existing function in the file

// ... inside backend/controllers/rideController.js

// --- REPLACE THE ENTIRE getRideStatus FUNCTION WITH THIS ---
/**
 * @desc    Get the status of a specific ride
 * @route   GET /api/v1/rides/:id/status
 * @access  Private (User who booked it)
 */
exports.getRideStatus = asyncHandler(async (req, res, next) => {
    const ride = await Ride.findById(req.params.id).populate({ path: 'driverId', select: 'vehicleDetails averageRating', populate: { path: 'userId', select: 'name' } });
    if (!ride) { res.status(404); throw new Error('Ride not found'); }
    if (ride.userId.toString() !== req.user.id) { res.status(403); throw new Error('User not authorized'); }
    res.status(200).json({ success: true, ride: ride });
});

/**
 * @desc    User cancels their ride request
 * @route   DELETE /api/v1/rides/:id
 * @access  Private (User who booked it)
 */
exports.cancelRide = asyncHandler(async (req, res, next) => {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
        res.status(404);
        throw new Error('Ride not found');
    }

    if (ride.userId.toString() !== req.user.id) {
        res.status(403);
        throw new Error('User not authorized to cancel this ride');
    }

    // If the ride was already accepted, we need to make the driver available again
    if (ride.status === 'accepted' || ride.status === 'ongoing') {
        const driver = await Driver.findById(ride.driverId);
        if (driver) {
            driver.isAvailable = true;
            await driver.save();
        }
    }
    
    await ride.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

/**
 * @desc    Get full ride details by ID
 * @route   GET /api/v1/rides/:id
 * @access  Private (User who booked it OR the assigned driver)
 */
exports.getRideById = asyncHandler(async (req, res, next) => {
    const ride = await Ride.findById(req.params.id)
        .populate({
            path: 'userId',
            select: 'name email' // User who booked
        })
        .populate({
            path: 'driverId',
            select: 'vehicleDetails averageRating',
            populate: {
                path: 'userId',
                select: 'name email' // Driver's user account details
            }
        });

    if (!ride) {
        res.status(404);
        throw new Error('Ride not found');
    }

    // Authorization: only the user who booked or the assigned driver can see
    if (
        ride.userId._id.toString() !== req.user.id &&
        (!ride.driverId || ride.driverId.userId.toString() !== req.user.id)
    ) {
        res.status(403);
        throw new Error('Not authorized to view this ride');
    }

    res.status(200).json({
        success: true,
        ride
    });
});
