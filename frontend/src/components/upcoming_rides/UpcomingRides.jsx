import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpcomingRideDetails.css";
import api from "../../services/api"

const UpcomingRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.getUpcomingRides();
        setRides(res.data.data || []);
      } catch {
        setRides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <div className="upcoming-rides-container">
      <h2 className="upcoming-rides-title">Upcoming Rides</h2>
      {loading ? (
        <div>Loading...</div>
      ) : rides.length === 0 ? (
        <div>No upcoming rides found.</div>
      ) : (
        <div className="upcoming-rides-grid">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="upcoming-ride-card"
              onClick={() => navigate("/upcoming-ride-details", { state: { ride } })}
            >
              <div className="upcoming-ride-vehicle">
                {ride.vehicleDetails?.name} ({ride.vehicleDetails?.model})
              </div>
              <div className="upcoming-ride-info">
                <b>Pickup:</b> {ride.pickup?.address}
              </div>
              <div className="upcoming-ride-info">
                <b>Drop:</b> {ride.drop?.address}
              </div>
              <div className="upcoming-ride-price">₹{ride.totalPrice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingRides;