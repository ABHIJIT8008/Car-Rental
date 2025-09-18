// File Path: frontend/src/components/dashboard/UserStatusPanels.jsx

import React from 'react';
import { Car, User, CarFront, Shield, Clock } from 'lucide-react';

export const UserSearchingPanel = React.memo(() => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center items-center text-center border border-gray-700">
        <div className="relative flex justify-center items-center h-24 w-24 mb-6">
            <div className="absolute h-full w-full bg-indigo-500/20 rounded-full animate-ping"></div>
            <Car size={40} className="text-indigo-300" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Finding Your Ride...</h2>
        <p className="text-gray-400 max-w-xs">Connecting you with a nearby driver.</p>
    </div>
));

export const UserConfirmedPanel = React.memo(({ resetRide }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Driver Confirmed!</h2>
        <p className="text-gray-400 mb-6">Your driver is on the way.</p>
        <div className="bg-gray-900/50 p-6 rounded-xl space-y-5 flex-grow">
            <div className="flex items-center space-x-4"><User size={24} className="text-indigo-400" /><div><p className="text-gray-400 text-sm">Driver</p><p className="font-bold text-lg">John D.</p></div></div>
            <div className="flex items-center space-x-4"><CarFront size={24} className="text-indigo-400" /><div><p className="text-gray-400 text-sm">Vehicle</p><p className="font-bold text-lg">Toyota Camry (White)</p></div></div>
            <div className="flex items-center space-x-4"><Shield size={24} className="text-indigo-400" /><div><p className="text-gray-400 text-sm">License Plate</p><p className="font-bold text-lg">NYC-1234</p></div></div>
            <div className="flex items-center space-x-4"><Clock size={24} className="text-indigo-400" /><div><p className="text-gray-400 text-sm">Estimated Arrival</p><p className="font-bold text-lg">5 minutes</p></div></div>
        </div>
        <button onClick={resetRide} className="w-full h-14 mt-4 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition">Cancel Ride</button>
    </div>
));

