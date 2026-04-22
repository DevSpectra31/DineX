import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import PhoneBottomNav from '../../components/reels/PhoneBottomNav'
import { BookmarkIcon } from '../../components/reels/ReelIcons'
import '../../styles/ShortVideoUI.css'

const Saved = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/food/', { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data?.fooditems)) {
          setVideos(response.data.fooditems)
        }
      })
      .catch((error) => {
        console.error('API Error:', error)
      })
  }, [])

  const savedVideos = useMemo(
    () => videos.filter((item) => Number(item.savesCount || 0) > 0),
    [videos]
  )

  return (
    <div className="short-video-screen">
      <main className="phone-shell" aria-label="Saved videos">
        <section className="saved-stage">
          <div className="saved-header">
            <h1>Saved</h1>
            <p>{savedVideos.length} items</p>
          </div>

          {savedVideos.length === 0 && (
            <div className="saved-empty">No saved videos yet.</div>
          )}

          <div className="saved-list">
            {savedVideos.map((item) => (
              <article className="saved-card" key={item._id}>
                <video className="saved-thumb" src={item.video} muted loop playsInline />
                <div className="saved-info">
                  <p className="saved-title">{item.name || 'Food Video'}</p>
                  <p className="saved-desc">{item.description || 'No description added.'}</p>
                </div>
                <div className="saved-count">
                  <BookmarkIcon />
                  <span>{item.savesCount || 0}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <PhoneBottomNav />
      </main>
    </div>
  )
}

export default Saved
