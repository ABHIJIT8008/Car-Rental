const express = require('express');
const {
  requestRide,
  getNearbyDrivers,
  getPendingRides,
  acceptRide,
  getRideStatus,
  cancelRide,
  getRideById
} = require('../controllers/rideController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// This middleware ensures that a user must be logged in to access any of these routes.
router.use(protect);

// --- User-specific routes ---
router.route('/request').post(authorize('user'), requestRide);
router.route('/nearby').get(authorize('user'), getNearbyDrivers);

// --- Driver-specific routes ---
router.route('/pending').get(authorize('driver'), getPendingRides);
router.route('/accept/:id').patch(authorize('driver'), acceptRide);

// --- Shared & More Specific Routes (MUST BE LAST) ---
// These routes use a parameter (:id), so they must be defined after the static routes above
// to prevent "pending" from being interpreted as an ID.
router.route('/:id/status').get(authorize('user'), getRideStatus);
router.route('/:id').delete(authorize('user'), cancelRide);
router.route('/:id').get(getRideById); // Auth for this is handled in the controller

module.exports = router;