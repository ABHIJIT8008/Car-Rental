// File Path: frontend/src/components/dashboard/DriverPanels.jsx

import React, { useState } from "react";
import { Car, LoaderCircle, Hand, Save, LocateFixed,  } from "lucide-react";

export const DriverDashboardPanel = React.memo(
  ({ pendingRides, isDriverDataLoading, handleAcceptRide }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Ride Requests
        </h2>
        {isDriverDataLoading && (
          <LoaderCircle className="animate-spin text-gray-400" />
        )}
      </div>
      <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
        {pendingRides.length > 0 ? (
          pendingRides.map((ride) => (
            <div
              key={ride._id}
              className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">
                    {ride.userId?.name || "A User"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Fare Est: ${ride.estimatedFare}
                  </p>
                </div>
                <button
                  onClick={() => handleAcceptRide(ride._id)} // --- UPDATE THIS LINE ---
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center transition shadow-md hover:shadow-lg"
                >
                  <Hand size={18} className="mr-2" /> Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center text-center h-full">
            <Car size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400">You are online and available.</p>
            <p className="text-gray-500 text-sm mt-2">
              Waiting for new ride requests...
            </p>
          </div>
        )}
      </div>
    </div>
  )
);

export const DriverOnboardingPanel = React.memo(({ api, setDriverProfile }) => {
  const [formData, setFormData] = useState({
    vehicleModel: "",
    licensePlate: "",
    vehicleColor: "",
  });
  const [location, setLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSetInitialLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ type: "Point", coordinates: [longitude, latitude] });
          alert("Location captured! Please save your profile.");
        },
        () => alert("Could not get location. Please enable location services.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, initialLocation: location };
      const updatedProfile = await api("/driver/profile/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setDriverProfile(updatedProfile.data);
    } catch (error) {
      alert("Failed to save profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
      <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">
        Complete Your Profile
      </h2>
      <p className="text-gray-400 mb-6">
        Please provide your vehicle details to get started.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex-grow flex flex-col"
      >
        <div>
          <label className="text-sm font-medium text-gray-300">
            Vehicle Model
          </label>
          <input
            type="text"
            name="vehicleModel"
            required
            onChange={handleChange}
            className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded-lg p-3"
            placeholder="e.g., Maruti Swift"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300">
            License Plate
          </label>
          <input
            type="text"
            name="licensePlate"
            required
            onChange={handleChange}
            className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded-lg p-3"
            placeholder="e.g., MP09 AB 1234"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300">
            Vehicle Color
          </label>
          <input
            type="text"
            name="vehicleColor"
            required
            onChange={handleChange}
            className="w-full mt-1 bg-gray-700/50 border-gray-600 rounded-lg p-3"
            placeholder="e.g., White"
          />
        </div>
        <div className="flex-grow"></div>
        <button
          type="button"
          onClick={handleSetInitialLocation}
          className={`w-full h-14 flex justify-center items-center font-semibold py-2 px-4 rounded-lg transition ${
            location
              ? "bg-green-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <LocateFixed className="mr-2" />{" "}
          {location ? "Location Captured!" : "Set Initial Location"}
        </button>
        <button
          type="submit"
          disabled={isSaving || !location}
          className="w-full h-16 flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl py-2 px-4 rounded-lg transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Save className="mr-2" /> Save & Go Online
            </>
          )}
        </button>
      </form>
    </div>
  );
});

export const DriverActiveRidePanel = React.memo(({ activeRide }) => {
    const userName = activeRide.userId?.name || "Passenger";

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col border border-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">On a Trip</h2>
            <p className="text-gray-400 mb-6">Pickup for {userName}.</p>
            <div className="bg-green-900/50 p-6 rounded-xl space-y-5 flex-grow text-center flex flex-col justify-center">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <p className="text-lg font-semibold">Ride Accepted!</p>
                <p className="text-gray-300">Proceed to the pickup location.</p>
            </div>
        </div>
    );
});

export const DriverRideCancelledPanel = React.memo(({ onFindRides }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center items-center text-center border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Ride Cancelled</h2>
        <p className="text-gray-400 mb-6 max-w-xs">The user has cancelled the ride. You are now available for new requests.</p>
        <button 
            onClick={onFindRides}
            className="w-full h-16 mt-4 flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
        >
            <Search size={24} className="mr-2" />
            Find More Rides
        </button>
    </div>
));
