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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    capacity: "",
    perKmRate: "",
    numberplate: "",
    type: "",
    photo: null,
  });

  const token = localStorage.getItem("token");
  const username = user?.name || "Captain";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

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

    if (token) {
      fetchVehicles();
    }
  }, [token]);

  const handleGoLive = async (vehicleId) => {
    try {
      await api.updateVehicleStatus(
        vehicleId,
        { isLive: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  const handleGoOffline = async (vehicleId) => {
    try {
      await api.updateVehicleStatus(
        vehicleId,
        { isLive: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in vehicleData) {
      formData.append(key, vehicleData[key]);
    }

    try {
      const response = await api.addCaptainVehicle(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === 1) {
        alert("Vehicle added successfully!");
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
          photo: null,
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  const liveVehicles = vehicles.filter((v) => v.isLive);
  const nonLiveVehicles = vehicles.filter((v) => !v.isLive);

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}

      {/* Header */}
      <div className="dashboard-header">
        <button className="menu-button" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                ✖
              </button>
              <ul>
                <li onClick={() => navigate("/chats")}>Chats</li>
                <li onClick={() => navigate("/completed-rides")}>
                  Completed Rides
                </li>
                <li onClick={() => navigate("/profile")}>Profile</li>
              </ul>
            </div>
          </div>
        )}
        <h2 className="header-text">Hi, {username}</h2>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <h3>Live Vehicles</h3>
      <div className="vehicles-list">
        {liveVehicles.length > 0 ? (
          liveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoOffline={handleGoOffline}
            />
          ))
        ) : (
          <p>No live vehicles.</p>
        )}
      </div>
      <hr className="divider" />
      <h3>Non-Live Vehicles</h3>
      <div className="vehicles-list">
        {nonLiveVehicles.length > 0 ? (
          nonLiveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoLive={handleGoLive}
            />
          ))
        ) : (
          <p>No non-live vehicles.</p>
        )}
      </div>
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
