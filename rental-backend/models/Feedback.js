// models/Feedback.js

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride',
        required: true,
        unique: true, // A ride can only have one feedback entry
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    driverId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Driver',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

// Post-save hook to recalculate driver's average rating
FeedbackSchema.post('save', async function() {
    try {
        const driverId = this.driverId;
        const feedbacks = await this.constructor.find({ driverId });

        const totalRating = feedbacks.reduce((acc, item) => acc + item.rating, 0);
        const averageRating = totalRating / feedbacks.length;

        await this.model('Driver').findByIdAndUpdate(driverId, {
            averageRating: averageRating.toFixed(2) // Keep it to 2 decimal places
        });
    } catch (error) {
        console.error('Error updating average rating:', error);
    }
});


module.exports = mongoose.model('Feedback', FeedbackSchema);

