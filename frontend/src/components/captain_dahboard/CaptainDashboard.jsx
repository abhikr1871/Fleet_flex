import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CaptainDashboard.css";
import { useAuthContext } from "../../context/AuthContext";
import VehicleCard from "./VehicleCard";
import AddVehicleForm from "./AddVehicleForm";

const CaptainDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, authLoading } = useAuthContext();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    capacity: "",
    perKmRate: "",
    numberplate: "",
    type: "", // New parameter if needed in the future
  });

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  const username = user?.name || "Captain";

  // Redirect to home if not authenticated (only after auth state is determined)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch vehicles whenever token changes
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.getCaptainVehicles({
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    // Only fetch if token exists (and thus user is expected to be authenticated)
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  // Handle "Go Live" action on a vehicle (for non-live vehicles)
  const handleGoLive = async (vehicleId) => {
    try {
      await api.updateVehicleStatus(
        vehicleId,
        { isLive: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch vehicles after updating status
      const response = await api.getCaptainVehicles({
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(response.data.data);
      alert(`Vehicle ${vehicleId} is now live!`);
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      alert("Failed to update vehicle status");
    }
  };

  // Handle "Go Offline" action on a vehicle (for live vehicles)
  const handleGoOffline = async (vehicleId) => {
    try {
      await api.updateVehicleStatus(
        vehicleId,
        { isLive: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch vehicles after updating status
      const response = await api.getCaptainVehicles({
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(response.data.data);
      alert(`Vehicle ${vehicleId} is now offline!`);
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      alert("Failed to update vehicle status");
    }
  };

  // Handle input changes for the vehicle form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addCaptainVehicle(vehicleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 1) {
        alert("Vehicle added successfully!");
        // Re-fetch vehicles after adding
        const resp = await api.getCaptainVehicles({
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(resp.data.data);
        setShowForm(false);
        setVehicleData({
          name: "",
          model: "",
          capacity: "",
          perKmRate: "",
          numberplate: "",
          type: "",
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  // Split vehicles into live and non-live arrays
  const liveVehicles = vehicles.filter((v) => v.isLive);
  const nonLiveVehicles = vehicles.filter((v) => !v.isLive);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Hi, {username}</h2>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Live Vehicles Section */}
      <h3>Live Vehicles</h3>
      <div className="vehicles-list">
        {liveVehicles.length > 0 ? (
          liveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoOffline={handleGoOffline} // Pass the offline handler for live vehicles
            />
          ))
        ) : (
          <p>No live vehicles.</p>
        )}
      </div>

      {/* Divider Line */}
      <hr className="divider" />

      {/* Non-Live Vehicles Section */}
      <h3>Non-Live Vehicles</h3>
      <div className="vehicles-list">
        {nonLiveVehicles.length > 0 ? (
          nonLiveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoLive={handleGoLive} // Pass the live handler for non-live vehicles
            />
          ))
        ) : (
          <p>No non-live vehicles.</p>
        )}
      </div>

      {/* Add Vehicle Section */}
      <button
        className="add-vehicle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        Add Vehicle
      </button>

      {showForm && (
        <AddVehicleForm
          handleAddVehicle={handleAddVehicle}
          handleInputChange={handleInputChange}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
};

export default CaptainDashboard;
