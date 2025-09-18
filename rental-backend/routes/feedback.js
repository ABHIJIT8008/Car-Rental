const express = require('express');
// Correctly destructure the 'protect' function from the imported module
const { protect } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

const router = express.Router();

/**
 * @route   POST /api/v1/feedback
 * @desc    Submit feedback for a completed ride
 * @access  Private (User)
 */
router.post('/', protect, async (req, res) => {
    try {
        const { rideId, rating, comment } = req.body;

        // 1. Find the ride
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        // 2. Check if the user trying to give feedback is the one who took the ride
        if (ride.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to give feedback for this ride' });
        }

        // 3. Check if ride is completed
        if (ride.status !== 'completed') {
            return res.status(400).json({ success: false, message: 'Feedback can only be submitted for completed rides.' });
        }

        // 4. Check if feedback for this ride already exists
        const existingFeedback = await Feedback.findOne({ rideId });
        if (existingFeedback) {
            return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this ride.' });
        }

        // 5. Create the new feedback
        const feedback = await Feedback.create({
            rideId,
            rating,
            comment,
            userId: req.user.id,
            driverId: ride.driverId
        });

        // 6. Recalculate the driver's average rating
        const driver = await Driver.findById(ride.driverId);
        if (driver) {
            const allFeedbacksForDriver = await Feedback.find({ driverId: ride.driverId });
            const totalRating = allFeedbacksForDriver.reduce((acc, item) => acc + item.rating, 0);
            driver.averageRating = (totalRating / allFeedbacksForDriver.length).toFixed(2);
            await driver.save();
        }

        res.status(201).json({ success: true, data: feedback });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;

