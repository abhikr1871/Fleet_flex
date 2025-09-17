import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Riderequests.css";

const Riderequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.getCaptainRideRequests({
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.data || []);
      } catch (err) {
        alert("Failed to fetch ride requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div className="ride-requests-container">
      <h2 className="ride-requests-title">Ride Requests</h2>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div>No ride requests found.</div>
      ) : (
        <div className="ride-requests-grid">
          {requests.map((req) => (
            <div
              key={req._id}
              className="ride-request-card"
              onClick={() =>
                navigate("/ride-request-details", { state: { booking: req } })
              }
            >
              <div className="ride-request-vehicle">
                {req.vehicleDetails?.name} ({req.vehicleDetails?.model})
              </div>
              <div className="ride-request-info">
                <b>Pickup:</b> {req.pickup?.address}
              </div>
              <div className="ride-request-info">
                <b>Drop:</b> {req.drop?.address}
              </div>
              <div className="ride-request-price">₹{req.totalPrice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Riderequests;
