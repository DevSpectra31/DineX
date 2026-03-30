import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth/UserLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function UserLogin() {
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  console.log(email, password); // ✅ should work now

  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/login",
      { email, password },
      { withCredentials: true }
    );

    console.log("Success:", response.data);
    navigate("/");
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form"  onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name='email'
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
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

          <button type="submit" className="btn-primary" >
            Sign In
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
            Don't have an account? <Link to="/user/register">Sign Up</Link>
          </p>
          <p>
            Are you a food partner? <Link to="/food-partner/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
