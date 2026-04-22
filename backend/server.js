const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes    = require('./src/routes/auth.routes.js');
const reelRoutes    = require('./src/routes/reel.routes.js');
const userRoutes    = require('./src/routes/user.routes.js');
const partnerRoutes = require('./src/routes/partner.routes.js');
const exploreRoutes = require('./src/routes/explore.route.js');

const app = express();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

const makeLimiter = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

const authLimiter   = makeLimiter(15, 10,  'Too many login attempts. Please try again in 15 minutes.');
const writeLimiter  = makeLimiter(60, 30,  'You are making too many requests. Please slow down.');
const readLimiter   = makeLimiter(15, 200, 'Too many requests. Please try again shortly.');
const globalLimiter = makeLimiter(15, 100, 'Too many requests, please try again later.');

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(globalLimiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth',    authLimiter,  authRoutes);
app.use('/api/reels',   readLimiter,  reelRoutes);
app.use('/api/users',   readLimiter,  userRoutes);
app.use('/api/partner', writeLimiter, partnerRoutes);
app.use('/api/explore', readLimiter,  exploreRoutes);

// ─── Root Route ───────────────────────────────────────────────────────────────

app.get('/', (req, res) =>
  res.json({ status: 'DineX API is running 🚀' })
);

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