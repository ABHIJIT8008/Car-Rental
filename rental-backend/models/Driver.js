// models/Driver.js

const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicleDetails: {
        model: String,
        licensePlate: String,
        color: String,
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    averageRating: {
        type: Number,
        default: 5,
    }
}, {
    timestamps: true
});

// *** ADD THIS LINE ***
// This tells Mongoose to create a 2dsphere index on the currentLocation field.
DriverSchema.index({ currentLocation: '2dsphere' });


module.exports = mongoose.model('Driver', DriverSchema);
// ```

// **After adding this line, simply restart your Node.js server.** Mongoose will connect to the database and automatically run the `createIndex` command for you in the background.

// #### **Solution 2: Create the Index Manually (Using a GUI or Shell)**

// This is a quicker, more direct way to fix the problem immediately.

// **Using MongoDB Compass (GUI):**
// 1.  Connect to your database.
// 2.  Navigate to your `drivers` collection.
// 3.  Click on the **Indexes** tab.
// 4.  Click **Create Index**.
// 5.  In the field input, specify `currentLocation` and select **2dsphere** from the dropdown menu.
// 6.  Click the **Create Index** button.



// **Using the Mongo Shell (`mongosh`):**
// 1.  Connect to your database via the terminal.
// 2.  Switch to the correct database: `use your_database_name` (e.g., `use test`).
// 3.  Run the following command:
//     ```
// javascript db.drivers.createIndex({ currentLocation: "2dsphere" })
    

