import React from "react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="copyright">
            &copy; 2025 FleetFlex. All rights reserved.
          </p>
          <nav className="social-menu">
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/_aditya_pwr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaLinkedin />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaTwitter />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
