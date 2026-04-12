import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>ine<span>X</span></Link>
          <p className={styles.tagline}>
            Discover the best food reels from restaurants and creators near you.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

        {/* Links - Explore */}
        <div className={styles.col}>
          <h4>Explore</h4>
          <Link to="/">Feed</Link>
          <Link to="/?cuisine=Indian">Indian</Link>
          <Link to="/?cuisine=Italian">Italian</Link>
          <Link to="/?cuisine=Japanese">Japanese</Link>
          <Link to="/?cuisine=Chinese">Chinese</Link>
        </div>

        {/* Links - Partners */}
        <div className={styles.col}>
          <h4>Partners</h4>
          <Link to="/register">Become a Partner</Link>
          <Link to="/partner/dashboard">Dashboard</Link>
          <a href="#">Upload Guidelines</a>
          <a href="#">Partner FAQ</a>
        </div>

        {/* Links - Company */}
        <div className={styles.col}>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p>© {year} ineX. All rights reserved.</p>
        <p className={styles.madeWith}>Made with ❤️ for food lovers</p>
      </div>
    </footer>
  );
}