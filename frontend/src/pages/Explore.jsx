import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import styles from './Explore.module.css';

const CUISINES = ['All', 'Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Japanese', 'Mediterranean'];

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <video
          src={video.videoUrl}
          autoPlay
          controls
          className={styles.modalVideo}
          poster={video.thumbnailUrl}
        />

        <div className={styles.modalInfo}>
          <div className={styles.modalMeta}>
            <div className={styles.modalAuthor}>
              <div className={styles.modalAvatar}>
                {video.uploadedBy?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className={styles.modalName}>{video.uploadedBy?.username}</p>
                <p className={styles.modalSource}>via Pexels</p>
              </div>
            </div>

            <div className={styles.modalTags}>
              {video.cuisine && (
                <span className={styles.tag}>{video.cuisine}</span>
              )}
              {video.duration && (
                <span className={styles.durationTag}>⏱ {video.duration}s</span>
              )}
            </div>
          </div>

          <p className={styles.modalTitle}>{video.title}</p>

          
            href={`https://www.pexels.com/video/${video.pexelsId}/`}
            target="_blank"
            rel="noreferrer"
            className={styles.pexelsLink}
            >
            View on Pexels ↗
        </div>

      </div>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ video, onPlay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay(video)}
    >
      {hovered ? (
        <video
          src={video.videoUrl}
          autoPlay muted loop playsInline
          className={styles.video}
        />
      ) : (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={styles.thumb}
        />
      )}

      <div className={styles.overlay}>
        <p className={styles.author}>📹 {video.uploadedBy?.username}</p>
        <div className={styles.overlayBottom}>
          {video.cuisine && (
            <span className={styles.tag}>{video.cuisine}</span>
          )}
          {video.duration && (
            <span className={styles.duration}>⏱ {video.duration}s</span>
          )}
        </div>
      </div>

      {hovered && (
        <div className={styles.playOverlay}>
          <div className={styles.playBtn}>▶</div>
          <span>Click to play</span>
        </div>
      )}

      {hovered && (
        <span className={styles.mutedBadge}>🔇 Preview</span>
      )}
    </div>
  );
}

// ─── Main Explore Page ────────────────────────────────────────────────────────
export default function Explore() {
  const [videos, setVideos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [query, setQuery]             = useState('');
  const [inputVal, setInputVal]       = useState('');
  const [cuisine, setCuisine]         = useState('All');
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const fetchVideos = useCallback(async (pageNum, cuisineVal, queryVal) => {
    setLoading(true);
    try {
      let res;
      if (queryVal) {
        res = await api.get(`/explore/videos?query=${encodeURIComponent(queryVal)}&page=${pageNum}`);
      } else if (cuisineVal !== 'All') {
        res = await api.get(`/explore/categories?cuisine=${cuisineVal}&page=${pageNum}`);
      } else {
        res = await api.get(`/explore/popular?page=${pageNum}`);
      }
      const newVideos = res.data.videos || [];
      setVideos(prev => pageNum === 1 ? newVideos : [...prev, ...newVideos]);
      setHasMore(newVideos.length === 12);
    } catch (err) {
      console.error('Explore fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(1, 'All', '');
  }, [fetchVideos]);

  const handleCuisine = (c) => {
    setCuisine(c);
    setPage(1);
    setQuery('');
    setInputVal('');
    fetchVideos(1, c, '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setQuery(inputVal);
    setCuisine('All');
    setPage(1);
    fetchVideos(1, 'All', inputVal);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage, cuisine, query);
  };

  return (
    <main className={styles.page}>

      <div className={styles.header}>
        <h1>🔍 Explore Food Videos</h1>
        <p>Powered by Pexels — hover to preview, click to watch</p>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search: biryani, sushi, tacos..."
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {query && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setInputVal('');
                setQuery('');
                fetchVideos(1, cuisine, '');
              }}
            >
              ✕ Clear
            </button>
          )}
        </form>

        <div className={styles.filters}>
          {CUISINES.map(c => (
            <button
              key={c}
              className={`${styles.pill} ${cuisine === c && !query ? styles.active : ''}`}
              onClick={() => handleCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {query && (
          <p className={styles.searchLabel}>
            Showing results for <strong>"{query}"</strong>
          </p>
        )}
      </div>

      {loading && videos.length === 0 && <div className="spinner" />}

      {!loading && videos.length === 0 && (
        <div className={styles.empty}>
          <span>🎬</span>
          <p>No videos found. Try a different search.</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className={styles.grid}>
          {videos.map((v, i) => (
            <VideoCard
              key={`${v.pexelsId}-${i}`}
              video={v}
              onPlay={setActiveVideo}
            />
          ))}
        </div>
      )}

      {!loading && hasMore && videos.length > 0 && (
        <button
          className={`btn btn-ghost ${styles.loadMore}`}
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}

      {loading && videos.length > 0 && <div className="spinner" />}

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

    </main>
  );
}