// File: src/pages/DashboardMapPage.jsx
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import MapComponent from '../components/dashboard/MapComponent.jsx';


const DashboardMapPage = () => {
const ctx = useOutletContext();
const navigate = useNavigate();


return (
<div className="h-full">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-bold">Map View</h2>
<div>
<button onClick={() => navigate(-1)} className="mr-2 px-3 py-1 rounded bg-gray-800">Back</button>
</div>
</div>
<div className="h-[calc(100vh-160px)]">
<MapComponent pickup={ctx.mapPickup} dropoff={ctx.mapDropoff} />
</div>
</div>
);
};


export default DashboardMapPage;