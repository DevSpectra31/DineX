import React, { useRef, useEffect } from 'react';
import '../styles/VideoReel.css';

function VideoReel({ video, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleVisitStore = () => {
    // Navigate to store or perform action
    console.log('Visit store:', video.storeId);
  };

  return (
    <div className="video-reel">
      <video
        ref={videoRef}
        className="reel-video"
        src={video.videoUrl}
        muted
        loop
        playsInline
      />
      
      <div className="reel-overlay">
        <div className="reel-content">
          <p className="reel-description">{video.description}</p>
          <button className="reel-button" onClick={handleVisitStore}>
            Visit Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoReel;
