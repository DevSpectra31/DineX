const express = require('express');
const router = express.Router();
const {
  getFeed,
  getReelById,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
} = require('../controllers/reel.controller');
const { protect, optionalAuth } = require('../Middlewares/auth.middleware');

router.get('/', getFeed);
router.get('/:id',optionalAuth, getReelById);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;
