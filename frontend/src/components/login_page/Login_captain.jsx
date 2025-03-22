import React, { useState } from "react";
import { login2 } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Login_captain = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login2({ email, password });
      console.log("Login response:", response);

      if (response?.data?.status === 1) {
        // Store token and user ID
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("userId", response?.data?.data?.user_id);
        localStorage.setItem("username", response?.data?.data?.username);
        localStorage.setItem("role", "captain");
        // Update auth state and navigate
        setIsAuthenticated(true);
        window.alert("Login successful!");
        navigate("/CaptainDashboard");
      } else {
        window.alert(response?.data?.message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error?.message);
      window.alert("An error occurred. Please try again later.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading">
          <h2>FleetFlex</h2>
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
          <h3 className="sing-inst">Singning in as captain</h3>
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
          onClick={() => navigate("/login")}
        >
          Log in As User
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login_captain;
