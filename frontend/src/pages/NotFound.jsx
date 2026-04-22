import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍽️</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        This dish doesn't exist on our menu.
      </p>
      <Link to="/" className="btn btn-primary">Back to Feed</Link>
    </div>
  );
}
