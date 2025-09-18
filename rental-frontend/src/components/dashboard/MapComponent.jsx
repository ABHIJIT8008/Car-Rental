// File: src/components/dashboard/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LoaderCircle } from 'lucide-react';


const MapComponent = ({ pickup, dropoff }) => {
const containerRef = useRef(null);
const mapRef = useRef(null);
const pickupMarkerRef = useRef(null);
const dropoffMarkerRef = useRef(null);
const routeLayerRef = useRef(null);


useEffect(() => {
if (!containerRef.current) return;


if (!mapRef.current) {
mapRef.current = L.map(containerRef.current, {
center: [22.75, 75.88],
zoom: 13,
preferCanvas: true,
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; OpenStreetMap contributors',
}).addTo(mapRef.current);
}


return () => {
if (mapRef.current) {
mapRef.current.remove();
mapRef.current = null;
}
};
}, []);

useEffect(() => {
if (!mapRef.current) return;
if (!pickup?.coordinates || !dropoff?.coordinates) {
const map = mapRef.current;
if (pickupMarkerRef.current) {
try { map.removeLayer(pickupMarkerRef.current); } catch(e) {}
pickupMarkerRef.current = null;
}
if (dropoffMarkerRef.current) {
try { map.removeLayer(dropoffMarkerRef.current); } catch(e) {}
dropoffMarkerRef.current = null;
}
if (routeLayerRef.current) {
try { map.removeLayer(routeLayerRef.current); } catch(e) {}
routeLayerRef.current = null;
}
return;
}

const map = mapRef.current;


if (pickupMarkerRef.current) {
try { map.removeLayer(pickupMarkerRef.current); } catch(e) {}
pickupMarkerRef.current = null;
}
if (dropoffMarkerRef.current) {
try { map.removeLayer(dropoffMarkerRef.current); } catch(e) {}
dropoffMarkerRef.current = null;
}


const [pickLon, pickLat] = pickup.coordinates;
const [dropLon, dropLat] = dropoff.coordinates;

pickupMarkerRef.current = L.marker([pickLat, pickLon]).addTo(map).bindPopup('📍 Pickup Location');
dropoffMarkerRef.current = L.marker([dropLat, dropLon]).addTo(map).bindPopup('🏁 Drop-off Location');


const fetchRoute = async () => {
try {
const res = await fetch(
`https://router.project-osrm.org/route/v1/driving/${pickLon},${pickLat};${dropLon},${dropLat}?overview=full&geometries=geojson`
);
const json = await res.json();
if (json.routes?.[0]) {
const coords = json.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);


if (routeLayerRef.current) {
try { map.removeLayer(routeLayerRef.current); } catch(e) {}
}


routeLayerRef.current = L.polyline(coords, { weight: 5, opacity: 0.75 }).addTo(map);


const bounds = L.latLngBounds(coords);
map.fitBounds(bounds, { padding: [50, 50] });
}
} catch (err) {
console.error('Failed to fetch route:', err);
}
};

fetchRoute();
}, [pickup, dropoff]);


if (!pickup?.coordinates || !dropoff?.coordinates) {
return (
<div className="bg-gray-800 rounded-2xl w-full h-full flex items-center justify-center relative overflow-hidden border border-gray-700">
<LoaderCircle size={36} className="animate-spin text-gray-400" />
</div>
);
}


return (
<div ref={containerRef} className="w-full h-full rounded-2xl border border-gray-700" style={{ minHeight: 300 }} />
);
};


export default MapComponent;