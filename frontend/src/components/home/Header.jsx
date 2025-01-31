import React from "react";
import "./Header.css";
import { useAuthContext } from "../../context/AuthContext"; // Import useAuthContext

const Header = () => {
  const { logout } = useAuthContext(); // Access logout function from context

  return (
    <header>
      <div className="logo">FleetFlex</div>
      <nav>
        <ul>
          <li>
            <a href="https://www.instagram.com/_aditya_pwr/">
              <img src="./icons/instagram.svg" alt="Instagram" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/linkedin.svg" alt="LinkedIn" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/x-icon.svg" alt="X (Twitter)" />
            </a>
          </li>
          <li>
            <a href="#" className="home-button">
              Home
            </a>
          </li>
          <li>
            <button onClick={logout} className="homebutton">
              Logout
            </button>
          </li>
          <li>
            <a href="#" className="contact-button">
              Contact us
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
