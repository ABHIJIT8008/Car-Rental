// File Path: backend/models/Ride.js

const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
    // --- NEW: A field to store the human-readable address ---
    address: { type: String, required: false }
});

const RideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.ObjectId, ref: 'Driver', default: null },
    pickupLocation: { type: pointSchema, required: true },
    dropoffLocation: { type: pointSchema, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    estimatedFare: { type: Number, required: true },
    finalFare: { type: Number, default: null },
    requestedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);