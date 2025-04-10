import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = location.state?.searchParams || {};

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await api.search_vehicles(searchParams);
        if (response.data && response.data.data) {
          setVehicles(response.data.data);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  if (loading) {
    return <div className="search-results-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="search-results-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Search
        </button>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="search-results-container">
        <h2>No Vehicles Found</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-summary-bar">
  <div className="search-field">
    <label>Pickup</label>
    <input type="text" value={searchParams.pickup?.address || ""} readOnly />
  </div>
  <div className="arrow-icon">⇄</div>
  <div className="search-field">
    <label>Drop</label>
    <input type="text" value={searchParams.drop?.address || ""} readOnly />
  </div>
  <div className="search-field">
    <label>Distance</label>
    <input type="text" value={`${searchParams.distance || 0} km`} readOnly />
  </div>
  <button className="modify-button" onClick={() => navigate("/VehicleSearch")}>Modify Search</button>
</div>

      <div className="vehicle-list">
  {vehicles.map((vehicle) => {
    const distance = parseFloat(searchParams.distance || 0); // Ensure distance is a number
    const totalPrice = distance * vehicle.perKmRate; // Calculate total price

    return (
      <div key={vehicle._id} className="vehicle-card">
        <img src={vehicle.photo} alt={vehicle.name} className="vehicle-image" />
        <h3>{vehicle.name}</h3>
        <p>Model: {vehicle.model}</p>
        <p>Capacity: {vehicle.capacity} passengers</p>
        <p>Rate: ₹{vehicle.perKmRate} per km</p>
        <p>Type: {vehicle.type}</p>
        <p>Total Price: <strong>₹{totalPrice.toFixed(2)}</strong></p> {/* Make total price bold */}
        <button className="book-button">Book Now</button>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default SearchResults;