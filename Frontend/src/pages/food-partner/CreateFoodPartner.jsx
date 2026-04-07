import React, { useEffect, useState } from 'react'
import '../../styles/CreateFoodPartner.css'

function CreateFoodPartner() {
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const onSubmit = (e)=>{
    e.preventDefault();
    const fromdata = new FormData();
    fromdata.append('name',name)
    fromdata.append('description',)
  }
  useEffect(() => {
    if (!videoFile) {
      setVideoPreview('')
      return undefined
    }

    const objectUrl = URL.createObjectURL(videoFile)
    setVideoPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [videoFile])

  const handleVideoChange = (event) => {
    const file = event.target.files && event.target.files[0]
    setVideoFile(file || null)
  }

  return (
    <div className="create-food-page">
      <div className="create-food-shell">
        <div className="create-food-card">
          <header className="create-food-header">
            <span className="create-food-badge">New Dish</span>
            <h1>Create Food</h1>
            <p>Share a short video, name, and description to publish your dish.</p>
          </header>

          <form className="create-food-form">
            <label className="create-food-field span-2">
              <span>Food Video</span>
              <div className="create-food-upload">
                <input
                  className="create-food-file"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                <div className="create-food-upload-content">
                  <div className="create-food-upload-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" focusable="false">
                      <path
                        d="M16 12.5h10.2l2.3 3H34a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6v-13a6 6 0 0 1 6-6h2z"
                        fill="currentColor"
                        opacity="0.12"
                      />
                      <path
                        d="M22.4 22.6a1.2 1.2 0 0 0-1.8 1v6.8a1.2 1.2 0 0 0 1.8 1l5.8-3.4a1.2 1.2 0 0 0 0-2l-5.8-3.4z"
                        fill="currentColor"
                      />
                      <path
                        d="M16 12.5h10.2l2.3 3H34a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6v-13a6 6 0 0 1 6-6h2z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <strong>{videoFile ? 'Replace video' : 'Tap to upload'}</strong>
                  <span>MP4, MOV, or WEBM up to 60s</span>
                </div>
              </div>
              {videoPreview ? (
                <div className="create-food-preview">
                  <video
                    className="create-food-preview-video"
                    src={videoPreview}
                    controls
                    playsInline
                    muted
                  />
                  <div className="create-food-preview-meta">
                    <span>{videoFile?.name}</span>
                    <span>{Math.round((videoFile?.size || 0) / 1024)} KB</span>
                  </div>
                </div>
              ) : null}
            </label>

            <label className="create-food-field">
              <span>Food Name</span>
              <input className="create-food-input" type="text" placeholder="e.g. Spicy Paneer Bowl" />
            </label>

            <label className="create-food-field">
              <span>Description</span>
              <textarea
                className="create-food-input create-food-textarea"
                rows="4"
                placeholder="Describe ingredients, spice level, and best pairings."
              />
            </label>

            <button className="create-food-button span-2" type="submit">
              Create Food
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateFoodPartner
