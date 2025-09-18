// File: src/pages/DashboardHome.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PanelRenderer from '../components/dashboard/PanelRenderer.jsx';
import MapComponent from '../components/dashboard/MapComponent.jsx';


const DashboardHome = () => {
const ctx = useOutletContext();


return (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ height: 'calc(100vh - 88px)' }}>
<div className="lg:col-span-1 h-full">
<PanelRenderer {...ctx} />
</div>
<div className="lg:col-span-2 h-full">
<MapComponent pickup={ctx.mapPickup} dropoff={ctx.mapDropoff} />
</div>
</div>
);
};


export default DashboardHome;