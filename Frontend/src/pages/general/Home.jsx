import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import PhoneBottomNav from '../../components/reels/PhoneBottomNav'
import { BookmarkIcon, CommentIcon, HeartIcon } from '../../components/reels/ReelIcons'
import '../../styles/ShortVideoUI.css'
import { Navigate } from 'react-router-dom'

const getCount = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key]
    if (typeof value === 'number') return value
  }

  return 0
}

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([])
  const [failedVideoIds, setFailedVideoIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [readyVideoIds, setReadyVideoIds] = useState([])
  const wheelLockedRef = useRef(false)
  const touchStartYRef = useRef(0)
  const videoRefs = useRef(new Map())
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/food/', { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data?.fooditems)) {
            console.log(response.data)
          setVideos(response.data.fooditems)
        }
      })
      .catch((error) => {
if (error.response?.status === 401) {
        navigate("/user/login");
}
      })
  }, [])

  const visibleVideos = useMemo(
    () => videos.filter((item) => !failedVideoIds.includes(item._id)),
    [failedVideoIds, videos]
  )

  const handleVideoError = (id) => {
    setFailedVideoIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setReadyVideoIds((prev) => prev.filter((videoId) => videoId !== id))
  }

  const handleVideoReady = (id) => {
    setReadyVideoIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const setVideoRef = (id) => (element) => {
    if (!element) {
      videoRefs.current.delete(id)
      return
    }

    videoRefs.current.set(id, element)
  }

  const goToIndex = (index) => {
    if (visibleVideos.length === 0) return
    const safeIndex = Math.max(0, Math.min(index, visibleVideos.length - 1))
    if (safeIndex === currentIndex) return

    setCurrentIndex(safeIndex)
  }

  const handleWheel = (event) => {
    if (visibleVideos.length <= 1) return

   // event.preventDefault()
    if (wheelLockedRef.current) return

    wheelLockedRef.current = true
    if (event.deltaY > 0) {
      goToIndex(currentIndex + 1)
    } else if (event.deltaY < 0) {
      goToIndex(currentIndex - 1)
    }

    window.setTimeout(() => {
      wheelLockedRef.current = false
    }, 650)
  }

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY || 0
  }

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0]?.clientY || 0
    const diff = touchStartYRef.current - endY

    if (Math.abs(diff) < 36) return
    if (diff > 0) {
      goToIndex(currentIndex + 1)
    } else {
      goToIndex(currentIndex - 1)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') goToIndex(currentIndex + 1)
    if (event.key === 'ArrowUp') goToIndex(currentIndex - 1)
  }

  useEffect(() => {
    if (visibleVideos.length === 0) {
      setCurrentIndex(0)
      return
    }

    if (currentIndex > visibleVideos.length - 1) {
      setCurrentIndex(visibleVideos.length - 1)
    }
  }, [currentIndex, visibleVideos.length])

  useEffect(() => {
    visibleVideos.forEach((item, index) => {
      const video = videoRefs.current.get(item._id)
      if (!video) return

      if (index === currentIndex) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [currentIndex, visibleVideos])
  async function Likevideo(item) {
  const response = await axios.post(
    'http://localhost:5000/api/food/likes',
    { foodId: item._id },
    { withCredentials: true }
  );

  const action = response.data?.action;

  setVideos((prev) =>
    prev.map((v) => {
      if (v._id !== item._id) return v;

      if (action === "liked") {
        return {
          ...v,
          likeCount: (v.likeCount || 0) + 1,
        };
      }

      if (action === "unliked") {
        return {
          ...v,
          likeCount: Math.max(0, (v.likeCount || 0) - 1),
        };
      }

      return v;
    })
  );
}
async function Savideo(item) {
  const response = await axios.post(
    'http://localhost:5000/api/food/save',
    { foodId: item._id },
    { withCredentials: true }
  );

  const action = response.data?.action;

  setVideos((prev) =>
    prev.map((v) => {
      if (v._id !== item._id) return v;

      if (action === "saved") {
        return {
          ...v,
          savesCount: (v.savesCount || 0) + 1,
        };
      }

      if (action === "unsaved") {
        return {
          ...v,
          savesCount: Math.max(0, (v.savesCount || 0) - 1),
        };
      }

      return v;
    })
  );
  }
  return (
    <div className="short-video-screen">
      <main className="phone-shell video-shell" aria-label="Video feed">
        <section
          className="video-stage"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="stage-track"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {visibleVideos.length === 0 && (
              <section className="stage-slide">
                <div className="stage-fallback">No video available</div>
              </section>
            )}

            {visibleVideos.map((item) => {
              const isReady = readyVideoIds.includes(item._id)

              return (
                <section className="stage-slide" key={item._id}>
                  <video
                    ref={setVideoRef(item._id)}
                    className="stage-video"
                    src={item.video}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    onCanPlay={() => handleVideoReady(item._id)}
                    onLoadedData={() => handleVideoReady(item._id)}
                    onError={() => handleVideoError(item._id)}
                  />

                  {!isReady && (
                    <div className="stage-loading" aria-hidden="true">
                      <span>Loading video...</span>
                    </div>
                  )}

                  <div className="stage-gradient" aria-hidden="true" />

                  <aside className="stage-actions" aria-label="Video actions">
                    <button onClick={()=>Likevideo(item)} type="button" className="stage-action-btn">
                      <HeartIcon />
                      <span>Likes: {getCount(item, ['LikeCount', 'likesCount', 'likes','likeCount'])}</span>
                    </button>
                    <button onClick={()=>(Savideo(item))} type="button" className="stage-action-btn">
                      <BookmarkIcon />
                      <span>Save: {getCount(item, ['savesCount', 'saveCount', 'savedCount'])}</span>
                    </button>
                    <button type="button" className="stage-action-btn">
                      <CommentIcon />
                      <span>Comment: {getCount(item, ['commentsCount', 'commentCount', 'comments'])}</span>
                    </button>
                  </aside>

                  <div className="stage-content">
                    <p className="stage-description" title={item?.description}>
                      {item?.description || 'No video available'}
                    </p>
                    <Link className="stage-store-btn" to="/food-partner/profile">
                      visit store
                    </Link>
                  </div>
                </section>
              )
            })}
          </div>
        </section>

        <PhoneBottomNav />
      </main>
    </div>
  )
}

export default Home;
