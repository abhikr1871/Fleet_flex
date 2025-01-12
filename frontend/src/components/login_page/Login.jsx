import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="heading">
          <h2>Log in with</h2>
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
        <div className="divider">
          <span>or</span>
        </div>
        <form className="login-form">
          <div className="input-group">
            <input type="email" placeholder="Email address" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
