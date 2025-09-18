// File: src/components/dashboard/UserBookingPanel.jsx
import React from 'react';
import { MapPin, LoaderCircle, LocateFixed } from 'lucide-react';


const UserBookingPanel = React.memo((props) => {
const {
rideError,
pickupLocation,
setPickupLocation,
dropoffLocation,
setDropoffLocation,
activeInput,
setActiveInput,
isGeocoding,
handleLocateMe,
suggestions,
handleSuggestionClick,
handleRequestRide,
isRideLoading,
suggestionsRef,
} = props;

return (
<div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
<h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Where to?</h2>
{rideError && (
<p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{rideError}</p>
)}


<div className="space-y-4 flex-grow" ref={suggestionsRef}>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<MapPin size={20} className="text-gray-400" />
</div>
<input
type="text"
placeholder="Pickup Location"
value={pickupLocation}
onChange={(e) => setPickupLocation(e.target.value)}
onFocus={() => setActiveInput('pickup')}
className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-12 pr-20 py-4 text-lg"
/>
<div className="absolute inset-y-0 right-0 flex items-center pr-4">
{isGeocoding.pickup ? (
<LoaderCircle size={20} className="animate-spin text-gray-400" />
) : (
<button onClick={handleLocateMe} className="text-indigo-400" title="Use my current location">
<LocateFixed size={20} />
</button>
)}
</div>
{activeInput === 'pickup' && suggestions.length > 0 && (
<div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
{suggestions.map((s) => (
<div key={s.place_id} onClick={() => handleSuggestionClick(s)} className="p-3 text-sm hover:bg-indigo-600/20 cursor-pointer border-b border-gray-700 last:border-b-0 truncate">
{s.display_name}
</div>
))}
</div>
)}
</div>

<div className="relative">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<MapPin size={20} className="text-gray-400" />
</div>
<input
type="text"
placeholder="Drop-off Location"
value={dropoffLocation}
onChange={(e) => setDropoffLocation(e.target.value)}
onFocus={() => setActiveInput('dropoff')}
className="w-full bg-gray-700/50 border-gray-600 rounded-lg pl-12 pr-12 py-4 text-lg"
/>
<div className="absolute inset-y-0 right-0 flex items-center pr-4">
{isGeocoding.dropoff && (
<LoaderCircle size={20} className="animate-spin text-gray-400" />
)}
</div>
{activeInput === 'dropoff' && suggestions.length > 0 && (
<div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
{suggestions.map((s) => (
<div key={s.place_id} onClick={() => handleSuggestionClick(s)} className="p-3 text-sm hover:bg-indigo-600/20 cursor-pointer border-b border-gray-700 last:border-b-0 truncate">
{s.display_name}
</div>
))}
</div>
)}
</div>
</div>


<button onClick={handleRequestRide} disabled={isRideLoading} className="w-full h-16 mt-4 flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 disabled:bg-indigo-400">
{isRideLoading ? <LoaderCircle className="animate-spin" /> : 'Find a Ride'}
</button>
</div>
);
});


export default UserBookingPanel;