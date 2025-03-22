// src/components/Main.js
import React from "react";
import "./Main.css"; // Import Main CSS
   
function Main() {
  return (
    <main className="main">
      <div className="main-container">
        <div className="main-content">
          <h1>Welcome to FleetFlex</h1>
          <p>
            FleetFlex connects you with vehicles tailored to your needs, whether
            for passenger transport or goods delivery. Join us for seamless
            transportation services!
          </p>
          <div className="buttons">
            <button onClick={() => (window.location.href = "/signup")}>
              SIGN UP
            </button>
            <button onClick={() => (window.location.href = "/login")}>
              SIGN IN
            </button>
          </div>
        </div>
        <div className="image-container">
          <img src="./photos/abc.png" alt="Planning a trip" />
        </div>
      </div>
    </main>
  );
}

export default Main;
