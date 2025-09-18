// File Path: backend/routes/driver.js

const express = require('express');
const { getMyDriverProfile, updateMyDriverProfile } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// This ensures all routes in this file are protected and only accessible by users with the 'driver' role
router.use(protect);
router.use(authorize('driver'));

// Define the routes for getting and updating the driver's own profile
router.route('/profile/me')
    .get(getMyDriverProfile)
    .put(updateMyDriverProfile);

module.exports = router;

