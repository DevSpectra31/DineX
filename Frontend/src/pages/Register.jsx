import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'partner' ? '/partner/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandMark}>ine<span>X</span></div>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Join the food community</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              type="text" name="username" required minLength={3} maxLength={30}
              value={form.username} onChange={handleChange}
              placeholder="foodlover99"
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password" name="password" required minLength={6}
              value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters"
            />
          </div>
          <div className={styles.field}>
            <label>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">🍽️ Food Explorer (User)</option>
              <option value="partner">🏪 Food Partner (Restaurant / Creator)</option>
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
