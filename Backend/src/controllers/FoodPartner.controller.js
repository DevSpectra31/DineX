const Reel = require('../models/Reel');
const { cloudinary, uploadFields } = require('../services/cloudinary.js');

// Re-export multer middleware for use in routes
exports.upload = uploadFields;

// ─── Helper: delete a Cloudinary asset by its secure URL ─────────────────
const deleteFromCloudinary = async (url, resourceType = 'image') => {
  if (!url) return;
  try {
    // URL pattern: .../upload/v<ver>/<folder>/<public_id>.<ext>
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return;
    // Drop the version segment (v<number>) then strip extension
    const afterUpload = parts.slice(uploadIdx + 1).join('/');
    const noVersion   = afterUpload.replace(/^v\d+\//, '');
    const publicId    = noVersion.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

// ─── GET /api/partner/dashboard ──────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const reels = await Reel.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    const stats = {
      totalReels:    reels.length,
      totalViews:    reels.reduce((acc, r) => acc + r.views, 0),
      totalLikes:    reels.reduce((acc, r) => acc + r.likes.length, 0),
      totalSaves:    reels.reduce((acc, r) => acc + r.saves.length, 0),
      totalComments: reels.reduce((acc, r) => acc + r.comments.length, 0),
    };
    res.json({ success: true, stats, reels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/partner/reels ─────────────────────────────────────────────
// req.files is set by multer .fields():
//   req.files['video'][0]     → video file info
//   req.files['thumbnail'][0] → thumbnail file info (optional)
exports.uploadReel = async (req, res) => {
  try {
    const { title, description, cuisine, tags, restaurantName, restaurantAddress, restaurantCity } = req.body;

    if (!req.files || !req.files['video'] || !req.files['video'][0]) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    const videoFile    = req.files['video'][0];
    const thumbFile    = req.files['thumbnail']?.[0];

    // multer-storage-cloudinary sets .path = the secure Cloudinary URL
    const videoUrl         = videoFile.path;
    const videoPublicId    = videoFile.filename;       // public_id on Cloudinary
    const thumbnailUrl     = thumbFile?.path     || '';
    const thumbnailPublicId = thumbFile?.filename || '';

    const reel = await Reel.create({
      title,
      description,
      videoUrl,
      videoPublicId,
      thumbnailUrl,
      thumbnailPublicId,
      uploadedBy: req.user._id,
      cuisine,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      restaurant: { name: restaurantName, address: restaurantAddress, city: restaurantCity },
    });

    res.status(201).json({ success: true, reel });
  } catch (err) {
    console.error('uploadReel error:', err);
    res.status(400).json({ error: err.message });
  }
};

// ─── PUT /api/partner/reels/:id ──────────────────────────────────────────
exports.updateReel = async (req, res) => {
  try {
    const reel = await Reel.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!reel) return res.status(404).json({ error: 'Reel not found or not authorized.' });

    const { title, description, cuisine, tags, isPublished } = req.body;
    Object.assign(reel, {
      title,
      description,
      cuisine,
      isPublished: isPublished !== undefined ? isPublished : reel.isPublished,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : reel.tags,
    });

    await reel.save();
    res.json({ success: true, reel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── DELETE /api/partner/reels/:id ───────────────────────────────────────
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id });
    if (!reel) return res.status(404).json({ error: 'Reel not found or not authorized.' });

    // Delete from Cloudinary in background — don't block the response
    Promise.all([
      deleteFromCloudinary(reel.videoUrl, 'video'),
      reel.thumbnailUrl ? deleteFromCloudinary(reel.thumbnailUrl, 'image') : Promise.resolve(),
    ]).catch(console.error);

    res.json({ success: true, message: 'Reel deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
