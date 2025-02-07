import React, { useState, useEffect } from "react";
import "./Login.css";
import { login } from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Main_home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      console.log("response", response);
      const message = response?.data?.message;
      window.alert(message);

      if (response?.data?.status === 1) {
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("userId", response?.data?.data?.user_id);

        setIsAuthenticated(true);
        setEmail("");
        setPassword("");
        navigate('/home');
      } else {
        window.alert("Token not received. Please try again.");
      }
    } catch (error) {
      console.error(error?.message);
      window.alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading">
          <h2>FleetFlex</h2>
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
        <form className="login-form" onSubmit={submitHandler}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <button
          className="login-btn captain-login"
          onClick={() => (window.location.href = "/captain_login")}
        >
          Log in As Captain
        </button>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;