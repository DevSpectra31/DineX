import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ReelCard from '../components/reels/ReelCard';
import styles from './Profile.module.css';

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [savedReels, setSavedReels] = useState([]);
  const [tab, setTab] = useState('saved');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    api.get(`/users/${username}`)
      .then(res => {
        setProfile(res.data.user);
        setFollowing(res.data.user.followers?.some(f => f._id === me?._id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username, me]);

  useEffect(() => {
    if (me?.username === username) {
      api.get(`/users/${username}/saved`)
        .then(res => setSavedReels(res.data.reels))
        .catch(console.error);
    }
  }, [username, me]);

  const handleFollow = async () => {
    await api.post(`/users/${profile._id}/follow`);
    setFollowing(f => !f);
    setProfile(p => ({
      ...p,
      followers: following
        ? p.followers.filter(f => f._id !== me._id)
        : [...p.followers, { _id: me._id, username: me.username }],
    }));
  };

  if (loading) return <div className="spinner" />;
  if (!profile) return <Navigate to="/" />;

  const isMe = me?.username === username;

  return (
    <main className={styles.page}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {profile.avatar
            ? <img src={profile.avatar} alt="" />
            : <span>{profile.username[0].toUpperCase()}</span>
          }
        </div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h1>{profile.username}</h1>
            {profile.role === 'partner' && <span className="badge badge-partner">Partner</span>}
          </div>
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
          <div className={styles.stats}>
            <span><strong>{profile.followers?.length}</strong> followers</span>
            <span><strong>{profile.following?.length}</strong> following</span>
          </div>
          {!isMe && me && (
            <button
              className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`}
              onClick={handleFollow}
              style={{ marginTop: 12 }}
            >
              {following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs (only visible to own user) */}
      {isMe && (
        <>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'saved' ? styles.activeTab : ''}`}
              onClick={() => setTab('saved')}
            >
              🔖 Saved Reels
            </button>
          </div>

          {tab === 'saved' && (
            <div className={styles.grid}>
              {savedReels.length === 0
                ? <p className={styles.empty}>No saved reels yet.</p>
                : savedReels.map(r => <ReelCard key={r._id} reel={r} />)
              }
            </div>
          )}
        </>
      )}
    </main>
  );
}
