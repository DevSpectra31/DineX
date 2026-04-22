const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 300 },
  },
  { timestamps: true }
);

const reelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    videoPublicId: {
      type: String,
      default: '', // Cloudinary public_id — used for deletion
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    thumbnailPublicId: {
      type: String,
      default: '', // Cloudinary public_id — used for deletion
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cuisine: {
      type: String,
      enum: ['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Japanese', 'Mediterranean', 'Other'],
      default: 'Other',
    },
    tags: [{ type: String, trim: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    views: { type: Number, default: 0 },
    views:    { type: Number, default: 0 },
viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ← add this
    isPublished: { type: Boolean, default: true },
    restaurant: {
      name: String,
      address: String,
      city: String,
    },
  },
  { timestamps: true }
);

// Virtual for likes count
reelSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

reelSchema.virtual('savesCount').get(function () {
  return this.saves.length;
});

reelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reel', reelSchema);
