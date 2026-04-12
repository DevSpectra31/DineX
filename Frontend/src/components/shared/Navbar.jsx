import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isPartner = user?.role === 'partner' || user?.role === 'admin';

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          Dine<span>X</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.links}>
          <Link
            to="/"
            className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
          >
            🍽️ Feed
          </Link>

          {/* ← NEW: Explore link */}
          <Link
            to="/explore"
            className={`${styles.link} ${isActive('/explore') ? styles.active : ''}`}
          >
            🔍 Explore
          </Link>

          {isPartner && (
            <Link
              to="/partner/dashboard"
              className={`${styles.link} ${isActive('/partner/dashboard') ? styles.active : ''}`}
            >
              📊 Dashboard
            </Link>
          )}
        </div>

        {/* Auth area */}
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu} ref={menuRef}>
              <button className={styles.userBtn} onClick={() => setMenuOpen(o => !o)}>
                <div className={styles.avatar}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.username} />
                    : <span>{user.username[0].toUpperCase()}</span>
                  }
                </div>
                <span className={styles.username}>{user.username}</span>
                <span className={styles.chevron}>{menuOpen ? '▴' : '▾'}</span>
              </button>

              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <strong>{user.username}</strong>
                    <span className={`badge badge-${user.role === 'partner' ? 'partner' : 'user'}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className={styles.dropdownDivider} />

                  <Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)}>
                    👤 Profile
                  </Link>

                  {/* ← NEW: Explore in dropdown too */}
                  <Link to="/explore" onClick={() => setMenuOpen(false)}>
                    🔍 Explore
                  </Link>

                  {isPartner && (
                    <Link to="/partner/dashboard" onClick={() => setMenuOpen(false)}>
                      📊 Dashboard
                    </Link>
                  )}

                  <div className={styles.dropdownDivider} />
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}