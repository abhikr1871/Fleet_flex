
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaUsers, FaWeight, FaSort } from "react-icons/fa";
import "./VehicleSearch.css";

const VehicleSearch = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [bookingType, setBookingType] = useState("instant");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("car");
  const [passengerCapacity, setPassengerCapacity] = useState(1);
  const [loadCapacity, setLoadCapacity] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = async () => {
    if (!pickup) {
      alert("Please enter pickup location");
      return;
    }
    
    setIsSearching(true);
    try {
      const searchParams = {
        pickup,
        drop,
        bookingType,
        date: bookingType === "scheduled" ? date : null,
        vehicleCategory,
        passengerCapacity,
        loadCapacity,
        sortBy,
      };
      console.log("Searching with params:", searchParams);
      // Add API call here
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="vehicle-search-container">
      <h2 className="vehicle-search-title">Find Your Perfect Ride</h2>
      <div className="search-form">
        <div className="input-group">
          <div className="input-icon">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            className="input-field"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
          />
          <label className="floating-label">Pickup Location</label>
        </div>

        <div className="input-group">
          <div className="input-icon">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            className="input-field"
            placeholder="Enter drop location (optional)"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          />
          <label className="floating-label">Drop Location</label>
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
            className={`search-button ${isSearching ? 'loading' : ''}`}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Vehicles'}
          </button>
          <button onClick={() => navigate('/')} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearch;