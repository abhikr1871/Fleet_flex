import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaCar,
  FaPlus,
  FaBars,
  FaMoneyBillWave,
  FaTachometerAlt,
} from "react-icons/fa";
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
 const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
 const [selectedVehicleId, setSelectedVehicleId] = useState(null);
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

 const handleGoLiveClick = (vehicleId) => {
   setSelectedVehicleId(vehicleId);
   setShowBookingTypeModal(true);
 };

 const handleGoLive = (vehicleId, bookingType) => {
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
           { isLive: true, latitude, longitude, bookingType },
           { headers: { Authorization: `Bearer ${token}` } }
         );
         setVehicles((prevVehicles) =>
           prevVehicles.map((vehicle) =>
             vehicle._id === vehicleId
               ? {
                   ...vehicle,
                   isLive: true,
                   latitude,
                   longitude,
                   bookingType,
                 }
               : vehicle
           )
         );
         alert(
           `Vehicle ${vehicleId} is now live with "${bookingType}" booking type!`
         );
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



  const menuItems = [
    {
      icon: <FaTachometerAlt />,
      text: "Dashboard",
      path: "/captainDashboard",
    },
    {
      icon: <FaCheckCircle />,
      text: "Completed Rides",
      path: "/completed-rides",
    },
    { icon: <FaMoneyBillWave />, text: "Earnings", path: "/earnings" },
    { icon: <FaComments />, text: "Messages", path: "/chat-history" },
    { icon: <FaUser />, text: "Profile", path: "/captain_profile" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <button className="menu-button" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <h2 className="header-title">Fleet Management</h2>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {username}</span>
          
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>

            <div className="sidebar-profile">
              <div className="profile-avatar">
                {username ? username[0].toUpperCase() : "U"}
              </div>
              <div className="profile-info">
                <p className="profile-name">{username}</p>
                <div className="profile-badge">Fleet Captain</div>
              </div>
            </div>

            <nav className="sidebar-nav">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index} onClick={() => navigate(item.path)}>
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
                <li className="logout-item" onClick={logout}>
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <button className="add-vehicle-btn" onClick={() => setShowForm(true)}>
            <FaPlus />
            <span>Add New Vehicle</span>
          </button>
          {/* Ride Requests Button */}
          <button
            className="ride-requests-btn"
            onClick={() => navigate("/riderequests")}
            style={{
              marginLeft: "1rem",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7rem 1.5rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 2px 8px 0 #2563eb22"
            }}
          >
            <FaCheckCircle />
            <span>Ride Requests</span>
          </button>
        </div>

        <div className="vehicles-section">
          {/* Live Vehicles */}
          <div className="vehicle-category">
            <div className="category-header">
              <h2>
                Live Vehicles{" "}
                <span className="count">({liveVehicles.length})</span>
              </h2>
            </div>
            <div className="vehicles-grid">
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
                <div className="empty-state">
                  <FaCar />
                  <p>No vehicles currently live</p>
                </div>
              )}
            </div>
          </div>

          {/* Non-Live Vehicles */}
          <div className="vehicle-category">
            <div className="category-header">
              <h2>
                Offline Vehicles{" "}
                <span className="count">({nonLiveVehicles.length})</span>
              </h2>
            </div>
            <div className="vehicles-grid">
              {nonLiveVehicles.length > 0 ? (
                nonLiveVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    handleGoLive={handleGoLiveClick}
                    handleDeleteVehicle={handleDeleteVehicle}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <FaCar />
                  <p>No offline vehicles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <AddVehicleForm
          handleAddVehicle={handleAddVehicle}
          handleInputChange={handleInputChange}
          setShowForm={setShowForm}
          vehicleData={vehicleData}
        />
      )}

      {showBookingTypeModal && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <h3>Select Booking Type</h3>
            <div className="booking-options">
              {["instant", "scheduled", "both"].map((type) => (
                <button
                  key={type}
                  className={`booking-btn ${type}`}
                  onClick={() => {
                    handleGoLive(selectedVehicleId, type);
                    setShowBookingTypeModal(false);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="modal-close"
              onClick={() => {
                setShowBookingTypeModal(false);
                setSelectedVehicleId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;
