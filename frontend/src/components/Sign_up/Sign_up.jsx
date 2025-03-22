import React, { useState, useEffect } from "react";
import "../login_page/Login.css";
import axios from "axios";
import { signup } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";


const SignUp = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Main_home", { replace: true });
    }
  }, [isAuthenticated]);

  const submitHandler = async (e) => {

    e.preventDefault();
    try {
      const response = await signup({ username, email, password });
      console.log("response", response);
      if (response?.data?.status === 1) {
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("userId", response?.data?.data?.user_id);
        localStorage.setItem("username", response?.data?.data?.username);
        localStorage.setItem("role", "user");
        setIsAuthenticated(true);
        window.alert("Signup successful!");
        //navigate("/");
      } else {
        window.alert(response?.data?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error?.message);
      window.alert("An error occurred. Please try again later.");
    }
    setEmail("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading">
          <h2>Sign Up With</h2>
          <button className="close_btn" onClick={() => navigate("/")}>
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
          <h3 className="sing-inst">Singning up as User</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Your Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
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
          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>

        <button
          className="login-btn captain-login"
          onClick={() => navigate("/captain_sign_up")}
        >
          Sign Up As Captain
        </button>
        <p className="signup-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
