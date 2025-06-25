import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpcomingRideDetails.css";

const UpcomingRideDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ride = state?.ride;

  if (!ride) {
    return (
      <div className="upcoming-ride-details-container">
        <h2>No ride data found.</h2>
        <button className="upcoming-ride-details-back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="upcoming-ride-details-container">
      <h2 className="upcoming-ride-details-title">Upcoming Ride Details</h2>
      <div className="upcoming-ride-details-row">
        <b>Vehicle:</b> {ride.vehicleDetails?.name} ({ride.vehicleDetails?.model})
      </div>
      <div className="upcoming-ride-details-row">
        <b>Pickup:</b> {ride.pickup?.address}
      </div>
      <div className="upcoming-ride-details-row">
        <b>Drop:</b> {ride.drop?.address}
      </div>
      <div className="upcoming-ride-details-row">
        <b>Distance:</b> {ride.distance} km
      </div>
      <div className="upcoming-ride-details-row">
        <b>Price:</b> ₹{ride.totalPrice}
      </div>
      <div className="upcoming-ride-details-row">
        <b>Date & Time:</b> {new Date(ride.dateTime).toLocaleString()}
      </div>
      <button className="upcoming-ride-details-back-btn" onClick={() => navigate(-1)}>
        Back to Upcoming Rides
      </button>
    </div>
  );
};

export default UpcomingRideDetails;