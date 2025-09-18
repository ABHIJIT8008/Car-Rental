const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth'); // We'll create this middleware soon

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @route   POST /api/v1/payments/order
 * @desc    Create a Razorpay order for a ride
 * @access  Private
 */
router.post('/order', protect, async (req, res) => {
    try {
        const { rideId } = req.body;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }
        
        // Use finalFare or estimatedFare. Amount must be in the smallest currency unit (e.g., paise).
        const amountInPaise = Math.round((ride.finalFare || ride.estimatedFare) * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_ride_${ride._id}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        
        // Create a pending payment record in our DB
        await Payment.create({
            rideId: ride._id,
            amount: ride.finalFare || ride.estimatedFare,
            gateway: 'Razorpay',
            status: 'pending',
            razorpay: {
                orderId: order.id
            }
        });

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public (Webhook)
 */
router.post('/verify', async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(order_id + "|" + payment_id)
        .digest('hex');

    if (generated_signature === signature) {
        // Payment is successful
        const payment = await Payment.findOneAndUpdate(
            { 'razorpay.orderId': order_id },
            {
                status: 'successful',
                'razorpay.paymentId': payment_id,
                'razorpay.signature': signature,
            },
            { new: true }
        );

        if (payment) {
            // Update the ride to link the payment
            await Ride.findByIdAndUpdate(payment.rideId, { paymentId: payment._id });
        }
        
        res.status(200).json({ success: true, message: "Payment verified successfully." });
    } else {
        await Payment.findOneAndUpdate(
            { 'razorpay.orderId': order_id },
            { status: 'failed' }
        );
        res.status(400).json({ success: false, message: "Payment verification failed." });
    }
});


module.exports = router;
