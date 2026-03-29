import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth/FoodPartnerRegister.css';

function FoodPartnerRegister() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header partner-header">
          <div className="partner-badge">🏪</div>
          <h1>Partner Registration</h1>
          <p>Grow your food business with us</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              placeholder="Enter your restaurant/food business name"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ownerName">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                placeholder="Your full name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="businessType">Business Type</label>
              <select className="form-input">
                <option value="">Select type</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Café</option>
                <option value="cloud-kitchen">Cloud Kitchen</option>
                <option value="bakery">Bakery</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Business email"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="Contact number"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter complete business address"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="City"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipcode">Zip Code</label>
              <input
                type="text"
                id="zipcode"
                placeholder="Zip code"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gstin">GSTIN (Optional)</label>
              <input
                type="text"
                id="gstin"
                placeholder="Enter GSTIN if applicable"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="licenseNo">License Number</label>
              <input
                type="text"
                id="licenseNo"
                placeholder="Food license number"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Create a strong password"
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
              I agree to Partner <a href="#terms">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn-primary btn-partner">
            Register as Partner
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already registered? <Link to="/food-partner/login">Sign In</Link>
          </p>
          <p>
            Are you a customer? <Link to="/user/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FoodPartnerRegister;
