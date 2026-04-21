const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Single storage that handles BOTH video and image fields ──────────────
// We detect the fieldname to pick folder + resource_type dynamically.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.fieldname === 'video';
    return {
      folder:        isVideo ? 'inex/videos' : 'inex/thumbnails',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'webm', 'avi']
        : ['jpg', 'jpeg', 'png', 'webp'],
      transformation: isVideo
        ? [{ quality: 'auto' }]
        : [{ width: 600, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'webp' }],
      public_id: `${isVideo ? 'reel' : 'thumb'}_${req.user._id}_${Date.now()}`,
    };
  },
});

// One multer instance with fields() — handles video + optional thumbnail in
// a single multipart pass with correct resource_type per field.
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB overall
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) return cb(null, true);
    if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error(`Invalid file type for field "${file.fieldname}"`), false);
  },
});

// Expose the .fields() middleware directly — used in partner routes
const uploadFields = upload.fields([
  { name: 'video',     maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

module.exports = { cloudinary, uploadFields };
