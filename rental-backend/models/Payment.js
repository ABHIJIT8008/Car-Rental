const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ride',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    gateway: {
        type: String,
        enum: ['Razorpay', 'Stripe', 'Other'],
        default: 'Razorpay',
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
