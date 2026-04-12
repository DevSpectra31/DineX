import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth/FoodPartnerRegister.css';
import axios from 'axios';

function FoodPartnerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const OwnerName = e.target.ownerName.value;
    const BusinessName = e.target.businessName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const PhoneNumber = e.target.phone.value;
    const BusinessAddress = e.target.address.value;
    const City = e.target.city.value;
    const ZipCode = e.target.zipcode.value;

    console.log({
      OwnerName,
      BusinessName,
      email,
      password,
      PhoneNumber,
      BusinessAddress,
      City,
      ZipCode,
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/regsiterPartner",
        {
          OwnerName,
          BusinessName,
          email,
          password,
          PhoneNumber,
          BusinessAddress,
          City,
          ZipCode,
        },
        { withCredentials: true }
      );

      console.log("Success:", response.data);
      const partnerId = response.data?.partner?._id;
      if (partnerId) {
        navigate('/food-partner/login');
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header partner-header">
          <div className="partner-badge">🏪</div>
          <h1>Partner Registration</h1>
          <p>Grow your food business with us</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter your restaurant/food business name"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner Name</label>
              <input
                type="text"
                name="ownerName"
                placeholder="Your full name"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Business email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Contact number"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter complete business address"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipcode"
                placeholder="Zip code"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
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
              I agree to Partner Terms & Conditions
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
