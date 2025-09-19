const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/error'); // Import error handler

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const feedbackRoutes = require('./routes/feedback');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const mapRoutes = require('./routes/map');
const driverRoutes = require('./routes/driver');

const app = express();

// Enable CORS
app.use(cors({
    origin: "https://car-rental-f-phi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/driver', driverRoutes);
// Use the error handler MIDDLEWARE (must be after mounting routers)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

