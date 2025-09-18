// File: src/pages/DashboardPanelPage.jsx
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PanelRenderer from '../components/dashboard/PanelRenderer.jsx';


const DashboardPanelPage = () => {
const ctx = useOutletContext();
const navigate = useNavigate();


return (
<div className="h-full">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-bold">Panel</h2>
<div>
<button onClick={() => navigate(-1)} className="mr-2 px-3 py-1 rounded bg-gray-800">Back</button>
</div>
</div>
<div className="h-[calc(100vh-160px)]">
<PanelRenderer {...ctx} fullHeight />
</div>
</div>
);
};


export default DashboardPanelPage;