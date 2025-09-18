// File Path: backend/routes/map.js

const express = require('express');
const { getStaticMap } = require('../controllers/mapController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/static').get(getStaticMap);

module.exports = router;
