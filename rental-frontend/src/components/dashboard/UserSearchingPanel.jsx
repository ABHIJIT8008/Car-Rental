// File: src/components/dashboard/UserSearchingPanel.jsx
import React from 'react';
import { Car } from 'lucide-react';


const UserSearchingPanel = React.memo(() => (
<div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center items-center text-center border border-gray-700">
<div className="relative flex justify-center items-center h-24 w-24 mb-6">
<div className="absolute h-full w-full bg-indigo-500/20 rounded-full animate-ping" />
<Car size={40} className="text-indigo-300" />
</div>
<h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Finding Your Ride...</h2>
<p className="text-gray-400 max-w-xs">Connecting you with a nearby driver.</p>
</div>
));


export default UserSearchingPanel;