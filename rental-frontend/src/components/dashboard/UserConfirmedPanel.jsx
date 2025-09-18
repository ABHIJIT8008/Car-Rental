// File: src/components/dashboard/UserConfirmedPanel.jsx
import React from 'react';
import { User, CarFront, Shield, Star } from 'lucide-react';


function UserConfirmedPanel({ resetRide, confirmedRideDetails }) {
if (!confirmedRideDetails?.driverId) {
return (
<div className="p-6 text-center">
<p>Waiting for driver details...</p>
</div>
);
}


const { driverId: driver, estimatedFare } = confirmedRideDetails;
const driverUser = driver.userId;
const vehicle = driver.vehicleDetails;


return (
<div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
<h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Driver Confirmed!</h2>
<p className="text-gray-400 mb-6">Your driver is on the way.</p>
<div className="bg-gray-900/50 p-6 rounded-xl space-y-4 flex-grow">
<div className="flex justify-between items-center">
<div className="flex items-center space-x-4">
<User size={24} className="text-indigo-400" />
<div>
<p className="text-gray-400 text-sm">Driver</p>
<p className="font-bold text-lg">{driverUser.name}</p>
</div>
</div>
<div className="flex items-center text-amber-400">
<Star size={16} className="mr-1" />
<span className="font-bold">{driver.averageRating}</span>
</div>
</div>
<div className="flex items-center space-x-4">
<CarFront size={24} className="text-indigo-400" />
<div>
<p className="text-gray-400 text-sm">Vehicle</p>
<p className="font-bold text-lg">{`${vehicle.model} (${vehicle.color})`}</p>
</div>
</div>
<div className="flex items-center space-x-4">
<Shield size={24} className="text-indigo-400" />
<div>
<p className="text-gray-400 text-sm">License Plate</p>
<p className="font-bold text-lg">{vehicle.licensePlate}</p>
</div>
</div>
<div className="border-t border-gray-700 my-2" />
<div className="flex justify-between items-center text-lg">
<p className="text-gray-400">Estimated Fare:</p>
<p className="font-bold text-white">${estimatedFare}</p>
</div>
</div>
<button onClick={resetRide} className="w-full h-14 mt-4 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition">Cancel Ride</button>
</div>
);
}


export default UserConfirmedPanel;