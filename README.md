# 📡 FieldTrack — GPS Workforce Tracking System

A MERN stack application for tracking remote/field workers using GPS and geofencing.

---

## 🗂 Project Structure

```
fieldtrack/
├── server/                  # Node.js + Express backend
│   ├── models/
│   │   ├── User.js          # User schema (manager/worker roles)
│   │   └── Site.js          # Work site schema with GeoJSON
│   ├── routes/
│   │   ├── auth.js          # /api/auth — login, register, me
│   │   ├── users.js         # /api/users — worker CRUD
│   │   └── sites.js         # /api/sites — site CRUD + assignments
│   ├── middleware/
│   │   └── auth.js          # JWT protect + role guard
│   ├── .env.example         # Environment variable template
│   └── index.js             # App entry point
│
├── client/                  # React dashboard (manager UI)
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── utils/
│       │   └── api.js            # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── layout/AppLayout  # Sidebar + main layout
│       │   ├── sites/SiteModal   # Create/edit site form
│       │   └── workers/WorkerModal
│       └── pages/
│           ├── LoginPage, RegisterPage
│           ├── DashboardPage
│           ├── SitesPage
│           └── WorkersPage
│
└── package.json             # Root scripts (runs both together)
```

---

## ⚙️ Setup Instructions

### Step 1 — Prerequisites
- Node.js v18+ installed
- A MongoDB Atlas account (free at [mongodb.com](https://mongodb.com))
- A Google Maps API key (for Phase 2)

### Step 2 — MongoDB Atlas Setup
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create a database user (username + password)
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs for development)
5. Click **Connect → Drivers** and copy the connection string

### Step 3 — Environment Variables

```bash
# In the server/ folder, create a .env file:
cp server/.env.example server/.env
```

Edit `server/.env`:
```
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fieldtrack
JWT_SECRET=pick_any_long_random_string_here
CLIENT_URL=http://localhost:3000
PORT=5000
```

```bash
# In the client/ folder:
cp client/.env.example client/.env
```

Edit `client/.env`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here  (needed in Phase 2, can leave blank for now)
```

### Step 4 — Install Dependencies

```bash
# From the root fieldtrack/ folder:
npm run install-all
```

### Step 5 — Run the App

```bash
# From the root, runs both server and client together:
npm run dev
```

- Backend API: http://localhost:5000
- React Dashboard: http://localhost:3000

---

## 🔑 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | name, email, password, role | Register |
| POST | `/api/auth/login` | email, password | Login |
| GET | `/api/auth/me` | — (needs JWT) | Get current user |

### Sites (Manager only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | List all sites |
| POST | `/api/sites` | Create site |
| PUT | `/api/sites/:id` | Update site |
| DELETE | `/api/sites/:id` | Delete site |
| POST | `/api/sites/:id/assign` | Assign worker to site |
| DELETE | `/api/sites/:id/assign/:workerId` | Remove worker from site |

### Workers (Manager only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/workers` | List my workers |
| POST | `/api/users/workers` | Create worker |
| PUT | `/api/users/workers/:id` | Update worker |
| DELETE | `/api/users/workers/:id` | Deactivate worker |

---

## 🚀 What's Coming (Phase Roadmap)

| Phase | Feature |
|-------|---------|
| ✅ Phase 1 | Auth + User/Site CRUD (you are here) |
| 🔜 Phase 2 | Google Maps geofence drawing on dashboard |
| 🔜 Phase 3 | React Native mobile app + GPS clock-in |
| 🔜 Phase 4 | Socket.io real-time worker tracking |
| 🔜 Phase 5 | Timesheets, attendance reports |
