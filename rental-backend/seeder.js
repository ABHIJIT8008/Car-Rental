// File Path: backend/seeder.js

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
const User = require('./models/User');
const Driver = require('./models/Driver');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// --- Sample Driver Data for Indore Area ---
const driversData = [
    {
        name: 'Rohan Sharma',
        email: 'rohan.sharma@example.com',
        password: 'password123',
        vehicle: { model: 'Maruti Swift', licensePlate: 'MP09 AB 1111', color: 'White' },
        location: { type: 'Point', coordinates: [75.8940, 22.7540] } // Near Vijay Nagar Square
    },
    {
        name: 'Priya Verma',
        email: 'priya.verma@example.com',
        password: 'password123',
        vehicle: { model: 'Hyundai i20', licensePlate: 'MP09 CD 2222', color: 'Red' },
        location: { type: 'Point', coordinates: [75.8981, 22.7495] } // Near Sayaji Hotel
    },
    {
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        password: 'password123',
        vehicle: { model: 'Tata Nexon', licensePlate: 'MP09 EF 3333', color: 'Blue' },
        location: { type: 'Point', coordinates: [75.9035, 22.7562] } // Near Mangal City Mall
    },
    {
        name: 'Sunita Gupta',
        email: 'sunita.gupta@example.com',
        password: 'password123',
        vehicle: { model: 'Honda Amaze', licensePlate: 'MP09 GH 4444', color: 'Silver' },
        location: { type: 'Point', coordinates: [75.8851, 22.7511] } // Near Saket Square
    }
];

// Import into DB
const importData = async () => {
    try {
        // First, clear existing drivers to avoid duplicates
        await Driver.deleteMany();
        // Also delete the user accounts associated with our sample drivers
        const driverEmails = driversData.map(d => d.email);
        await User.deleteMany({ email: { $in: driverEmails } });

        console.log('Old driver data destroyed...');

        // Now, create the new data
        for (const driver of driversData) {
            const user = await User.create({
                name: driver.name,
                email: driver.email,
                password: driver.password,
                role: 'driver'
            });

            await Driver.create({
                userId: user._id,
                vehicleDetails: driver.vehicle,
                currentLocation: driver.location,
                isAvailable: true
            });
        }

        console.log('Sample driver data imported successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Destroy data
const destroyData = async () => {
    try {
        await Driver.deleteMany();
        const driverEmails = driversData.map(d => d.email);
        await User.deleteMany({ email: { $in: driverEmails } });
        console.log('Sample driver data destroyed successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Check for command line arguments to run the functions
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
}
