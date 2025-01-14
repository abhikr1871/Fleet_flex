import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const submithandeler=(e)=>{
    e.preventDefault();
    console.log("hello");
    setemail('');
    setpassword('');
  }

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

        <form
          className="login-form"
          onSubmit={(e) => {
            submithandeler(e);
          }}
        >
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
                setpassword(e.target.password);
              }}
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
