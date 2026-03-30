import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth/FoodPartnerLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function FoodPartnerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  console.log(email, password); // ✅ should work now

  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/loginPartner",
      { email, password },
      { withCredentials: true }
    );

    console.log("Success:", response.data);
    navigate("/create-food");
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header partner-header">
          <div className="partner-badge">🏪</div>
          <h1>Partner Login</h1>
          <p>Manage your food business account</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="businessEmail">Business Email</label>
            <input
              type="email"
              name='email'
              placeholder="Enter your business email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder="Enter your password"
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

          <div className="form-options">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="#forgot" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary btn-partner" >
            Sign In to Dashboard
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

        <div className="benefits-section">
          <h3>Partner Benefits</h3>
          <ul className="benefits-list">
            <li>📊 Real-time order management</li>
            <li>💰 Easy payment settlements</li>
            <li>📈 Sales analytics & insights</li>
            <li>🔔 Instant notifications</li>
          </ul>
        </div>

        <div className="auth-footer">
          <p>
            New to our platform? <Link to="/food-partner/register">Register now</Link>
          </p>
          <p>
            Are you a customer? <Link to="/user/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FoodPartnerLogin;
