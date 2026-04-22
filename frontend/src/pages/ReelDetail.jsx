import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './ReelDetail.module.css';

export default function ReelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/reels/${id}`)
      .then(res => setReel(res.data.reel))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    const res = await api.post(`/reels/${id}/like`);
    setReel(r => ({
      ...r,
      likes: res.data.liked
        ? [...r.likes, user._id]
        : r.likes.filter(l => l !== user._id),
    }));
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    const res = await api.post(`/reels/${id}/save`);
    setReel(r => ({
      ...r,
      saves: res.data.saved
        ? [...r.saves, user._id]
        : r.saves.filter(s => s !== user._id),
    }));
  };

  const handleComment = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/reels/${id}/comment`, { text: commentText });
      setReel(r => ({ ...r, comments: [...r.comments, res.data.comment] }));
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!reel) return null;

  const isLiked = user && reel.likes?.includes(user._id);
  const isSaved = user && reel.saves?.includes(user._id);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* Video Panel */}
        <div className={styles.videoPanel}>
          <video
            src={reel.videoUrl}
            controls
            className={styles.video}
            poster={reel.thumbnailUrl}
          />
        </div>

        {/* Info Panel */}
        <div className={styles.infoPanel}>
          {/* Author */}
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              {reel.uploadedBy?.avatar
                ? <img src={reel.uploadedBy.avatar} alt="" />
                : <span>{reel.uploadedBy?.username?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div>
              <Link to={`/profile/${reel.uploadedBy?.username}`} className={styles.authorName}>
                {reel.uploadedBy?.username}
              </Link>
              {reel.uploadedBy?.role === 'partner' && (
                <span className="badge badge-partner" style={{ marginLeft: 6 }}>Partner</span>
              )}
            </div>
          </div>

          <h1 className={styles.title}>{reel.title}</h1>

          {reel.description && <p className={styles.desc}>{reel.description}</p>}

          <div className={styles.meta}>
            {reel.cuisine && <span className={styles.tag}>{reel.cuisine}</span>}
            {reel.tags?.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
          </div>

          {reel.restaurant?.name && (
            <div className={styles.restaurant}>
              📍 <strong>{reel.restaurant.name}</strong>
              {reel.restaurant.city && `, ${reel.restaurant.city}`}
            </div>
          )}

          <div className={styles.stats}>
            <span>👁 {reel.views} views</span>
            <span>❤️ {reel.likes?.length} likes</span>
            <span>💬 {reel.comments?.length} comments</span>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <button
              className={`btn ${isLiked ? styles.liked : 'btn-ghost'}`}
              onClick={handleLike}
            >
              {isLiked ? '❤️ Liked' : '🤍 Like'}
            </button>
            <button
              className={`btn ${isSaved ? styles.saved : 'btn-ghost'}`}
              onClick={handleSave}
            >
              {isSaved ? '🔖 Saved' : '📑 Save'}
            </button>
          </div>

          {/* Comments */}
          <div className={styles.comments}>
            <h2>Comments ({reel.comments?.length})</h2>

            <form onSubmit={handleComment} className={styles.commentForm}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
                disabled={!user}
                maxLength={300}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting || !user}>
                {submitting ? '...' : 'Post'}
              </button>
            </form>

            <div className={styles.commentList}>
              {reel.comments?.length === 0 && (
                <p className={styles.noComments}>No comments yet.</p>
              )}
              {[...reel.comments].reverse().map(c => (
                <div key={c._id} className={styles.comment}>
                  <div className={styles.commentAvatar}>
                    {c.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span className={styles.commentUser}>{c.user?.username}</span>
                    <p>{c.text}</p>
                    <span className={styles.commentTime}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
