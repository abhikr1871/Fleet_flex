import React, { useState, useEffect } from "react";
import "./Main_home.css";
import { useAuthContext } from "../../context/AuthContext"; // Import useAuthContext
 import { useNavigate } from "react-router-dom";

function Main_home() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, logout } = useAuthContext(); // Access logout function from context

  const token = localStorage.getItem("token");
  
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    purpose: "",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    vehicleType: "",
    capacity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search Data: ", formData);
  };

  return (
    <div className="main-home">
      {/* Header Section */}
      <header className="header">
        <button onClick={logout} className="homebutton">
          Logout
        </button>
        <div className="logo">FleetFlex</div>
        <div className="header-buttons">
          <button className="home-btn">Home</button>
          <button className="rides-btn">Your Rides</button>
          <img
            src="https://via.placeholder.com/40" // Replace with profile image URL
            alt="Profile"
            className="profile-image"
          />
        </div>
      </header>

      {/* Content Section */}
      <div className="content">
        {/* Search Section */}
        <div className="search-section">
          <h2>Book a Vehicle</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="purpose">Purpose of Booking</label>
              <select
                name="purpose"
                id="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <option value="">Select Purpose</option>
                <option value="passengerTransport">Passenger Transport</option>
                <option value="goodsDelivery">Goods Delivery</option>
                <option value="houseShifting">House Shifting</option>
                <option value="eventTransport">Event Transport</option>
                <option value="dailyCommute">Daily Commute</option>
                <option value="longDistance">Long-Distance Travel</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pickupLocation">Pickup Location</label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pickupDate">Pickup Date</label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pickupTime">Pickup Time</label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select
                name="vehicleType"
                id="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="tempo">Tempo</option>
                <option value="miniTruck">Mini Truck</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter capacity (kg)"
                required
              />
            </div>

            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="image-section">
          <img
            src="https://via.placeholder.com/500" // Replace with your image URL
            alt="FleetFlex Banner"
            className="banner-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Main_home;
