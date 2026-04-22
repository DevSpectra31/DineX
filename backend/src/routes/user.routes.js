const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reel = require('../models/Reel');
const { protect } = require('../Middlewares/auth.middleware.js');

// GET /api/users/:username - Public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:username/saved - Get saved reels
router.get('/:username/saved', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Only the user themselves can see saved reels
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Private collection.' });
    }

    const reels = await Reel.find({ _id: { $in: user.savedReels } })
      .populate('uploadedBy', 'username avatar');

    res.json({ success: true, reels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/:id/follow - Follow / Unfollow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself." });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: 'User not found.' });

    const isFollowing = targetUser.followers.includes(req.user._id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
    } else {
      await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } });
    }

    res.json({ success: true, following: !isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
