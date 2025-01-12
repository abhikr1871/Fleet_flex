import React from 'react'

const Sign_up = () => {
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
        <div className="divider">
          <span>or</span>
        </div>
        <form className="login-form">
          <div className="input-group">
            <input
              type="username"
              placeholder="Enter Your User Name"
              required
            />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email address" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="login-btn">
            signup
          </button>
        </form>
        <p className="signup-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Sign_up