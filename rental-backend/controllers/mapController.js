// File Path: backend/controllers/mapController.js

const asyncHandler = require('express-async-handler');

// This is a free Static Map API provider. No key is required for basic use.
const MAPQUEST_API_KEY = 'YOUR_MAPQUEST_API_KEY'; // Replace with a free key from developer.mapquest.com

/**
 * @desc    Generate a static map image URL
 * @route   GET /api/v1/map/static
 * @access  Private
 */
exports.getStaticMap = asyncHandler(async (req, res, next) => {
    const { pickup, dropoff } = req.query;

    if (!pickup || !dropoff) {
        res.status(400);
        throw new Error('Please provide pickup and dropoff coordinates');
    }

    const [pickupLon, pickupLat] = pickup.split(',');
    const [dropoffLon, dropoffLat] = dropoff.split(',');

    // Construct the URL for the MapQuest Static Map API
    const mapUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAPQUEST_API_KEY}&locations=${pickupLat},${pickupLon}|marker-start||${dropoffLat},${dropoffLon}|marker-end&size=800,600@2x`;

    res.status(200).json({
        success: true,
        url: mapUrl,
    });
});
