import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCar,
  FaUsers,
  FaWeight,
  FaSort,
} from "react-icons/fa" ;
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./VehicleSearch.css";
import api from "../../services/api";


// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationInput = ({
  value,
  onChange,
  onSelectLocation,
  placeholder,
  label,
  required,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search failed:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="input-group">
      <div className="input-icon">
        <FaMapMarkerAlt />
      </div>
      <div className="search-container">
        <input
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          required={required}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item) => (
              <li
                key={item.place_id}
                onClick={() => {
                  onChange(item.display_name);
                  onSelectLocation({
                    address: item.display_name,
                    coordinates: {
                      lat: parseFloat(item.lat),
                      lng: parseFloat(item.lon),
                    },
                  });
                  setShowSuggestions(false);
                }}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <label className="floating-label">{label}</label>
    </div>
  );
};

const MapModal = ({ isOpen, onClose, onSelectLocation, initialLocation }) => {
  const [marker, setMarker] = useState(initialLocation);
  const defaultCenter = [20.5937, 78.9629]; // India's center

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
      },
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="map-modal">
      <div className="map-container">
        <MapContainer
          center={
            initialLocation
              ? [initialLocation.lat, initialLocation.lng]
              : defaultCenter
          }
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents />
          {marker && <Marker position={[marker.lat, marker.lng]} />}
        </MapContainer>
        <div className="map-controls">
          <button
            className="map-button confirm"
            onClick={() => marker && onSelectLocation(marker)}
          >
            Confirm Location
          </button>
          <button className="map-button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleSearch = () => {
  // ... your existing state variables ...
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);
  const [bookingType, setBookingType] = useState("instant");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("car");
  const [passengerCapacity, setPassengerCapacity] = useState(1);
  const [loadCapacity, setLoadCapacity] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [locations, setLocations] = useState({
    pickup: { address: "", coordinates: null },
    drop: { address: "", coordinates: null },
  });
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
  });
  const [vehicles,setVehicles] = useState([]);

  const token = localStorage.getItem("token");
  // Add this function inside VehicleSearch component
  const calculateRouteDistance = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const distanceInKm = (data.routes[0].distance / 1000).toFixed(2);
        const durationInMinutes = Math.round(data.routes[0].duration / 60);
        setRouteInfo({
          distance: distanceInKm,
          duration: durationInMinutes,
        });
        return distanceInKm;
      }
      return null;
    } catch (error) {
      console.error("Failed to calculate route:", error);
      return null;
    }
  };

  const handleLocationSelect = async (type, location) => {
    if (type === "pickup") {
      setPickup(location.address);
      setLocations((prev) => ({
        ...prev,
        pickup: location,
      }));

        if (locations.drop.coordinates) {
      await calculateRouteDistance(location.coordinates, locations.drop.coordinates);
    }

    } else {
      setDrop(location.address);
      setLocations((prev) => ({
        ...prev,
        drop: location,
      }));
       if (locations.pickup.coordinates) {
      await calculateRouteDistance(locations.pickup.coordinates, location.coordinates);
    }
    }
  };

  const handleMapSelect = async (coordinates) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
      );
      const data = await response.json();
      handleLocationSelect(activeLocation, {
        address: data.display_name,
        coordinates,
      });
      setShowMap(false);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handleSearch = async () => {
    if (!locations.pickup.coordinates) {
      alert("Please select a pickup location");
      return;
    }

    setIsSearching(true);
    try {
      const searchParams = {
        pickup: locations.pickup,
        drop: locations.drop,
        bookingType,
        date: bookingType === "scheduled" ? date : null,
        vehicleCategory,
        passengerCapacity: parseInt(passengerCapacity) || 1,
        loadCapacity: loadCapacity ? parseInt(loadCapacity) : null,
        sortBy,
        distance: routeInfo.distance,
        searchRadius: 10, // Radius in kilometers
      };

      console.log("Search Params:", searchParams);

      const response = await api.search_vehicles(searchParams, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.data) {
        setVehicles(response.data.data);
        navigate("/search-results", {
          state: {
            vehicles: response.data.data,
            searchParams,
            routeInfo,
          },
        });
      } else {
        throw new Error("No vehicles data received");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to search vehicles. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="vehicle-search-container">
      <h2 className="vehicle-search-title">Find Your Perfect Ride</h2>
      <div className="search-form">
        <div className="location-input-group">
          <h6 className="drop">pickup loaction</h6>
          <LocationInput
            value={pickup}
            onChange={setPickup}
            onSelectLocation={(location) =>
              handleLocationSelect("pickup", location)
            }
            placeholder="Enter pickup location"
            required={true}
          />
          <button
            className="map-select-button"
            onClick={() => {
              setActiveLocation("pickup");
              setShowMap(true);
            }}
          >
            Select on Map
          </button>
        </div>

        <div className="location-input-group">
          <h6 className="drop">drop loaction</h6>
          <LocationInput
            value={drop}
            onChange={setDrop}
            onSelectLocation={(location) =>
              handleLocationSelect("drop", location)
            }
            placeholder="Enter drop location (optional)"
            required={false}
          />
          <button
            className="map-select-button"
            onClick={() => {
              setActiveLocation("drop");
              setShowMap(true);
            }}
          >
            Select on Map
          </button>
        </div>

        <div className="booking-type-group">
          <label className="booking-type-label">Booking Type</label>
          <div className="booking-type-options">
            <label className="booking-option">
              <input
                type="radio"
                value="instant"
                checked={bookingType === "instant"}
                onChange={() => setBookingType("instant")}
              />
              <span className="radio-label">Instant Booking</span>
            </label>
            <label className="booking-option">
              <input
                type="radio"
                value="scheduled"
                checked={bookingType === "scheduled"}
                onChange={() => setBookingType("scheduled")}
              />
              <span className="radio-label">Scheduled Booking</span>
            </label>
          </div>
        </div>

        {bookingType === "scheduled" && (
          <div className="input-group date-picker-group">
            <div className="input-icon">
              <FaCalendarAlt />
            </div>
            <input
              type="datetime-local"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            <label className="floating-label">Schedule Date & Time</label>
          </div>
        )}

        <div className="filters-section">
          <div className="filter-group">
            <div className="input-icon">
              <FaCar />
            </div>
            <select
              className="select-field"
              value={vehicleCategory}
              onChange={(e) => setVehicleCategory(e.target.value)}
            >
              <option value="car">Car</option>
              <option value="traveler">Traveler</option>
              <option value="truck">Truck</option>
              <option value="mini-truck">Mini-Truck</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="input-icon">
              <FaUsers />
            </div>
            <input
              type="number"
              className="input-field"
              placeholder="Passengers"
              min="1"
              max="10"
              value={passengerCapacity}
              onChange={(e) => setPassengerCapacity(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="input-icon">
              <FaWeight />
            </div>
            <input
              type="number"
              className="input-field"
              placeholder="Load Capacity (kg)"
              value={loadCapacity}
              onChange={(e) => setLoadCapacity(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="input-icon">
              <FaSort />
            </div>
            <select
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price">Lowest Price</option>
              <option value="distance">Closest to Pickup</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={handleSearch}
            className={`search-button ${isSearching ? "loading" : ""}`}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search Vehicles"}
          </button>
          <button onClick={() => navigate("/")} className="cancel-button">
            Cancel
          </button>
        </div>

        <MapModal
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          onSelectLocation={handleMapSelect}
          initialLocation={locations[activeLocation]?.coordinates}
        />
      </div>
    </div>
  );
};

export default VehicleSearch;
