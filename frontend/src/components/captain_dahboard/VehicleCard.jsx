import React from "react";
import "./VehicleCard.css";

const VehicleCard = ({
  vehicle,
  handleGoLive,
  handleGoOffline,
  handleDeleteVehicle,
}) => {
  const backendURL = "http://localhost:4000";
  const imageUrl = vehicle.photo
    ? `${backendURL}${vehicle.photo}` // Directly append the stored path
    : "/default-image.jpg";

  console.log("Vehicle Photo URL:", imageUrl);

  return (
    <div className="vehicle-card">
      {/* Vehicle Image */}
      {vehicle.photo && (
        <img src={imageUrl} alt={vehicle.photo} className="vehicle-image" />
      )}

      {/* Vehicle Details */}
      <div className="vehicle-info">
        <h4>{vehicle.name}</h4>
        <p>Model: {vehicle.driver?.name}</p>
        <p>Capacity: {vehicle.capacity}</p>
        <p>Rate per km: {vehicle.perKmRate}</p>
      </div>

      {/* Go Live / Go Offline Button */}
      <div className="vehicle-actions">
        {vehicle.isLive && handleGoOffline ? (
          <button
            className="go-offline-btn"
            onClick={() => handleGoOffline(vehicle._id)}
          >
            Go Offline
          </button>
        ) : !vehicle.isLive && handleGoLive ? (
          <button
            className="go-live-btn"
            onClick={() => handleGoLive(vehicle._id)}
          >
            Go Live
          </button>
        ) : null}
        <button
          className="delete-btn"
          onClick={() => handleDeleteVehicle(vehicle._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;