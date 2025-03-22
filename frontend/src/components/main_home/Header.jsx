import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthContext } from "../../context/AuthContext"; // Import useAuthContext

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, authLoading } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
 const token = localStorage.getItem("token");
 const username = localStorage.getItem("username");

  useEffect(() => {
     if (!authLoading && !isAuthenticated) {
       navigate("/");
     }
   }, [isAuthenticated, authLoading, navigate]);
  return (
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
  );
};

export default Header;
