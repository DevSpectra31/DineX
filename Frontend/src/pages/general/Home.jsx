import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import '../../styles/ReelsContainer.css'
import { useNavigate } from 'react-router-dom';
const Home = () => {

    const [videos, setVideos] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [failedVideoIds, setFailedVideoIds] = useState([])
    const videoRefs = useRef(new Map())
    const containerRef = useRef(null)
    const scrollTimeoutRef = useRef(null)
const router = useNavigate();
    const visibleVideos = videos.filter((item) => !failedVideoIds.includes(item._id))

    useEffect(() => {
        axios.get("http://localhost:5000/api/food/", { withCredentials: true })
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data.fooditems) {
                    console.log("First video item:", response.data.fooditems[0]);
                    setVideos(response.data.fooditems)
                }
            })
            .catch(error => {
                console.error("API Error:", error)
            })
    }, [])

    const setVideoRef = (id) => (el) => {
        if (!el) {
            videoRefs.current.delete(id)
            return
        }
        videoRefs.current.set(id, el)
    }

    const handleScroll = (e) => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

        scrollTimeoutRef.current = setTimeout(() => {
            const container = containerRef.current
            if (!container || visibleVideos.length === 0) return

            const scrollTop = container.scrollTop
            const itemHeight = container.offsetHeight
            const index = Math.max(0, Math.min(Math.round(scrollTop / itemHeight), visibleVideos.length - 1))

            setCurrentIndex(index)
            container.scrollTo({
                top: index * itemHeight,
                behavior: 'smooth',
            })
        }, 100)
    }

    const handleKeyDown = (e) => {
        if (visibleVideos.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const nextIndex = Math.min(currentIndex + 1, visibleVideos.length - 1)
            scrollToIndex(nextIndex)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prevIndex = Math.max(currentIndex - 1, 0)
            scrollToIndex(prevIndex)
        }
    }

    const scrollToIndex = (index) => {
        const container = containerRef.current
        if (!container || visibleVideos.length === 0) return

        const safeIndex = Math.max(0, Math.min(index, visibleVideos.length - 1))

        setCurrentIndex(safeIndex)
        container.scrollTo({
            top: safeIndex * container.offsetHeight,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        containerRef.current?.focus()

        return () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        visibleVideos.forEach((item, index) => {
            const video = videoRefs.current.get(item._id)
            if (!video) return

            if (index === currentIndex) {
                const playPromise = video.play()
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("Play error:", error))
                }
            } else {
                video.pause()
                if (video.currentTime !== 0) {
                    video.currentTime = 0
                }
            }
        })
    }, [currentIndex, visibleVideos])

    useEffect(() => {
        if (visibleVideos.length === 0) {
            setCurrentIndex(0)
            return;
        }

        if (currentIndex >= visibleVideos.length) {
            setCurrentIndex(visibleVideos.length - 1)
        }
    }, [currentIndex, visibleVideos.length])

    const handleVideoError = (id, event) => {
        console.error("Video error:", id, event)

        videoRefs.current.delete(id)
        setFailedVideoIds((prev) => (
            prev.includes(id) ? prev : [...prev, id]
        ))
    }

    return (
        <div
            ref={containerRef}
            className="reels-page"
            tabIndex={0}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
        >
            <div className="reels-feed" role="list">
                {visibleVideos.length === 0 && (
                    <section className="reel" role="listitem">
                        <div className="reel-overlay">
                            <div className="reel-overlay-gradient" aria-hidden="true"></div>
                            <div className="reel-content">
                                <p className="reel-description">
                                    No playable videos are available right now.
                                </p>
                            </div>
                        </div>
                    </section>
                )}
                {visibleVideos.map((item, index) => (
                    <section 
                        key={item._id} 
                        className="reel" 
                        role="listitem"
                    >
                        <video
                            ref={setVideoRef(item._id)}
                            className="reel-video"
                            src={item.video}
                            autoPlay={index === currentIndex}
                            muted
                            playsInline
                            loop
                            preload={index === currentIndex ? "auto" : "metadata"}
                            onLoadedMetadata={() => console.log("Video loaded:", item._id)}
                            onError={(e) => handleVideoError(item._id, e)}
                        />

                        <div className="reel-overlay">
                            <div className="reel-overlay-gradient" aria-hidden="true"></div>
                            <div className="reel-content">
                                <p className="reel-description" title={item.description}>
                                    {item.description}
                                </p>
                                <div className="reel-buttons">
                                    <Link className="reel-btn visit-btn" to="/food-partner/profile" aria-label="Visit store">
                                        🏪 Visit Store
                                    </Link>
                                    <button className="reel-btn share-btn" aria-label="Share">
                                        📤 Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}

export default Home
