import React from "react";
import "./Main.css"; // Import CSS

function Main() {
  return (
    <main className="main">
      <div className="main-container">
        <div className="main-content">
          <h1>Welcome to FleetFlex! </h1>
          <p>
            "Easily book the perfect vehicle for your needs—whether for
            passenger transport or goods delivery. Simply enter your pickup and
            drop locations, choose your preferred vehicle type, and select your
            travel date. Get started now for a smooth and hassle-free booking
            experience!"
          </p>
          <div className="buttons2">
            <button
              className="book"
              onClick={() => (window.location.href = "/VehicleSearch")}
            >
              Book Vehicle
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;
