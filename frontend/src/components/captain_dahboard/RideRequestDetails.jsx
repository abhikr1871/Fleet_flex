import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./RideRequestDetails.css";

const RideRequestDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="ride-details-container">
        <h2>No booking data found.</h2>
        <button className="ride-details-back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const handleAction = async (status) => {
    try {
      await api.respondToRideRequest(booking._id, status);
      alert(`Ride ${status === "accepted" ? "accepted" : "rejected"}!`);
      alert("Ride status updated successfully.");
      navigate(-1);
    } catch (error) {
      alert("Failed to update ride status.");
    }
  };

  return (
    <div className="ride-details-container">
      <h2 className="ride-details-title">Ride Request Details</h2>
      <div className="ride-details-row">
        <b>Vehicle:</b> {booking.vehicleDetails?.name} (
        {booking.vehicleDetails?.model})
      </div>
      <div className="ride-details-row">
        <b>Pickup:</b> {booking.pickup?.address}
      </div>
      <div className="ride-details-row">
        <b>Drop:</b> {booking.drop?.address}
      </div>
      <div className="ride-details-row">
        <b>Distance:</b> {booking.distance} km
      </div>
      <div className="ride-details-row">
        <b>Price:</b> ₹{booking.totalPrice}
      </div>
      <div className="ride-details-row">
        <b>Date & Time:</b> {new Date(booking.dateTime).toLocaleString()}
      </div>
      <div className="ride-details-row">
        <b>Status:</b> {booking.status}
      </div>
      <div className="ride-details-row">
        <b>User:</b> {booking.username} ({booking.userPhone})
      </div>
      <div className="ride-details-row">
        <b>Driver:</b> {booking.driverDetails?.name} (
        {booking.driverDetails?.contact})
      </div>
      {booking.status === "pending" && (
        <div className="ride-details-actions">
          <button
            className="ride-details-accept"
            onClick={() => handleAction("accepted")}
          >
            Accept
          </button>
          <button
            className="ride-details-reject"
            onClick={() => handleAction("rejected")}
          >
            Reject
          </button>
        </div>
      )}
      <button className="ride-details-back-btn" onClick={() => navigate(-1)}>
        Back to Requests
      </button>
    </div>
  );
};

export default RideRequestDetails;
