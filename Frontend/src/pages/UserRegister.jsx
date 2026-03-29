import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth/UserRegister.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function UserRegister() {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    const fullName = e.target.elements.fullName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

   const response= axios.post("http://localhost:5000/api/v1/users/register", {
      fullName,
      email,
      password,
    },{
        withCredentials:true,
    })
    .then((res) => {
      console.log("Success:", res.data);
      navigate("/")
    })
    .catch((err) => {
      console.error("Error:", err.response?.data || err.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us to order delicious food</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to the <a href="#terms">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Create Account
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="btn-social btn-google">
          <span>🔍</span> Continue with Google
        </button>

        <button className="btn-social btn-phone">
          <span>📱</span> Continue with Phone
        </button>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/user/login">Sign In</Link>
          </p>
          <p>
            Are you a food partner? <Link to="/food-partner/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
