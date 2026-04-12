import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReels } from '../../context/ReelContext';
import styles from './ReelCard.module.css';

export default function ReelCard({ reel }) {
  const { user } = useAuth();
  const { toggleLike, toggleSave, addComment } = useReels();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef(null);
  const isLiked = user && reel.likes?.includes(user._id);
  const isSaved = user && reel.saves?.includes(user._id);

  const requireAuth = (fn) => {
    if (!user) return navigate('/login');
    fn();
  };

  const handleLike = () => requireAuth(async () => {
    await toggleLike(reel._id, user._id);
  });
  const handleMouseEnter = () => {
  setIsHovered(true);
  if (videoRef.current) {
    videoRef.current.play().catch(() => {}); // catch autoplay block errors silently
  }
};
  const handleSave = () => requireAuth(async () => {
    await toggleSave(reel._id, user._id);
  });
  const handleMouseLeave = () => {
  setIsHovered(false);
  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }
};

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    requireAuth(async () => {
      setSubmitting(true);
      await addComment(reel._id, commentText);
      setCommentText('');
      setSubmitting(false);
    });
  };

  const formatCount = (n = 0) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;

  return (
    <div className={styles.card}>
     <Link
  to={`/reel/${reel._id}`}
  className={styles.mediaWrapper}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  {/* Video preview — plays on hover */}
  {reel.videoUrl && (
    <video
      ref={videoRef}
      src={reel.videoUrl}
      className={`${styles.videoPreview} ${isHovered ? styles.videoVisible : ''}`}
      muted
      loop
      playsInline
      preload="none"
    />
  )}

  {/* Thumbnail shown when not hovered */}
  {reel.thumbnailUrl ? (
    <img
      src={reel.thumbnailUrl}
      alt={reel.title}
      className={`${styles.thumbnail} ${isHovered ? styles.hidden : ''}`}
    />
  ) : (
    <div className={`${styles.placeholder} ${isHovered ? styles.hidden : ''}`}>
      🎬
    </div>
  )}

  <span className={styles.viewsBadge}>👁 {formatCount(reel.views)}</span>

  {/* Show play icon only when not hovered */}
  {!isHovered && <span className={styles.playIcon}>▶</span>}

  {/* Show muted badge when previewing */}
  {isHovered && <span className={styles.mutedBadge}>🔇 Preview</span>}
</Link>

      {/* Card Body */}
      <div className={styles.body}>
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
              <span className="badge badge-partner">Partner</span>
            )}
          </div>
        </div>

        {/* Title & Tags */}
        <Link to={`/reel/${reel._id}`}>
          <h3 className={styles.title}>{reel.title}</h3>
        </Link>

        {reel.cuisine && (
          <span className={styles.cuisineTag}>{reel.cuisine}</span>
        )}

        {reel.restaurant?.name && (
          <p className={styles.restaurant}>📍 {reel.restaurant.name}{reel.restaurant.city ? `, ${reel.restaurant.city}` : ''}</p>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
            title="Like"
          >
            {isLiked ? '❤️' : '🤍'} {formatCount(reel.likes?.length)}
          </button>

          <button
            className={`${styles.actionBtn} ${isSaved ? styles.saved : ''}`}
            onClick={handleSave}
            title="Save"
          >
            {isSaved ? '🔖' : '📑'} {formatCount(reel.saves?.length)}
          </button>

          <button
            className={styles.actionBtn}
            onClick={() => setShowComments(s => !s)}
            title="Comments"
          >
            💬 {formatCount(reel.comments?.length)}
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className={styles.comments}>
            <div className={styles.commentList}>
              {reel.comments?.length === 0 && (
                <p className={styles.noComments}>No comments yet. Be first!</p>
              )}
              {reel.comments?.slice(-3).map((c) => (
                <div key={c._id} className={styles.comment}>
                  <span className={styles.commentUser}>{c.user?.username || 'User'}</span>
                  <span>{c.text}</span>
                </div>
              ))}
              {reel.comments?.length > 3 && (
                <Link to={`/reel/${reel._id}`} className={styles.seeAll}>
                  See all {reel.comments.length} comments →
                </Link>
              )}
            </div>
            <form onSubmit={handleComment} className={styles.commentForm}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={300}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '...' : 'Post'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
