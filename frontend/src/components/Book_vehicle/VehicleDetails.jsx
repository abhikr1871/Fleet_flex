import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../services/api";
import "./VehicleDetails.css";

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);

  if (!location.state?.vehicle || !location.state?.searchParams) {
    return (
      <div className="vehicle-details-container">
        <div className="error-message">
          <h2>Error Loading Vehicle Details</h2>
          <p>Could not load vehicle information.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back to Search Results
          </button>
        </div>
      </div>
    );
  }

  const { vehicle, searchParams } = location.state;
  const distance = parseFloat(searchParams.distance || 0);
  const totalPrice = distance * vehicle.perKmRate;

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      const bookingData = {
        vehicleId: vehicle._id,
        captainId: vehicle.captainId,
        pickup: searchParams.pickup,
        drop: searchParams.drop,
        distance: distance,
        totalPrice: totalPrice,
        dateTime: searchParams.dateTime || new Date(),
        vehicleDetails: {
          name: vehicle.name,
          model: vehicle.model,
          numberplate: vehicle.numberplate,
          type: vehicle.type,
        },
        driverDetails: vehicle.driver,
      };

      const response = await createBooking(bookingData);
      if (response.data.status === 1) {
        alert("Booking request sent to captain!");
        navigate("/user/upcomingrides");
      } else {
        alert("Failed to create booking: " + response.data.message);
      }
    } catch (error) {
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="vehicle-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Search Results
      </button>

      <div className="booking-details">
        <div className="vehicle-info">
          <img
            src={vehicle.photo}
            alt={vehicle.name}
            className="vehicle-image"
          />
          <h2>{vehicle.name}</h2>
          <div className="vehicle-specs">
            <div className="spec-item">
              <span>Model:</span> {vehicle.model}
            </div>
            <div className="spec-item">
              <span>Vehicle Number:</span> {vehicle.numberplate}
            </div>
            <div className="spec-item">
              <span>Type:</span> {vehicle.type}
            </div>
            <div className="spec-item">
              <span>Capacity:</span> {vehicle.capacity} passengers
            </div>
            <div className="spec-item">
              <span>Fuel Type:</span> {vehicle.fuelType}
            </div>
            <div className="spec-item">
              <span>AC Available:</span> {vehicle.acAvailable ? "Yes" : "No"}
            </div>
            {vehicle.type !== "Car" && (
              <div className="spec-item">
                <span>Weight Capacity:</span> {vehicle.weightCapacity} kg
              </div>
            )}
          </div>
        </div>

        <div className="driver-info">
          <h3>Driver Details</h3>
          <div className="info-grid">
            <p>
              <span>Name:</span> {vehicle.driver.name}
            </p>
            <p>
              <span>Contact:</span> {vehicle.driver.contact}
            </p>
            <p>
              <span>License:</span> {vehicle.driver.licenseNumber}
            </p>
          </div>
        </div>

        <div className="journey-details">
          <h3>Journey Details</h3>
          <div className="location-info">
            <div className="location-item">
              <span>Pickup Location:</span>
              <p>{searchParams.pickup?.address}</p>
            </div>
            <div className="location-item">
              <span>Drop Location:</span>
              <p>{searchParams.drop?.address}</p>
            </div>
            <div className="location-item">
              <span>Distance:</span>
              <p>{distance} km</p>
            </div>
          </div>

          <div className="price-details">
            <div className="rate">
              <span>Rate per km:</span>
              <p>₹{vehicle.perKmRate}</p>
            </div>
            <div className="total">
              <span>Total Price:</span>
              <h3>₹{totalPrice.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="book-now-button"
          disabled={isBooking}
        >
          {isBooking ? "Sending Request..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
