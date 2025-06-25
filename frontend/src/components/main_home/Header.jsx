import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaBars,
  FaHome,
} from "react-icons/fa";
import "./Header.css";
import { useAuthContext } from "../../context/AuthContext";

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
        <FaBars />
      </button>
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
                <p className="profile-role">user</p>
              </div>
            </div>

            <ul className="sidebar-nav">
              <li onClick={() => navigate("/Main_home")}>
                <FaHome />
                <span>Home</span>
              </li>
              <li onClick={() => navigate("/chats")}>
                <FaComments />
                <span>Chats</span>
              </li>
              <li onClick={() => navigate("/upcoming-rides")}>
                <FaCheckCircle />
                <span>Upcoming Rides</span>
              </li>
              <li onClick={() => navigate("/completed-rides")}>
                <FaCheckCircle />
                <span>Completed Rides</span>
              </li>
              <li onClick={() => navigate("/User_profile")}>
                <FaUser />
                <span>Profile</span>
              </li>
              <li className="logout-item" onClick={logout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      <h2 className="header-text">Hi, {username}</h2>
      <button onClick={logout} className="logout-button">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Header;
