const Reel = require('../models/Reel');
const User = require('../models/User');

// GET /api/reels - Paginated feed
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const cuisine = req.query.cuisine;

    const filter = { isPublished: true };
    if (cuisine) filter.cuisine = cuisine;

    const reels = await Reel.find(filter)
      .populate('uploadedBy', 'username avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reel.countDocuments(filter);

    res.json({ success: true, reels, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reels/:id
exports.getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('uploadedBy', 'username avatar')
      .populate('comments.user', 'username avatar');

    if (!reel) return res.status(404).json({ error: 'Reel not found.' });

    // Only count a view if this user hasn't viewed before
    // For logged-in users: track by user ID
    // For guests: just count every time (can't track without account)
    if (req.user) {
      const userId = req.user._id.toString();
      const alreadyViewed = reel.viewedBy.some(id => id.toString() === userId);
      if (!alreadyViewed) {
        reel.views += 1;
        reel.viewedBy.push(req.user._id);
        await reel.save({ validateBeforeSave: false });
      }
    } else {
      // Guest view — always count (no way to track without login)
      reel.views += 1;
      await reel.save({ validateBeforeSave: false });
    }

    res.json({ success: true, reel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/reels/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found.' });

    const userId = req.user._id.toString();

    // Check if this user has already liked — compare as strings
    const alreadyLiked = reel.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      // Pull this user's ID out
      reel.likes = reel.likes.filter(id => id.toString() !== userId);
      await User.findByIdAndUpdate(userId, { $pull: { likedReels: reel._id } });
    } else {
      // Only add if not already there (addToSet logic)
      reel.likes.push(req.user._id);
      await User.findByIdAndUpdate(userId, { $addToSet: { likedReels: reel._id } });
    }

    await reel.save();
    res.json({ success: true, liked: !alreadyLiked, likesCount: reel.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/reels/:id/save
exports.toggleSave = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found.' });

    const userId = req.user._id.toString();
    const alreadySaved = reel.saves.some(id => id.toString() === userId);

    if (alreadySaved) {
      reel.saves = reel.saves.filter(id => id.toString() !== userId);
      await User.findByIdAndUpdate(userId, { $pull: { savedReels: reel._id } });
    } else {
      reel.saves.push(req.user._id);
      await User.findByIdAndUpdate(userId, { $addToSet: { savedReels: reel._id } });
    }

    await reel.save();
    res.json({ success: true, saved: !alreadySaved, savesCount: reel.saves.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/reels/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required.' });

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found.' });

    reel.comments.push({ user: req.user._id, text });
    await reel.save();

    const updatedReel = await Reel.findById(reel._id).populate('comments.user', 'username avatar');
    const newComment = updatedReel.comments[updatedReel.comments.length - 1];

    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/reels/:id/comment/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found.' });

    const comment = reel.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment.' });
    }

    comment.deleteOne();
    await reel.save();

    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
