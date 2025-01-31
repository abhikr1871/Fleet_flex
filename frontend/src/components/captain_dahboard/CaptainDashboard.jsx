import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Assuming you are importing from your api.js
import "./CaptainDashboard.css";

const CaptainDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    capacity: "",
    perKmRate: "",
    numberplate: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.getCaptainVehicles(); // Use your API utility function
      setVehicles(response.data.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleGoLive = (vehicleId) => {
    console.log(`Vehicle ${vehicleId} is now live!`);
    alert(`Vehicle ${vehicleId} is now live!`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    try {
      const response = await api.addCaptainVehicle(vehicleData); // Send the data without the image field

      if (response.data.status === 1) {
        alert("Vehicle added successfully!");
        fetchVehicles(); // Refresh vehicle list
        setShowForm(false);
        setVehicleData({
          name: "",
          model: "",
          capacity: "",
          perKmRate: "",
          numberplate: "",
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Captain Dashboard</h2>

      <div className="vehicles-list">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-card">
            <h3>
              {vehicle.name} ({vehicle.model})
            </h3>
            <p>Capacity: {vehicle.capacity} persons</p>
            <p>Rate: ₹{vehicle.perKmRate} per km</p>
            <button
              className="go-live-btn"
              onClick={() => handleGoLive(vehicle._id)}
            >
              Go Live
            </button>
          </div>
        ))}
      </div>

      <button
        className="add-vehicle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        Add Vehicle
      </button>

      {showForm && (
        <div className="add-vehicle-form">
          <h3>Add New Vehicle</h3>
          <form onSubmit={handleAddVehicle}>
            <input
              type="text"
              name="name"
              placeholder="Vehicle Name"
              required
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="model"
              placeholder="Model"
              required
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              required
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="perKmRate"
              placeholder="Rate per Km"
              required
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="numberplate"
              placeholder="Number Plate"
              required
              onChange={handleInputChange}
            />
            <button type="submit">Add Vehicle</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;
