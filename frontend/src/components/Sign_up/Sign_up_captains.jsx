import React, { useState } from "react";

const Sign_up_captains = () => {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const submithandeler = (e) => {
    e.preventDefault();
    console.log("hello");
    setemail("");
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
                setpassword(e.target.password);
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
