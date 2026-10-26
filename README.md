# 🎬 YouTube Clone (MERN Stack)

A full-stack, responsive YouTube Clone built with **MongoDB, Express.js, React, and Node.js**, featuring video streaming, JWT authentication, video management, channel subscriptions, social interactions, search, and a personalized recommendation engine.

### 🌐 Live Permanent Website (24/7):
👉 **[https://varunaditya0012.github.io/youtube-clone-mern/](https://varunaditya0012.github.io/youtube-clone-mern/)**

- **Live Demo & PWA**: Accessible from any phone, tablet, or desktop worldwide.
- **Installable Native App**: Standalone PWA installation with desktop shortcut and mobile home screen support.
- **Repository**: [https://github.com/varunaditya0012/youtube-clone-mern](https://github.com/varunaditya0012/youtube-clone-mern)

---

## 🚀 Key Features

### 1. 🔐 Authentication & Session Security (JWT)
- **JSON Web Tokens (JWT)** for secure stateless authentication stored in HTTP headers / localStorage.
- **bcryptjs** password hashing (salt rounds: 10) ensures user credentials are never stored in plain text.
- Registration, Login, and Current User (`/api/auth/me`) verification.
- Protected API routes requiring token authorization.
- **1-Click Demo Accounts** built right into the modal to test different user profiles instantly.

### 2. 📹 Video Management & Custom Video Player
- **Video Uploads**:
  - File upload via `multer` for `.mp4`, `.webm`, `.mov` video files and `.jpg`, `.png`, `.webp` custom thumbnails.
  - Video URL / Quick Preset library for instant testing without large file downloads.
  - Video metadata: Title, Description, Category, Tags, Duration, Channel Owner.
- **Video Streaming**:
  - Express server with **HTTP Range Request (206 Partial Content)** support for instant seeking, scrubbing, and smooth playback.
- **Custom Video Player**:
  - Play/pause, seek bar with live gradient progress, volume slider & mute toggle, playback speed selector (0.5x to 2x), and fullscreen mode.
  - Keyboard shortcuts (`Space`/`k` to play/pause, `f` for fullscreen, `m` for mute, `Arrow keys` for seeking).
- **View Tracking**:
  - Automatic view counter increment and user watch history recording.

### 3. 👍 User Interactions & Social Engagement
- **Likes & Dislikes**: Real-time toggleable like/dislike system (prevents double liking; automatically switches from dislike to like).
- **Comments System**:
  - Add comments with user avatar and relative timestamps ("2 hours ago").
  - Like/unlike comments.
  - Delete own comments.
  - Sort by "Top comments" or "Newest first".
- **Share System**:
  - Modal with 1-click **Copy Video Link** (with visual feedback).
  - Embed code generator (`<iframe>`).
  - Direct social share shortcuts (WhatsApp, X / Twitter, Facebook, Reddit).
  - Backend share counter (`sharesCount`).

### 4. 📺 Channel Subscription System
- Subscribe / Unsubscribe to channels with 1 click.
- Dynamic subscriber count updates in real time.
- Dedicated **Subscriptions Feed** displaying recent uploads from all channels the user follows.
- Channel Profile page with custom banner, avatar, `@handle`, video count, and channel tabs.

### 5. 🔍 Search & Category Filtering
- Full-text search across titles, descriptions, tags, and channel names.
- Sort search results by Relevance, Views, Date, and Likes.
- Horizontal category pills bar ("All", "Tech", "Gaming", "Music", "Education", "News", "Sports", "Podcasts").

### 6. 🧠 Personalized Recommendation System
- **Hybrid Recommendation Algorithm**:
  - **Category Affinity**: Boosts videos in categories the user frequently watches or likes.
  - **Channel Subscriptions**: Prioritizes new uploads from creators the user is subscribed to.
  - **Tag Overlap**: Scores videos sharing tags with the user's recent watch history.
  - **Contextual Up-Next**: Matches videos with similar category, tags, and creator when viewing a video on the watch page.
  - **Freshness & Trending**: Balances recency and engagement (likes/views ratio) for guest users.

---

## 📁 Project Architecture

```
youtube-clone/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS, Lucide Icons)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI widgets
│   │   │   ├── Navbar.jsx      # Header with search, voice, and user profile
│   │   │   ├── Sidebar.jsx     # Navigation sidebar (mini & responsive drawer)
│   │   │   ├── VideoCard.jsx   # Grid and horizontal video cards
│   │   │   ├── VideoPlayer.jsx # Custom HTML5 player with speed & range controls
│   │   │   ├── CommentSection.jsx # Live commenting & comment likes
│   │   │   ├── ShareModal.jsx  # Social sharing & copy link
│   │   │   ├── UploadModal.jsx # Video & thumbnail upload modal
│   │   │   ├── AuthModal.jsx   # Sign in, Sign up & Demo accounts
│   │   │   └── CategoryPills.jsx # YouTube horizontal pill categories
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT auth state & modal controllers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Home feed & personalized recommendations
│   │   │   ├── WatchPage.jsx   # Video playback, details & Up-Next recommendations
│   │   │   ├── SearchPage.jsx  # Search results with sorting
│   │   │   ├── ChannelPage.jsx # Channel profile, banner & videos
│   │   │   ├── SubscriptionsPage.jsx # Feed of subscribed channels
│   │   │   ├── HistoryPage.jsx # Watch history with clear option
│   │   │   └── LikedVideosPage.jsx   # Liked videos list
│   │   ├── services/
│   │   │   └── api.js          # Axios API client with JWT interceptors
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives & YouTube dark styling
│   ├── vite.config.js          # Vite config with API proxy
│   └── package.json
│
├── server/                     # Backend API (Node.js, Express, Mongoose / Data Store)
│   ├── config/
│   │   └── db.js               # Auto-connecting MongoDB with zero-setup fallback
│   ├── controllers/
│   │   ├── authController.js   # JWT register, login, me, profile
│   │   ├── videoController.js  # Video upload, streaming, likes, views, history
│   │   ├── commentController.js# Comments CRUD & comment likes
│   │   ├── userController.js   # Channel profile & subscriptions
│   │   └── recommendationController.js # Multi-factor recommendation engine
│   ├── middleware/
│   │   ├── authMiddleware.js   # Bearer JWT verification
│   │   ├── uploadMiddleware.js # Multer file upload for video/thumbnail
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js             # User & Channel schema
│   │   ├── Video.js            # Video schema with engagement metrics
│   │   ├── Comment.js          # Comment schema
│   │   └── Subscription.js     # Subscription schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── videoRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── userRoutes.js
│   │   └── recommendationRoutes.js
│   ├── seeds/
│   │   └── seedData.js         # Realistic pre-seeded channels & videos
│   ├── uploads/                # Local storage for uploaded files
│   │   ├── videos/
│   │   └── thumbnails/
│   ├── .env                    # Environment configuration
│   ├── server.js               # Main Express entrypoint
│   └── package.json
│
├── package.json                # Root package with concurrently runner
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18 or higher (v22 installed and verified)
- **MongoDB**: (Optional) Connects to local MongoDB `mongodb://127.0.0.1:27017/youtube_clone` or MongoDB Atlas URI in `server/.env`. If MongoDB is not running locally, the built-in embedded persistence engine activates automatically so the entire application runs with 0 configuration!

### 2. Run the Application
From the `youtube-clone` root directory:

```bash
# Start both Backend and Frontend concurrently:
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1 - Backend Server (Port 5000):
npm run server

# Terminal 2 - Frontend Client (Port 5173):
npm run client
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 👤 Pre-Seeded Demo Accounts

You can log in with any of these accounts (password for all is `password123`) or use the **Quick Demo Login** buttons inside the Sign In modal:

| Channel Name | Email / Username | Role / Niche |
|--------------|-------------------|--------------|
| **TechNova** | `technova@youtube.com` / `technova` | Tech & AI Creator |
| **Code Samurai** | `samurai@youtube.com` / `codesamurai` | Web Dev Tutorials |
| **Chill Vibes & Lo-Fi** | `lofi@youtube.com` / `chillvibes` | Music Producer |
| **Apex Gaming Pro** | `gamer@youtube.com` / `apexgaming` | Gaming Streamer |
| **Curiosity Cosmos** | `cosmos@youtube.com` / `curiositycosmos` | Science & Astronomy |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user channel | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (Bearer JWT) |
| `PUT` | `/api/auth/profile` | Update avatar, banner, bio | Yes (Bearer JWT) |

### Videos (`/api/videos`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/videos` | Get videos with category filter | No |
| `POST` | `/api/videos` | Upload video (files or URLs) | Yes (Bearer JWT) |
| `GET` | `/api/videos/:id` | Get video details & user interaction | Optional |
| `POST` | `/api/videos/:id/view` | Increment view & add to history | Optional |
| `POST` | `/api/videos/:id/like` | Toggle like on video | Yes (Bearer JWT) |
| `POST` | `/api/videos/:id/dislike` | Toggle dislike on video | Yes (Bearer JWT) |
| `POST` | `/api/videos/:id/share` | Track share event | No |
| `GET` | `/api/videos/search?q=...` | Search videos by text/tags/channel | No |
| `GET` | `/api/videos/subscriptions` | Videos from subscribed channels | Yes (Bearer JWT) |
| `GET` | `/api/videos/liked` | User's liked videos | Yes (Bearer JWT) |
| `GET` | `/api/videos/history` | User's watch history | Yes (Bearer JWT) |
| `DELETE` | `/api/videos/history` | Clear watch history | Yes (Bearer JWT) |
| `DELETE` | `/api/videos/:id` | Delete own video | Yes (Bearer JWT) |

### Video Streaming (`/api/stream`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stream/video/:filename` | HTTP Range 206 partial content streaming |

### Comments (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/comments/:videoId` | Get comments for video | No |
| `POST` | `/api/comments/:videoId` | Add comment | Yes (Bearer JWT) |
| `POST` | `/api/comments/like/:id` | Toggle like on comment | Yes (Bearer JWT) |
| `DELETE`| `/api/comments/:id` | Delete own comment | Yes (Bearer JWT) |

### Channels & Subscriptions (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/channel/:usernameOrId` | Get channel profile & video list | Optional |
| `POST` | `/api/users/subscribe/:channelId` | Toggle follow/subscribe | Yes (Bearer JWT) |
| `GET` | `/api/users/subscriptions/list` | List subscribed channels | Yes (Bearer JWT) |

### Recommendations (`/api/recommendations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/recommendations?currentVideoId=...` | Multi-factor personalized & contextual suggestions | Optional |

---

## 🎨 UI & Design Highlights
- **YouTube Dark Palette**: High fidelity color system matching YouTube's authentic dark UI (`#0f0f0f` background, `#212121` surface, `#ff0000` brand accent, `#3ea6ff` interactive links).
- **Smooth Responsive Transitions**: Collapsible mini-sidebar for desktop and drawer overlay for tablet/mobile.
- **Accessible & Scalable**: Clean component hierarchy with React Context API and Axios interceptors.
