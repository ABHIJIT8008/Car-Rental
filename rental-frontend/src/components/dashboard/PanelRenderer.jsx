// File: src/components/dashboard/PanelRenderer.jsx
import UserBookingPanel from './UserBookingPanel.jsx';
import UserSearchingPanel from './UserSearchingPanel.jsx';
import UserConfirmedPanel from './UserConfirmedPanel.jsx';
import { LoaderCircle } from 'lucide-react';
import { DriverDashboardPanel, DriverOnboardingPanel } from './DriverPanels.jsx';


const PanelRenderer = (props) => {
const {
user,
rideStatus,
isProfileLoading,
driverProfile,
activeDriverRide,
pendingRides,
isDriverDataLoading,
handleAcceptRide,
// booking props forwarded to UserBookingPanel
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
resetRide,
confirmedRideDetails,
} = props;


// driver UI
if (user.role === 'driver') {
if (isProfileLoading) return (
<div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin" size={48} /></div>
);
if (!driverProfile?.vehicleDetails?.model) {
return <DriverOnboardingPanel api={props.api} setDriverProfile={props.setDriverProfile} />;
}
if (activeDriverRide) {
const user_ = activeDriverRide.userId;
const pickup = activeDriverRide.pickupLocation;
const dropoff = activeDriverRide.dropoffLocation;

return (
<div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
<h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Active Ride</h2>
<p className="text-gray-400 mb-6">A new ride has been assigned to you.</p>
<div className="bg-green-900/50 p-6 rounded-xl space-y-4 flex-grow">
<div className="flex items-center space-x-4">
<div>
<p className="text-gray-400 text-sm">Passenger Name</p>
<p className="font-bold text-lg">{user_?.name || 'A Customer'}</p>
</div>
</div>
<div className="border-t border-gray-700 my-2" />
<div className="flex items-start space-x-4">
<div>
<p className="text-gray-400 text-sm">Pickup Location</p>
<p className="font-semibold text-base">{pickup?.address || "Customer's Location"}</p>
</div>
</div>
<div className="flex items-start space-x-4">
<div>
<p className="text-gray-400 text-sm">Drop-off Location</p>
<p className="font-semibold text-base">{dropoff?.address || 'Destination'}</p>
</div>
</div>
<div className="border-t border-gray-700 my-2" />
<div className="flex justify-between items-center text-lg">
<p className="text-gray-400">Estimated Fare:</p>
<p className="font-bold text-white">${activeDriverRide.estimatedFare}</p>
</div>
</div>
<button onClick={() => props.setActiveDriverRide(null)} className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition">Complete Ride (dev)</button>
</div>
);
}

return (
<DriverDashboardPanel pendingRides={pendingRides} isDriverDataLoading={isDriverDataLoading} handleAcceptRide={handleAcceptRide} />
);
}

// user UI
switch (rideStatus) {
case 'searching':
return <UserSearchingPanel />;
case 'confirmed':
return <UserConfirmedPanel resetRide={resetRide} confirmedRideDetails={confirmedRideDetails} />;
default:
return (
<UserBookingPanel
rideError={rideError}
pickupLocation={pickupLocation}
setPickupLocation={setPickupLocation}
dropoffLocation={dropoffLocation}
setDropoffLocation={setDropoffLocation}
activeInput={activeInput}
setActiveInput={setActiveInput}
isGeocoding={isGeocoding}
handleLocateMe={handleLocateMe}
suggestions={suggestions}
handleSuggestionClick={handleSuggestionClick}
handleRequestRide={handleRequestRide}
isRideLoading={isRideLoading}
suggestionsRef={suggestionsRef}
/>
);
}
};


export default PanelRenderer;