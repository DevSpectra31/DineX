import React, { useEffect, useState, useCallback } from 'react';
import { useReels } from '../context/ReelContext';
import { useIntersection } from '../hooks/useUtils';
import ReelCard from '../components/reels/ReelCard';
import styles from './Feed.module.css';

const CUISINES = ['All', 'Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Japanese', 'Mediterranean', 'Other'];

export default function Feed() {
  const { reels, loading, page, totalPages, fetchReels } = useReels();
  const [activeCuisine, setActiveCuisine] = useState('All');

  // Initial load and on cuisine change — always reset to page 1
useEffect(() => {
    const cuisine = activeCuisine === 'All' ? '' : activeCuisine;
    fetchReels(1, cuisine);
  }, [activeCuisine, fetchReels]);
  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      const cuisine = activeCuisine === 'All' ? '' : activeCuisine;
      fetchReels(page + 1, cuisine);
    }
  }, [page, totalPages, loading, activeCuisine, fetchReels]);

  const loaderRef = useIntersection(loadMore);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Discover Food Reels 🍜</h1>
        <p className={styles.sub}>Short-form videos from the best food partners around you</p>

        <div className={styles.filters}>
          {CUISINES.map(c => (
            <button
              key={c}
              className={`${styles.pill} ${activeCuisine === c ? styles.active : ''}`}
              onClick={() => setActiveCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading initial fetch */}
      {loading && reels.length === 0 && <div className="spinner" />}

      {/* Empty state */}
      {!loading && reels.length === 0 && (
        <div className={styles.empty}>
          <span>🍽️</span>
          <p>No reels found. Check back soon!</p>
        </div>
      )}

      {/* Grid */}
      {reels.length > 0 && (
        <div className={styles.grid}>
          {reels.map(reel => (
            <ReelCard key={reel._id} reel={reel} />
          ))}
        </div>
      )}

      {/* Infinite scroll spinner */}
      {loading && reels.length > 0 && <div className="spinner" />}

      {/* Sentinel for intersection observer */}
      {page < totalPages && !loading && (
        <div ref={loaderRef} className={styles.sentinel} />
      )}

      {page >= totalPages && reels.length > 0 && (
        <p className={styles.end}>You've reached the end 🎉</p>
      )}
    </main>
  );
}
