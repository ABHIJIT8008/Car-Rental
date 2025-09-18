// File Path: frontend/src/components/MapComponent.jsx

import React from 'react';
import { LoaderCircle } from 'lucide-react';

const MapComponent = ({ pickup, dropoff }) => {
    // A robust check to prevent the component from crashing if location data isn't ready.
    if (!pickup?.coordinates || !dropoff?.coordinates) {
        return (
            <div className="bg-gray-800 rounded-2xl w-full h-full flex items-center justify-center relative overflow-hidden border border-gray-700">
                <LoaderCircle className="animate-spin text-gray-500" />
            </div>
        );
    }

    // Dynamically construct the URL for the embedded OpenStreetMap.
    const lon1 = pickup.coordinates[0];
    const lat1 = pickup.coordinates[1];
    const lon2 = dropoff.coordinates[0];
    const lat2 = dropoff.coordinates[1];

    const bbox = [
        Math.min(lon1, lon2) - 0.02, Math.min(lat1, lat2) - 0.02,
        Math.max(lon1, lon2) + 0.02, Math.max(lat1, lat2) + 0.02
    ].join(',');

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat1},${lon1}&marker=${lat2},${lon2}`;

    return (
        <div className="bg-gray-800 rounded-2xl w-full h-full overflow-hidden border border-gray-700">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={mapUrl}
                title="Interactive Map"
                style={{ border: 'none' }}
                key={mapUrl} 
            ></iframe>
        </div>
    );
};

export default MapComponent;

