const express = require('express');
const router = express.Router();
const {
  upload,
  getDashboard,
  uploadReel,
  updateReel,
  deleteReel,
} = require('../controllers/FoodPartner.controller.js');
const { protect, restrictTo } = require('../Middlewares/auth.middleware.js');

// All partner routes require authentication + partner/admin role
router.use(protect, restrictTo('partner', 'admin'));

router.get('/dashboard', getDashboard);

// upload is now the Cloudinary-backed two-pass multer middleware
router.post('/reels', upload, uploadReel);
router.put('/reels/:id', updateReel);
router.delete('/reels/:id', deleteReel);

module.exports = router;
