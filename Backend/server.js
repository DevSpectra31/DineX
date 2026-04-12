const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes    = require('./routes/auth.routes');
const reelRoutes    = require('./routes/reel.routes');
const userRoutes    = require('./routes/user.routes');
const partnerRoutes = require('./routes/partner.routes');
const exploreRoutes = require('./routes/explore.route.js');

const app = express();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// Helper to create limiters without repeating config
const makeLimiter = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { error: message },
    standardHeaders: true,   // sends RateLimit-* headers to the client
    legacyHeaders: false,     // disables old X-RateLimit-* headers
    validate: { xForwardedForHeader: false }, // suppresses dev proxy warning
  });

// 1. Auth — strictest (10 attempts / 15 min) — brute force protection
const authLimiter = makeLimiter(
  15, 10,
  'Too many login attempts. Please try again in 15 minutes.'
);

// 2. Write — moderate (30 requests / 60 min) — upload & post spam protection
const writeLimiter = makeLimiter(
  60, 30,
  'You are making too many requests. Please slow down.'
);

// 3. Read — relaxed (200 requests / 15 min) — public browsing
const readLimiter = makeLimiter(
  15, 200,
  'Too many requests. Please try again shortly.'
);

// 4. Global fallback — catches any route not covered above (100 / 15 min)
const globalLimiter = makeLimiter(
  15, 100,
  'Too many requests, please try again later.'
);

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(globalLimiter); // applied to everything as a safety net
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes (with per-route limiters) ────────────────────────────────────────

app.use('/api/auth',    authLimiter,  authRoutes);    // 10 / 15 min  — strictest
app.use('/api/reels',   readLimiter,  reelRoutes);    // 200 / 15 min — public feed
app.use('/api/users',   readLimiter,  userRoutes);    // 200 / 15 min — profiles
app.use('/api/partner', writeLimiter, partnerRoutes); // 30 / 60 min  — uploads
app.use('/api/explore', readLimiter, exploreRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', time: new Date() })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ─── Connect to MongoDB & Start Server ───────────────────────────────────────

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });