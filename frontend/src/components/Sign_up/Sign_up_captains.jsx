import React, { useState, useEffect } from "react";
import { signup2 } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import CaptainDashboard from "../captain_dahboard/CaptainDashboard";
const Sign_up_captains = () => {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate(); 

  useEffect(() => {
      if (isAuthenticated) {
        navigate("/CaptainDashboard", { replace: true });
      }
    }, [isAuthenticated, navigate]);
  const submithandeler =async (e) => {
    e.preventDefault();
    try {
          const response = await signup2({ username, email, password });
          console.log("response", response);
          if (response?.data?.status === 1) {
            localStorage.setItem("token", response?.data?.data?.token);
            localStorage.setItem("userId", response?.data?.data?.user_id);
            setIsAuthenticated(true);
            window.alert("Signup successful!");
           // navigate("/");
          } else {
            window.alert(response?.data?.message || "Signup failed. Please try again.");
          }
        } catch (error) {
          console.error("Signup error:", error?.message);
          window.alert("An error occurred. Please try again later.");
        }
    setemail("");
    setusername("");
    setpassword("");
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading">
          <h2>Sign Up With</h2>
          <button
            className="close_btn"
            onClick={() => (window.location.href = "/")}
          >
            Close
          </button>
        </div>

        <div className="social-buttons">
          <button className="social-btn google">
            <img src="/icons/google.svg" alt="Google" />
            Google
          </button>
          <button className="social-btn apple">
            <img src="/icons/apple.svg" alt="Apple" />
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>
        <form
          className="login-form"
          onSubmit={(e) => {
            submithandeler(e);
          }}
        >
          <div className="input-group">
            <input
              type="username"
              placeholder="Enter Your User Name"
              required
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="login-btn">
            signup
          </button>
        </form>
        <button
          className="login-btn captain-login"
          onClick={() => (window.location.href = "/signup")}
        >
          Sign Up As User
        </button>
        <p className="signup-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Sign_up_captains;
