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
    fuelType: "",
    dimensions: { length: "", width: "", height: "" },
    weightCapacity: "",
    acAvailable: false,
    photo: null,
    driver: { name: "", contact: "", licenseNumber: "" },
  });

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

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

  const handleGoLive = (vehicleId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await api.updateVehicleStatus(
            vehicleId,
            { isLive: true, latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setVehicles((prevVehicles) =>
            prevVehicles.map((vehicle) =>
              vehicle._id === vehicleId
                ? { ...vehicle, isLive: true, latitude, longitude }
                : vehicle
            )
          );
           alert(`Vehicle ${vehicleId} is now live!`);
        } catch (error) {
          console.error("Error updating vehicle location:", error);
          alert("Failed to update vehicle location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get location. Please allow location access.");
      }
    );
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
    const { name, value, type, checked } = e.target;

    if (name.startsWith("driver.")) {
      const field = name.split(".")[1];
      setVehicleData((prevData) => ({
        ...prevData,
        driver: { ...prevData.driver, [field]: value },
      }));
    } else if (name.startsWith("dimensions.")) {
      const field = name.split(".")[1];
      setVehicleData((prevData) => ({
        ...prevData,
        dimensions: { ...prevData.dimensions, [field]: value },
      }));
    } else if (type === "checkbox") {
      setVehicleData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setVehicleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Loop through keys in vehicleData
    for (const key in vehicleData) {
      if (key === "driver") {
        // Append each driver field separately with dot notation
        for (const subKey in vehicleData.driver) {
          formData.append(`driver.${subKey}`, vehicleData.driver[subKey]);
        }
      } else if (key === "dimensions") {
        // Append each dimension field separately
        for (const subKey in vehicleData.dimensions) {
          formData.append(
            `dimensions.${subKey}`,
            vehicleData.dimensions[subKey]
          );
        }
      } else {
        formData.append(key, vehicleData[key]);
      }
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
          fuelType: "",
          dimensions: { length: "", width: "", height: "" },
          weightCapacity: "",
          acAvailable: false,
          photo: null,
          driver: { name: "", contact: "", licenseNumber: "" },
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

   const handleDeleteVehicle = async (vehicleId) => {
     // Show confirmation dialog
     const confirmDelete = window.confirm(
       "Are you sure you want to delete this vehicle?"
     );

     if (!confirmDelete) return;

     try {
       await api.delete_vehicle(vehicleId, {
         headers: { Authorization: `Bearer ${token}` },
       });

       // Fetch updated vehicle list
       const resp = await api.getCaptainVehicles({
         headers: { Authorization: `Bearer ${token}` },
       });
       setVehicles(resp.data.data);

       alert("Vehicle deleted successfully!");
     } catch (error) {
       console.error("Error deleting vehicle:", error);
       alert("Failed to delete vehicle");
     }
   };


  const liveVehicles = vehicles.filter((v) => v.isLive);
  const nonLiveVehicles = vehicles.filter((v) => !v.isLive);

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu & Header */}
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

      {showForm && (
        <AddVehicleForm
          handleAddVehicle={handleAddVehicle}
          handleInputChange={handleInputChange}
          setShowForm={setShowForm}
        />
      )}

      <h3 className="live-nonlive">Live Vehicles</h3>
      <div className="vehicles-list">
        {liveVehicles.length > 0 ? (
          liveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoOffline={handleGoOffline}
              handleDeleteVehicle={handleDeleteVehicle}
            />
          ))
        ) : (
          <p>No live vehicles.</p>
        )}
      </div>

      <h3 className="live-nonlive">Non-Live Vehicles</h3>
      <div className="vehicles-list">
        {nonLiveVehicles.length > 0 ? (
          nonLiveVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              handleGoLive={handleGoLive}
              handleDeleteVehicle={handleDeleteVehicle}
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
    </div>
  );
};

export default CaptainDashboard;
