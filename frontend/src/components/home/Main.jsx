import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const vehicleCategories = [
    {
      id: 1,
      title: "Cars",
      description: "Comfortable and efficient personal transportation",
      image: "./photos/car.jpg",
    },
    {
      id: 2,
      title: "Buses",
      description: "Perfect for group travel and long journeys",
      image: "./photos/bus.jpg",
    },
    {
      id: 3,
      title: "Trucks",
      description: "Heavy-duty vehicles for large cargo transport",
      image: "./photos/truck.jpg",
    },
    {
      id: 4,
      title: "Mini Trucks",
      description: "Ideal for urban deliveries and small cargo",
      image: "./photos/minitruck.jpg",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === vehicleCategories.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

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
            <button onClick={() => navigate("/signup")}>SIGN UP</button>
            <button onClick={() => navigate("/login")}>SIGN IN</button>
          </div>
        </div>

        <div className="slideshow-container">
          {vehicleCategories.map((category, index) => (
            <div
              key={category.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <div className="slide-content">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
              <img src={category.image} alt={category.title} />
            </div>
          ))}

          <div className="slide-indicators">
            {vehicleCategories.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;
