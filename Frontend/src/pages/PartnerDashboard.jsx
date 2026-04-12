import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './PartnerDashboard.module.css';

const CUISINES = ['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Japanese', 'Mediterranean', 'Other'];

function StatCard({ icon, label, value }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statValue}>{Number(value || 0).toLocaleString()}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

const emptyForm = {
  title: '', description: '', cuisine: 'Other',
  tags: '', restaurantName: '', restaurantCity: '',
};

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats]         = useState(null);
  const [reels, setReels]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]             = useState({ type: '', text: '' });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/partner/dashboard');
      setStats(res.data.stats);
      setReels(res.data.reels);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleUpload = async e => {
    e.preventDefault();
    if (!videoFile) return setMsg({ type: 'error', text: 'Please select a video file.' });
    if (!form.title.trim()) return setMsg({ type: 'error', text: 'Please enter a title.' });

    setUploading(true);
    setUploadProgress(0);
    setMsg({ type: '', text: '' });

    try {
      const data = new FormData();
      // Append all text fields
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
      // Append files with correct field names matching backend
      data.append('video', videoFile);
      if (thumbFile) data.append('thumbnail', thumbFile);

      await api.post('/partner/reels', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(pct);
        },
      });

      setMsg({ type: 'success', text: '✅ Reel uploaded successfully!' });
      setShowUpload(false);
      setForm(emptyForm);
      setVideoFile(null);
      setThumbFile(null);
      setUploadProgress(0);
      fetchDashboard();
    } catch (err) {
      setMsg({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reel? This cannot be undone.')) return;
    try {
      await api.delete(`/partner/reels/${id}`);
      setReels(r => r.filter(x => x._id !== id));
      setMsg({ type: 'success', text: 'Reel deleted.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const togglePublish = async (reel) => {
    try {
      const payload = {
        title: reel.title,
        description: reel.description,
        cuisine: reel.cuisine,
        tags: (reel.tags || []).join(','),
        isPublished: !reel.isPublished,
      };
      await api.put(`/partner/reels/${reel._id}`, payload);
      setReels(rs => rs.map(r =>
        r._id === reel._id ? { ...r, isPublished: !r.isPublished } : r
      ));
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Partner Dashboard</h1>
          <p className={styles.sub}>Welcome back, <strong>{user?.username}</strong> 👋</p>
        </div>
        <button
          className={`btn ${showUpload ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => { setShowUpload(s => !s); setMsg({ type: '', text: '' }); }}
        >
          {showUpload ? '✕ Cancel' : '+ Upload Reel'}
        </button>
      </div>

      {/* Message banner */}
      {msg.text && (
        <div className={`${styles.msgBanner} ${msg.type === 'error' ? styles.msgError : styles.msgSuccess}`}>
          {msg.text}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className={styles.statsGrid}>
          <StatCard icon="🎬" label="Total Reels"    value={stats.totalReels}    />
          <StatCard icon="👁"  label="Total Views"    value={stats.totalViews}    />
          <StatCard icon="❤️" label="Total Likes"    value={stats.totalLikes}    />
          <StatCard icon="🔖" label="Total Saves"    value={stats.totalSaves}    />
          <StatCard icon="💬" label="Total Comments" value={stats.totalComments} />
        </div>
      )}

      {/* Upload form */}
      {showUpload && (
        <div className={styles.uploadCard}>
          <h2>📤 Upload New Reel</h2>
          <p className={styles.uploadNote}>
            Videos are uploaded to Cloudinary CDN. Make sure your <code>.env</code> has valid Cloudinary credentials.
          </p>

          <form onSubmit={handleUpload} className={styles.uploadForm}>
            {/* Video file - required */}
            <div className={styles.fileDropZone}>
              <label htmlFor="videoInput" className={styles.fileLabel}>
                {videoFile ? (
                  <span className={styles.fileSelected}>🎬 {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                ) : (
                  <span>🎬 Click to select video <em>(MP4, MOV, WebM — max 100 MB)</em></span>
                )}
              </label>
              <input
                id="videoInput"
                type="file"
                accept="video/mp4,video/mov,video/webm,video/avi,video/*"
                onChange={e => setVideoFile(e.target.files[0] || null)}
                className={styles.hiddenInput}
              />
            </div>

            {/* Thumbnail - optional */}
            <div className={styles.fileDropZone} style={{ borderStyle: 'dashed' }}>
              <label htmlFor="thumbInput" className={styles.fileLabel}>
                {thumbFile ? (
                  <span className={styles.fileSelected}>🖼️ {thumbFile.name}</span>
                ) : (
                  <span>🖼️ Click to select thumbnail <em>(optional — JPG, PNG, WebP)</em></span>
                )}
              </label>
              <input
                id="thumbInput"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={e => setThumbFile(e.target.files[0] || null)}
                className={styles.hiddenInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label>Title *</label>
                <input
                  name="title" required
                  value={form.title} onChange={handleChange}
                  placeholder="e.g. Best Butter Chicken in Mumbai"
                />
              </div>
              <div className={styles.field}>
                <label>Cuisine</label>
                <select name="cuisine" value={form.cuisine} onChange={handleChange}>
                  {CUISINES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea
                name="description" rows={3}
                value={form.description} onChange={handleChange}
                placeholder="Describe your dish or restaurant..."
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label>Restaurant Name</label>
                <input name="restaurantName" value={form.restaurantName} onChange={handleChange} placeholder="Spice Garden" />
              </div>
              <div className={styles.field}>
                <label>City</label>
                <input name="restaurantCity" value={form.restaurantCity} onChange={handleChange} placeholder="Mumbai" />
              </div>
            </div>

            <div className={styles.field}>
              <label>Tags <em>(comma-separated)</em></label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="biryani, spicy, must-try" />
            </div>

            {/* Upload progress bar */}
            {uploading && (
              <div className={styles.progressWrap}>
                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                <span>{uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Processing on Cloudinary...'}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={uploading}
            >
              {uploading ? `Uploading... ${uploadProgress}%` : '🚀 Publish Reel'}
            </button>
          </form>
        </div>
      )}

      {/* Reels list */}
      <div className={styles.reelsSection}>
        <h2>Your Reels <span className={styles.count}>({reels.length})</span></h2>

        {reels.length === 0 ? (
          <div className={styles.empty}>
            <span>🎬</span>
            <p>No reels yet. Click <strong>+ Upload Reel</strong> to get started!</p>
          </div>
        ) : (
          <div className={styles.reelsList}>
            {reels.map(reel => (
              <div key={reel._id} className={styles.reelRow}>
                <div className={styles.reelThumb}>
                  {reel.thumbnailUrl
                    ? <img src={reel.thumbnailUrl} alt="" />
                    : <video src={reel.videoUrl} className={styles.videoThumb} />
                  }
                </div>

                <div className={styles.reelInfo}>
                  <h3>{reel.title}</h3>
                  <p className={styles.reelMeta}>
                    <span>👁 {reel.views}</span>
                    <span>❤️ {reel.likes?.length || 0}</span>
                    <span>🔖 {reel.saves?.length || 0}</span>
                    <span>💬 {reel.comments?.length || 0}</span>
                    <span className={reel.isPublished ? styles.pub : styles.draft}>
                      {reel.isPublished ? '✅ Published' : '📝 Draft'}
                    </span>
                  </p>
                  {reel.videoUrl && (
                    <a href={reel.videoUrl} target="_blank" rel="noreferrer" className={styles.cdnLink}>
                      🔗 Cloudinary URL
                    </a>
                  )}
                </div>

                <div className={styles.reelActions}>
                  <button className="btn btn-ghost" onClick={() => togglePublish(reel)}>
                    {reel.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className={`btn ${styles.deleteBtn}`} onClick={() => handleDelete(reel._id)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
