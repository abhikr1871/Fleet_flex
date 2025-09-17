import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthContext } from "../../context/AuthContext";

const Header = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>FleetFlex</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
