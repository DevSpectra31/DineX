import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import styles from './Explore.module.css';

const CUISINES = ['All','Indian','Italian','Chinese','Mexican','American','Japanese','Mediterranean'];

export default function Explore() {
  const [videos, setVideos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');
  const [cuisine, setCuisine]   = useState('All');
  const [page, setPage]         = useState(1);
  const [playing, setPlaying]   = useState(null); // pexelsId of currently playing video

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let res;
      if (query) {
        res = await api.get(`/explore/videos?query=${query}&page=${page}`);
      } else if (cuisine !== 'All') {
        res = await api.get(`/explore/categories?cuisine=${cuisine}&page=${page}`);
      } else {
        res = await api.get(`/explore/popular?page=${page}`);
      }
      setVideos(page === 1 ? res.data.videos : v => [...v, ...res.data.videos]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page and fetch when cuisine or query changes
  useEffect(() => {
    setPage(1);
    setVideos([]);
  }, [cuisine, query]);

  useEffect(() => {
    fetchVideos();
  }, [page, cuisine]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setVideos([]);
    fetchVideos();
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>🔍 Explore Food Videos</h1>
        <p>Powered by Pexels — royalty-free food content</p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search: biryani, sushi, tacos..."
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Cuisine pills */}
        <div className={styles.filters}>
          {CUISINES.map(c => (
            <button
              key={c}
              className={`${styles.pill} ${cuisine === c ? styles.active : ''}`}
              onClick={() => setCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && videos.length === 0 && <div className="spinner" />}

      <div className={styles.grid}>
        {videos.map(v => (
          <div
            key={v.pexelsId}
            className={styles.card}
            onMouseEnter={() => setPlaying(v.pexelsId)}
            onMouseLeave={() => setPlaying(null)}
          >
            {playing === v.pexelsId ? (
              <video
                src={v.videoUrl}
                autoPlay muted loop playsInline
                className={styles.video}
              />
            ) : (
              <img src={v.thumbnailUrl} alt={v.title} className={styles.thumb} />
            )}

            <div className={styles.overlay}>
              <p className={styles.author}>📹 {v.uploadedBy?.username}</p>
              {v.cuisine && <span className={styles.tag}>{v.cuisine}</span>}
              {v.duration && <span className={styles.duration}>⏱ {v.duration}s</span>}
            </div>

            {playing === v.pexelsId && (
              <span className={styles.mutedBadge}>🔇 Preview</span>
            )}
          </div>
        ))}
      </div>

      {/* Load more */}
      {!loading && videos.length > 0 && (
        <button
          className={`btn btn-ghost ${styles.loadMore}`}
          onClick={() => setPage(p => p + 1)}
        >
          Load More
        </button>
      )}
      {loading && videos.length > 0 && <div className="spinner" />}
    </main>
  );
}