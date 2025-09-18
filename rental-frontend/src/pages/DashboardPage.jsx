// File: src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import useDebounce from "../hooks/useDebounce";

const DashboardPage = ({ user, handleLogout, api }) => {
  // --- state (kept same as original) ---
  const [rideStatus, setRideStatus] = useState("idle");
  const [rideError, setRideError] = useState("");
  const [isRideLoading, setIsRideLoading] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [isDriverDataLoading, setIsDriverDataLoading] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);
  const [confirmedRideDetails, setConfirmedRideDetails] = useState(null);
  const [confirmedRide, setConfirmedRide] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [activeDriverRide, setActiveDriverRide] = useState(null);

  // booking inputs
  const [pickupLocation, setPickupLocation] = useState("Vijay Nagar, Indore");
  const [pickupCoords, setPickupCoords] = useState({
    type: "Point",
    coordinates: [75.8937, 22.7533],
  });
  const [dropoffLocation, setDropoffLocation] = useState("Rajwada Palace, Indore");
  const [dropoffCoords, setDropoffCoords] = useState({
    type: "Point",
    coordinates: [75.8577, 22.7177],
  });

  const [isGeocoding, setIsGeocoding] = useState({ pickup: false, dropoff: false });
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const suggestionsRef = useRef(null);

  const debouncedPickup = useDebounce(pickupLocation, 800);
  const debouncedDropoff = useDebounce(dropoffLocation, 800);

  /* ---------- Suggestions (Nominatim) ---------- */
  const fetchSuggestions = useCallback(async (query, type) => {
    if (!query || query.length < 3 || query === "My Current Location") {
      setSuggestions([]);
      return;
    }
    setIsGeocoding((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
      setActiveInput(type);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    } finally {
      setIsGeocoding((prev) => ({ ...prev, [type]: false }));
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedPickup, "pickup");
  }, [debouncedPickup, fetchSuggestions]);
  useEffect(() => {
    fetchSuggestions(debouncedDropoff, "dropoff");
  }, [debouncedDropoff, fetchSuggestions]);

  /* ---------- Polling while searching (keeps original behaviour) ---------- */
  useEffect(() => {
    if (rideStatus !== "searching" || !currentRideId) return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const res = await api(`/rides/${currentRideId}/status`);
        if (!res?.success || cancelled) return;

        const ride = res.ride;

        if (ride.status === "accepted" && ride.driverId) {
          setConfirmedRideDetails(ride);
          setRideStatus("confirmed");
        } else if (ride.status === "cancelled") {
          resetRide();
        }
      } catch (err) {
        console.error("Polling ride error:", err);
        if (err.message.includes("not found")) {
          resetRide();
        }
      }
    };

    const intervalId = setInterval(pollStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [rideStatus, currentRideId, api]);

  const handleSuggestionClick = (s) => {
    const coords = { type: "Point", coordinates: [parseFloat(s.lon), parseFloat(s.lat)] };
    if (activeInput === "pickup") {
      setPickupLocation(s.display_name);
      setPickupCoords(coords);
    } else {
      setDropoffLocation(s.display_name);
      setDropoffCoords(coords);
    }
    setSuggestions([]);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setRideError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPickupLocation("My Current Location");
        setPickupCoords({ type: "Point", coordinates: [longitude, latitude] });
        setRideError("");
      },
      () => setRideError("Could not get your location. Please enable location services.")
    );
  };

  /* ---------- Request a ride ---------- */
  const handleRequestRide = async () => {
    setIsRideLoading(true);
    setRideError("");
    try {
      const pickupData = { address: pickupLocation, ...pickupCoords };
      const dropoffData = { address: dropoffLocation, ...dropoffCoords };
      const data = await api("/rides/request", {
        method: "POST",
        body: JSON.stringify({ pickupLocation: pickupData, dropoffLocation: dropoffData }),
      });
      if (data.success) {
        setCurrentRideId(data.ride._id);
        setRideStatus("searching");
      }
    } catch (err) {
      setRideError(err.message || "Failed to request ride.");
    } finally {
      setIsRideLoading(false);
    }
  };

  /* ---------- Poll ride details while searching (backup) ---------- */
  useEffect(() => {
    if (rideStatus !== "searching" || !currentRideId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await api(`/rides/${currentRideId}/status`);
        if (!res?.success) return;
        const ride = res.ride;
        if (cancelled) return;

        if (ride.status === "accepted" && ride.driverId) {
          setConfirmedRideDetails(ride);
          setRideStatus("confirmed");
        } else if (ride.status === "cancelled" || ride.status === "failed") {
          resetRide();
        }
      } catch (err) {
        console.error("Polling ride error:", err);
      }
    };

    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [rideStatus, currentRideId, api]);

  const resetRide = async () => {
    if (currentRideId) {
      try {
        await api(`/rides/${currentRideId}`, { method: "DELETE" });
      } catch (error) {
        console.error("Failed to cancel ride:", error);
      }
    }
    setRideStatus("idle");
    setRideError("");
    setCurrentRideId(null);
    setConfirmedRideDetails(null);
  };

  /* ---------- Driver side fetching ---------- */
  const fetchPendingRides = useCallback(async () => {
    setIsDriverDataLoading(true);
    try {
      const res = await api("/rides/pending");
      if (res?.success) setPendingRides(res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending rides:", err);
    } finally {
      setIsDriverDataLoading(false);
    }
  }, [api]);

  useEffect(() => {
    let intervalId;

    const fetchNearbyDrivers = async () => {
      if (!pickupCoords?.coordinates) return;
      try {
        const res = await api(
          `/rides/nearby?lat=${pickupCoords.coordinates[1]}&lng=${pickupCoords.coordinates[0]}`
        );
        if (res?.success) setNearbyDrivers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch nearby drivers:", err);
      }
    };

    const startDriverPolling = async () => {
      setIsProfileLoading(true);
      try {
        const prof = await api("/driver/profile/me");
        if (prof?.success) setDriverProfile(prof.data);
        if (prof?.data?.vehicleDetails?.model) {
          await fetchPendingRides();
          intervalId = setInterval(fetchPendingRides, 7000);
        }
      } catch (err) {
        console.error("Failed to load driver profile:", err);
        setRideError("Could not load driver profile.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (user.role === "user" && rideStatus === "idle") {
      fetchNearbyDrivers();
      intervalId = setInterval(fetchNearbyDrivers, 10000);
    } else if (user.role === "driver" && !activeDriverRide) {
      startDriverPolling();
    }

    return () => clearInterval(intervalId);
  }, [user.role, rideStatus, api, pickupCoords, fetchPendingRides, activeDriverRide]);

  const handleAcceptRide = async (rideId) => {
    try {
      const data = await api(`/rides/accept/${rideId}`, { method: "PATCH" });
      if (data.success) {
        setActiveDriverRide(data.data);
        setPendingRides([]);
      }
    } catch (err) {
      alert("Failed to accept ride: " + (err.message || err));
    }
  };

  // map coords chosen by priority
  const mapPickup =
    activeDriverRide?.pickupLocation ?? confirmedRide?.pickupLocation ?? pickupCoords;
  const mapDropoff =
    activeDriverRide?.dropoffLocation ?? confirmedRide?.dropoffLocation ?? dropoffCoords;

  // expose state + helpers to nested routes via Outlet context
  const outletContext = {
    user,
    api,
    handleLogout,
    // ride state
    rideStatus,
    setRideStatus,
    rideError,
    setRideError,
    isRideLoading,
    setIsRideLoading,
    nearbyDrivers,
    pendingRides,
    isDriverDataLoading,
    currentRideId,
    confirmedRideDetails,
    confirmedRide,
    driverProfile,
    isProfileLoading,
    activeDriverRide,
    setActiveDriverRide,
    // booking inputs
    pickupLocation,
    setPickupLocation,
    pickupCoords,
    setPickupCoords,
    dropoffLocation,
    setDropoffLocation,
    dropoffCoords,
    setDropoffCoords,
    isGeocoding,
    setIsGeocoding,
    suggestions,
    setSuggestions,
    activeInput,
    setActiveInput,
    suggestionsRef,
    debouncedPickup,
    debouncedDropoff,
    // helpers
    fetchSuggestions,
    handleSuggestionClick,
    handleLocateMe,
    handleRequestRide,
    resetRide,
    fetchPendingRides,
    handleAcceptRide,
    mapPickup,
    mapDropoff,
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Car size={28} />
          <h1 className="ml-3 text-2xl font-bold tracking-tight">RideLink</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/panel')} className="px-3 py-1 rounded hover:bg-gray-800">Panel</button>
          <button onClick={() => navigate('/dashboard/map')} className="px-3 py-1 rounded hover:bg-gray-800">Map</button>
          <span className="text-gray-300 capitalize">Welcome, {user.name}! ({user.role})</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition">Logout</button>
        </div>
      </header>

      {/* Outlet receives the full application state via context */}
      <main className="p-8" style={{ height: 'calc(100vh - 88px)' }}>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default DashboardPage;
