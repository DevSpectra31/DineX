<div align="center">

# 🍽️ DineX — Food Reel Discovery Platform

**A full-stack short-form video discovery platform for food lovers.**
Browse, like, save, and comment on food reels. Restaurants and creators upload content via a dedicated partner dashboard. Explore thousands of free food videos powered by the Pexels API.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat-square)](https://cloudinary.com/)

</div>

---

## 📸 Screenshots

> _Add screenshots here after deployment_

---

## ✨ Features

### 👤 For Users
- 🎬 Browse a paginated food reel feed with **cuisine filters** (Indian, Italian, Japanese, and more)
- ♾️ **Infinite scroll** powered by IntersectionObserver
- 🎥 **Hover video preview** — reels auto-play on hover without leaving the feed
- ❤️ Like, 🔖 save, and 💬 comment on reels with **real-time UI updates**
- 👁️ **Unique view tracking** — 1 view per user, not per refresh
- 👍 **Unique like system** — 1 like per user enforced on both frontend and backend
- 🚫 **Duplicate comment prevention** — same comment within 60 seconds is blocked
- 👤 Public profile pages with **follower / following** system
- 📑 Private saved reels collection

### 🏪 For Food Partners
- 🔐 Role-based registration — sign up as `user` or `partner`
- 📤 Upload reels (video + optional thumbnail) directly to **Cloudinary CDN**
  - Videos auto-compressed to MP4
  - Thumbnails auto-cropped to 600×800 WebP
- 📊 Partner dashboard with analytics — views, likes, saves, comments per reel
- ✅ Publish / unpublish / delete reels
- 🗑️ Deletion automatically removes assets from Cloudinary (no orphaned files)

### 🔍 Explore Page (Pexels API)
- Browse **thousands of royalty-free food videos** from Pexels
- Search by keyword (biryani, sushi, tacos...)
- Filter by cuisine category
- Hover-to-preview video cards
- Infinite load more pagination

### 🔒 Security
- JWT stored in **HTTP-only cookies** — never accessible via JavaScript
- Separate `protect` and `restrictTo` middleware pipelines for each role
- **Tiered rate limiting** — stricter limits on sensitive routes
  - Auth routes: 10 requests / 15 min (brute force protection)
  - Write routes: 30 requests / 60 min (upload spam prevention)
  - Read routes: 200 requests / 15 min (public browsing)
  - Global fallback: 100 requests / 15 min
- Role-based access control: `user` / `partner` / `admin`
- `optionalAuth` middleware for guest-friendly public routes

---

## 🛠️ Tech Stack

| Layer       | Technology                                               |
|-------------|-----------------------------------------------------------|
| Frontend    | React 18, React Router v6, React Context API + useReducer |
| Backend     | Node.js v22, Express.js 4                                |
| Database    | MongoDB 8 with Mongoose ODM                              |
| Auth        | JWT via HTTP-only cookies, bcryptjs                      |
| Media CDN   | **Cloudinary** — video + image upload, CDN delivery      |
| Upload      | Multer + multer-storage-cloudinary                       |
| Explore API | **Pexels API** — royalty-free food videos                |
| Rate Limit  | express-rate-limit (tiered per route)                    |
| HTTP Client | Axios (with interceptors + credentials)                  |

---

## 📁 Project Structure

```
DineX/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js         ← Cloudinary + multer-storage-cloudinary
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js    ← register, login, logout, me
│   │   ├── reel.controller.js    ← feed, like, save, comment, view tracking
│   │   ├── partner.controller.js ← upload to Cloudinary, dashboard stats
│   │   └── explore.controller.js ← Pexels API proxy
│   ├── middleware/
│   │   └── auth.middleware.js    ← protect, restrictTo, optionalAuth
│   ├── models/
│   │   ├── User.js               ← roles, savedReels, likedReels, followers
│   │   └── Reel.js               ← viewedBy, videoPublicId, thumbnailPublicId
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── reel.routes.js
│   │   ├── user.routes.js
│   │   ├── partner.routes.js
│   │   └── explore.routes.js     ← /videos, /popular, /categories
│   ├── services/
│   │   └── pexels.service.js     ← Pexels API client
│   ├── server.js                 ← tiered rate limiters, middleware, routes
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── reels/
        │   │   └── ReelCard.jsx       ← hover video preview, like/save/comment
        │   └── shared/
        │       ├── Navbar.jsx         ← Feed, Explore, Dashboard links
        │       ├── Footer.jsx         ← brand, links, socials
        │       └── *.module.css
        ├── context/
        │   ├── AuthContext.jsx        ← global auth state
        │   └── ReelContext.jsx        ← global reel state, real-time updates
        ├── hooks/
        │   └── useUtils.js            ← useDebounce, useIntersection, useToggle
        ├── pages/
        │   ├── Feed.jsx               ← paginated feed, cuisine filter, infinite scroll
        │   ├── Explore.jsx            ← Pexels video explorer
        │   ├── Login.jsx
        │   ├── Register.jsx           ← role selection (user / partner)
        │   ├── ReelDetail.jsx         ← full video player + comments
        │   ├── Profile.jsx            ← public profile, saved reels, follow
        │   ├── PartnerDashboard.jsx   ← upload with progress bar, stats, manage reels
        │   └── NotFound.jsx
        ├── utils/
        │   └── api.js                 ← axios instance with credentials + interceptors
        ├── App.jsx
        └── index.css                  ← global dark theme CSS variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
- **Cloudinary** account — free tier ([cloudinary.com](https://cloudinary.com))
- **Pexels API key** — free, instant ([pexels.com/api](https://www.pexels.com/api/))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dinex.git
cd dinex
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# ── Server ──────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MongoDB ─────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/dinex

# ── JWT ─────────────────────────────────────────────
JWT_SECRET=replace_with_a_long_random_string_minimum_32_chars
JWT_EXPIRES_IN=7d

# ── CORS ────────────────────────────────────────────
CLIENT_URL=http://localhost:3000

# ── Cloudinary ──────────────────────────────────────
# Get from: https://cloudinary.com/console → API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Pexels ──────────────────────────────────────────
# Get from: https://www.pexels.com/api/ (free, instant)
PEXELS_API_KEY=your_pexels_api_key
```

#### Where to get your API keys

| Service | How to get it |
|---------|---------------|
| **Cloudinary** | Sign up free → Dashboard → API Keys → copy Cloud name, Key, Secret |
| **Pexels** | Sign up free → [pexels.com/api](https://www.pexels.com/api/) → copy API Key |
| **MongoDB Atlas** | Create free M0 cluster → Connect → copy connection string |

---

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Running on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start
# Running on http://localhost:3000
```

> The frontend `package.json` proxies all `/api/*` calls to `http://localhost:5000` automatically — no CORS issues in development.

---

## 🔌 API Reference

### Auth — 10 req / 15 min
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register as user or partner |
| POST | `/api/auth/login` | Public | Login — sets HTTP-only JWT cookie |
| POST | `/api/auth/logout` | User | Clears JWT cookie |
| GET | `/api/auth/me` | User | Get current user info |

### Reels — 200 req / 15 min
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reels` | Public | Paginated feed — `?page=1&cuisine=Indian` |
| GET | `/api/reels/:id` | Optional | Single reel — tracks unique views per user |
| POST | `/api/reels/:id/like` | User | Toggle like (1 per user enforced) |
| POST | `/api/reels/:id/save` | User | Toggle save (1 per user enforced) |
| POST | `/api/reels/:id/comment` | User | Add comment (duplicate check) |
| DELETE | `/api/reels/:id/comment/:cid` | User | Delete own comment |

### Users — 200 req / 15 min
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:username` | Public | Public profile |
| GET | `/api/users/:username/saved` | User (own only) | Saved reels collection |
| PUT | `/api/users/profile` | User | Update bio / avatar |
| POST | `/api/users/:id/follow` | User | Toggle follow / unfollow |

### Partner — 30 req / 60 min
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/partner/dashboard` | Partner | Analytics stats + reel list |
| POST | `/api/partner/reels` | Partner | Upload reel → Cloudinary |
| PUT | `/api/partner/reels/:id` | Partner | Edit metadata / publish toggle |
| DELETE | `/api/partner/reels/:id` | Partner | Delete reel + Cloudinary assets |

### Explore (Pexels) — 200 req / 15 min
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/explore/popular` | Public | Popular food videos — `?page=1` |
| GET | `/api/explore/videos` | Public | Search videos — `?query=biryani&page=1` |
| GET | `/api/explore/categories` | Public | By cuisine — `?cuisine=Indian&page=1` |

---

## ☁️ How Cloudinary Upload Works

```
Browser
  │  multipart/form-data (video + thumbnail)
  ▼
Express — multer-storage-cloudinary (.fields())
  │  video     → inex/videos/      resource_type: video  → auto MP4
  │  thumbnail → inex/thumbnails/  resource_type: image  → auto WebP 600×800
  ▼
Cloudinary CDN — returns secure_url (global HTTPS link)
  ▼
MongoDB — stores { videoUrl, videoPublicId, thumbnailUrl, thumbnailPublicId }
  ▼
React — renders <video src={videoUrl}> directly from Cloudinary CDN
```

On **delete** → `cloudinary.uploader.destroy(publicId)` removes both files. No orphaned assets.

---

## 🧠 Key Engineering Decisions

**Why HTTP-only cookies for JWT instead of localStorage?**
localStorage is readable by JavaScript — any XSS vulnerability can steal the token. HTTP-only cookies are completely invisible to JS, eliminating this attack vector.

**Why React Context + useReducer instead of Redux?**
The app has moderate state complexity (auth + reels). Context with `useReducer` gives Redux-like predictable state transitions without the boilerplate. Real-time like/save/comment updates are dispatched directly without re-fetching from the server — no unnecessary re-renders across the component tree.

**Why tiered rate limiting?**
A single global limit is either too weak for auth routes (brute force risk) or too strict for read routes (bad UX). Each route type gets the right limit — 10/15min on login, 200/15min on the feed.

**Why Pexels for Explore?**
Pexels provides royalty-free HD food videos via API at no cost. It fills the platform with real content immediately while partners build their own libraries — solving the cold-start problem of a new platform.

---

## 🌐 Deployment on Vercel

Both the frontend and backend are deployed on Vercel. The backend runs as **Vercel Serverless Functions**.

---

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create a free **M0** cluster
2. **Database Access** → Add a user with username + password
3. **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Vercel)
4. **Connect** → Drivers → copy the connection string, replace `<password>` with your DB password

---

### Step 2 — Prepare the Backend for Vercel

Vercel runs Node.js as serverless functions. Create this file at the root of your `backend/` folder:

**Create `backend/vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

### Step 3 — Deploy Backend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `backend`
4. Framework Preset: **Other**
5. Go to **Environment Variables** and add all of these:

```
MONGO_URI              = mongodb+srv://user:pass@cluster.mongodb.net/dinex
JWT_SECRET             = your_long_random_secret
JWT_EXPIRES_IN         = 7d
NODE_ENV               = production
CLIENT_URL             = https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME  = your_cloud_name
CLOUDINARY_API_KEY     = your_api_key
CLOUDINARY_API_SECRET  = your_api_secret
PEXELS_API_KEY         = your_pexels_key
```

6. Click **Deploy**
7. Copy your backend URL — it will look like `https://dinex-backend.vercel.app`

---

### Step 4 — Prepare the Frontend for Vercel

**Create `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://dinex-backend.vercel.app/api
```

**Update `frontend/src/utils/api.js`** — change the baseURL:
```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
```

**Create `frontend/vercel.json`** — fixes page refresh returning 404:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Step 5 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the same GitHub repository
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Create React App**
5. Add **Environment Variable**:

```
REACT_APP_API_URL = https://dinex-backend.vercel.app/api
```

6. Click **Deploy**
7. Copy your frontend URL — e.g. `https://dinex.vercel.app`

---

### Step 6 — Update Backend CORS

Go back to your **backend project on Vercel** → Settings → Environment Variables → update:

```
CLIENT_URL = https://dinex.vercel.app
```

Then **Redeploy** the backend for the change to take effect.

---

### Step 7 — Update Cookie Settings for Production

In `backend/controllers/auth.controller.js`, the cookie is already set with:
```js
secure: isProduction,       // true in production → HTTPS only
sameSite: isProduction ? 'None' : 'Lax',  // 'None' required for cross-origin cookies
```

This is already correct. Vercel frontend and backend are on different domains so `sameSite: 'None'` + `secure: true` is required for cookies to work.

---

### ✅ Final Deployment Checklist

```
☐ MongoDB Atlas cluster created + IP whitelist set to 0.0.0.0/0
☐ backend/vercel.json created
☐ Backend deployed on Vercel with all env variables set
☐ frontend/.env.production created with backend URL
☐ frontend/vercel.json created (SPA rewrite rule)
☐ Frontend deployed on Vercel with REACT_APP_API_URL set
☐ CLIENT_URL in backend env updated to frontend Vercel URL
☐ Backend redeployed after CLIENT_URL update
```

---

### 🌍 Final URLs

| Service | URL |
|---------|-----|
| Frontend | `https://dinex.vercel.app` |
| Backend API | `https://dinex-backend.vercel.app/api` |
| Health Check | `https://dinex-backend.vercel.app/api/health` |

---

## 📄 License

MIT — free to use, fork, and build on.

---

<div align="center">
Built with ❤️ for food lovers everywhere
</div>
