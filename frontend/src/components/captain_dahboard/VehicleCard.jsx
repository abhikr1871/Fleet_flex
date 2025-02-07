import React from "react";
import "./VehicleCard.css";

const VehicleCard = ({ vehicle, handleGoLive, handleGoOffline }) => {
  return (
    <div className="vehicle-card">
      <div>
        <h4>{vehicle.name}</h4>
        <p>Model: {vehicle.model}</p>
        <p>Capacity: {vehicle.capacity}</p>
        <p>Rate per km: {vehicle.perKmRate}</p>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default VehicleCard;
