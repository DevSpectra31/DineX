import React, { useEffect, useState } from 'react';
import '../../styles/FoodPartnerProfile.css';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [videos, setvideos] = useState([])

  useEffect(() => {
    setStatus('loading');
    setError('');

    axios
      .get('http://localhost:5000/api/food-partner/me', {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response?.data?.foodPartner ?? null);
        setvideos(response.data.foodPartner.foodItems)
        setStatus('ready');
      })
      .catch((err) => {
        setProfile(null);
        setStatus('error');
        setError(err?.response?.data?.message || err?.message || 'Request failed');
      });
  }, []);

  return (
    <div className="partner-profile-page">
      <div className="partner-profile-shell">
        <div className="partner-profile-panel">
          <div className="partner-profile-header">
            <div className="partner-profile-top">
              <div className="partner-avatar">logo</div>
              <div className="partner-business-copy">
                <div className="partner-info-pill">
                  <strong>{profile?.BusinessName || ''}</strong>
                </div>
                <div className="partner-info-pill">
                  <span>{profile?.BusinessAddress || ''}</span>
                </div>
              </div>
            </div>

            <div className="partner-stats-row">
              <div className="partner-stat-card">
                <span>total meals</span>
                <strong>43</strong>
              </div>
              <div className="partner-stat-card">
                <span>customer serve</span>
                <strong>15K</strong>
              </div>
            </div>
            {status === 'error' && error ? (
              <div className="partner-stat-card">
                <span>error</span>
                <strong>{error}</strong>
              </div>
            ) : null}
          </div>

          <div className="partner-grid-divider" />

          <div className="partner-video-grid">
            {videos.length > 0
              ? videos.map((tile) => (
                  <button
                    className="partner-video-tile"
                    type="button"
                    key={tile.id}
                  >
                    <video
                      className="partner-video-preview"
                      src={tile.video}
                      muted
                    />
                  </button>
                ))
              : Array.from({ length: 9 }).map((_, index) => (
                  <div className="partner-video-tile" key={`empty-${index}`}>
                    <span>video</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
