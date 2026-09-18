##📍 SiteSync — Geo-Fenced Workforce Management Platform
<p align="center">
  <img src="screenshots/banner.png" alt="SiteSync Banner" width="900">
</p>
<p align="center">
  <strong>Geo-Fenced Workforce Management Platform</strong>
</p>
<p align="center">
  A full-stack workforce management platform that connects managers and field workers through GPS-based geofencing, attendance sessions, and real-time location tracking.
</p>
<p align="center">
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
</p>
---
📑 Table of Contents
Overview
The Problem
The Solution
Key Features
Complete Workflow
System Architecture
Manager Web Dashboard
Worker Mobile Application
Geofencing System
Real-Time Location Tracking
Authentication & Authorization
Session Management
REST API
Database Design
Technology Stack
Project Structure
Installation
Environment Variables
Running the Application
Mobile Application Setup
Screenshots
Project Status
Future Improvements
Author
---
🚀 Overview
SiteSync is a full-stack workforce management platform designed for organizations that manage employees working across multiple physical locations.
The system consists of:
🖥️ Manager Web Dashboard
A React-based dashboard that allows managers to:
Manage work sites
Draw geographical boundaries for work sites
Create and manage field workers
Assign workers to sites
View active workforce sessions
Monitor worker locations in real time
📱 Worker Mobile Application
A React Native + Expo application that allows workers to:
Log in securely
View assigned work sites
Obtain their current GPS location
Request clock-in
Verify their location against the site geofence
Start an active work session
Send periodic location updates
Clock out
⚙️ Backend
A Node.js + Express backend provides:
JWT authentication
Role-based authorization
Worker management
Site management
Worker-site assignment
Geospatial validation
Session management
GPS location logging
Real-time Socket.IO events
🗄️ Database
MongoDB stores:
Users
Work sites
Geofence polygons
Worker assignments
Work sessions
GPS location logs
---
🎯 The Problem
Organizations managing field workers often need to answer questions such as:
Is a worker actually present at the assigned work site?
Which workers are currently working?
Which sites are active?
When did a worker clock in?
Where was the worker when they clocked in?
Can managers monitor active workers remotely?
Traditional attendance systems may not provide reliable location-based verification.
---
💡 The Solution
SiteSync combines:
```text
👥 Workforce Management
        +
📍 GPS Location
        +
⭕ Geofencing
        +
🔐 Authentication
        +
🛡️ Server-side Verification
        +
⏱️ Work Sessions
        +
📡 Real-Time Location Updates
```
This creates an end-to-end workflow between the manager dashboard, backend, database, and worker mobile application.
---
✨ Key Features
👨‍💼 Manager Dashboard
🔐 Manager authentication
📊 Workforce dashboard
📍 Create work sites
🗺️ Draw geofence polygons directly on a map
✏️ Edit existing sites
🗑️ Delete sites
👷 Create and manage field workers
✏️ Update worker information
🚫 Deactivate workers
🔗 Assign workers to work sites
🛰️ View live worker locations
📋 View active sessions
📡 Receive real-time location updates
👷 Worker Mobile Application
🔐 Secure worker authentication
🔒 Secure token storage
📍 View assigned sites
🛰️ GPS location detection
📐 Geofence verification
🟢 Clock-in
⏱️ Active session timer
📡 Periodic location updates
🔴 Clock-out
🔄 Active session restoration
📱 Mobile-first interface
🧠 Geospatial Features
GeoJSON Polygon storage
MongoDB `2dsphere` indexes
Turf.js geometry processing
Polygon validation
Self-intersection detection
Centroid calculation
Area calculation
MongoDB `$geoIntersects` verification
---
🔄 Complete Workflow
👨‍💼 Manager Side
```text
             Manager
                │
                ▼
          Secure Login
                │
                ▼
           Dashboard
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
   Create Site       Create Worker
       │                 │
       ▼                 │
 Draw Geofence           │
       │                 │
       └────────┬────────┘
                │
                ▼
       Assign Worker
       to Work Site
                │
                ▼
        Monitor Workforce
                │
                ▼
       Live Tracking Map
```
👷 Worker Side
```text
            Worker
               │
               ▼
          Mobile Login
               │
               ▼
        Assigned Sites
               │
               ▼
        Select Work Site
               │
               ▼
        Request Location
               │
               ▼
       Send GPS Coordinates
               │
               ▼
       Backend Verification
               │
        ┌──────┴──────┐
        │             │
     Inside        Outside
    Geofence      Geofence
        │             │
        ▼             ▼
     Clock In       Reject
        │
        ▼
  Active Work Session
        │
        ▼
 GPS Ping Every 30 sec
        │
        ▼
 Real-Time Socket Event
        │
        ▼
 Manager Live Map
        │
        ▼
     Clock Out
```
---
🏗️ System Architecture
```text
                         ┌────────────────────────┐
                         │        MANAGER         │
                         │      Web Browser       │
                         │                        │
                         │       React.js         │
                         └───────────┬────────────┘
                                     │
                                     │ REST API
                                     ▼
              ┌────────────────────────────────────────┐
              │              BACKEND SERVER             │
              │                                         │
              │          Node.js + Express              │
              │                                         │
              │  ┌──────────────────────────────────┐  │
              │  │ Authentication / Authorization   │  │
              │  ├──────────────────────────────────┤  │
              │  │ User Management                  │  │
              │  ├──────────────────────────────────┤  │
              │  │ Site Management                  │  │
              │  ├──────────────────────────────────┤  │
              │  │ Worker Assignment                │  │
              │  ├──────────────────────────────────┤  │
              │  │ Geofence Verification            │  │
              │  ├──────────────────────────────────┤  │
              │  │ Session Management               │  │
              │  ├──────────────────────────────────┤  │
              │  │ GPS Location Logging             │  │
              │  └──────────────────────────────────┘  │
              │                                         │
              │             Socket.IO                   │
              └────────────────┬────────────────────────┘
                               │
                     ┌─────────┴──────────┐
                     │                    │
                     ▼                    ▼
             ┌──────────────┐      ┌───────────────┐
             │   MongoDB    │      │   Socket.IO   │
             │    Atlas     │      │  Live Events  │
             └──────────────┘      └───────┬───────┘
                                           │
                                           ▼
                               ┌────────────────────┐
                               │      WORKER        │
                               │   Mobile Device    │
                               │                    │
                               │ React Native       │
                               │ Expo Location      │
                               └────────────────────┘
```
---
🖥️ Manager Web Dashboard
The web dashboard is built with React and provides managers with a centralized control panel.
🔐 01 — Manager Login
Managers authenticate before accessing the platform.
<p align="center">
  <img src="screenshots/web/01-login.png" alt="SiteSync Manager Login" width="850">
</p>
> 📸 **Screenshot placeholder:** Replace the image above with your actual manager login screenshot.
📊 02 — Dashboard
The dashboard provides an overview of the manager's operation.
<p align="center">
  <img src="screenshots/web/02-dashboard.png" alt="SiteSync Dashboard" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your dashboard screenshot here.
📍 03 — Work Sites
Managers can view and manage all sites created under their account.
<p align="center">
  <img src="screenshots/web/03-sites.png" alt="SiteSync Work Sites" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your sites page screenshot here.
🗺️ 04 — Create a Geofenced Site
A major feature of SiteSync is the ability to draw a custom geofence directly on a map.
The manager can:
Open the site creation interface.
Select the polygon drawing tool.
Draw the boundary around the work site.
Review the calculated area.
Save the site.
The application uses Leaflet + OpenStreetMap for the map interface.
<p align="center">
  <img src="screenshots/web/04-create-site.png" alt="SiteSync Geofence Drawing" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your geofence creation screenshot here.
📐 Geofence Area Calculation
The system calculates the approximate area of the drawn polygon using Turf.js.
```text
Polygon
   │
   ▼
Turf.js Area Calculation
   │
   ▼
Area in square metres
   │
   ▼
Displayed as hectares + m²
```
The calculated area is also stored with the site.
👷 05 — Worker Management
Managers can create field-worker accounts.
<p align="center">
  <img src="screenshots/web/05-workers.png" alt="SiteSync Worker Management" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your worker management screenshot here.
➕ 06 — Add Worker
A manager can create a worker account directly from the dashboard.
<p align="center">
  <img src="screenshots/web/06-add-worker.png" alt="SiteSync Add Worker" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your add-worker screenshot here.
🔗 07 — Assign Worker to Site
Managers can assign workers to specific work sites.
This assignment is important because a worker can only clock in to sites assigned to their account.
<p align="center">
  <img src="screenshots/web/07-worker-assignment.png" alt="SiteSync Worker Assignment" width="850">
</p>
> 📸 **Screenshot placeholder:** Add your worker-assignment screenshot here.
---
🗺️ Live Tracking Dashboard
SiteSync includes a dedicated Live Tracking interface for managers.
Managers can select a work site and view workers who currently have active sessions.
The map displays:
Work-site geofence
Active worker locations
Worker names
Current location updates
<p align="center">
  <img src="screenshots/web/08-live-tracking.png" alt="SiteSync Live Tracking" width="900">
</p>
> 📸 **Screenshot placeholder:** Add your live tracking screenshot here.
---
📱 Worker Mobile Application
The worker application is built using:
React Native
Expo
React Navigation
Expo Location
Expo Secure Store
Axios
🔐 01 — Worker Login
Workers log into the mobile application using credentials created by their manager.
<p align="center">
  <img src="screenshots/mobile/01-login.png" alt="SiteSync Worker Mobile Login" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your mobile login screenshot here.
📍 02 — Assigned Sites
After authentication, workers can see the sites assigned to them.
<p align="center">
  <img src="screenshots/mobile/02-sites.png" alt="SiteSync Assigned Sites" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your assigned-sites screenshot here.
🛰️ 03 — GPS Verification
When the worker chooses a site and starts the clock-in process:
```text
Request Location Permission
          ↓
Get Current GPS Position
          ↓
Read Latitude / Longitude
          ↓
Send Coordinates to Backend
          ↓
Server-side Geofence Check
```
<p align="center">
  <img src="screenshots/mobile/03-location.png" alt="SiteSync GPS Verification" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your GPS/location screenshot here.
🟢 04 — Clock In
The worker can request to clock in at the selected work site.
The backend verifies the worker's location against the site's configured geofence.
<p align="center">
  <img src="screenshots/mobile/04-clock-in.png" alt="SiteSync Clock In" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your clock-in screenshot here.
⏱️ Active Work Session
After successful clock-in, the application enters an active state.
The mobile application:
Displays the elapsed session time
Shows GPS accuracy
Sends periodic location updates
Allows the worker to clock out
<p align="center">
  <img src="screenshots/mobile/05-active-session.png" alt="SiteSync Active Work Session" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your active-session screenshot here.
📡 Location Pings
The current implementation sends a location ping approximately every 30 seconds while the worker is clocked in.
```javascript
const PING_INTERVAL_MS = 30_000;
```
Each location update contains:
```text
longitude
latitude
accuracy
```
These coordinates are stored as GeoJSON Points in the worker's session.
🔴 Clock Out
When the worker finishes their work session, they can clock out.
The backend calculates the session duration:
```text
Clock Out Time
      -
Clock In Time
      =
Duration
```
<p align="center">
  <img src="screenshots/mobile/06-clock-out.png" alt="SiteSync Clock Out" width="280">
</p>
> 📸 **Screenshot placeholder:** Add your clock-out screenshot here.
🔄 Active Session Restoration
If a worker closes the application while clocked in, the application can query:
```text
GET /api/sessions/active
```
and restore the active session state.
---
🧠 Geofencing System
Geofencing is one of the central features of SiteSync.
Instead of storing only a point and radius, SiteSync allows the manager to draw a custom polygon representing the actual work area.
1. Manager Draws Polygon
```text
Leaflet Map
     ↓
Polygon Drawing Tool
     ↓
Latitude / Longitude Points
```
2. Turf.js Processes the Polygon
The backend processes the geofence by:
Ensuring there are enough points
Closing the polygon ring
Creating a GeoJSON polygon
Checking for self-intersections
Calculating the centroid
Calculating the approximate area
3. Polygon Stored in MongoDB
The site stores the geofence using GeoJSON:
```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [longitude, latitude],
      [longitude, latitude],
      [longitude, latitude],
      [longitude, latitude]
    ]
  ]
}
```
4. Worker Sends GPS Coordinates
The worker application sends:
```json
{
  "siteId": "...",
  "longitude": "...",
  "latitude": "...",
  "accuracy": "..."
}
```
5. MongoDB Performs Geospatial Verification
```text
Worker GPS
    ↓
GeoJSON Point
    ↓
MongoDB $geoIntersects
    ↓
Site Geofence Polygon
```
If the point is inside the polygon:
```text
✅ Clock-in allowed
```
Otherwise:
```text
❌ Clock-in rejected
```
---
🛡️ Server-Side Geofence Verification
The mobile application does not make the final decision about whether a worker is inside the work site.
The backend performs the geospatial check.
The backend validates:
```text
Authenticated Worker
       +
Assigned Site
       +
Current GPS Coordinates
       +
Geofence Polygon
       +
Existing Session State
```
Only after the required checks pass is a work session created.
---
🔐 Authentication & Authorization
SiteSync uses JWT-based authentication.
Authentication Flow
```text
User Login
    ↓
Credentials Verified
    ↓
JWT Token Generated
    ↓
Token Stored
    ↓
Authenticated API Requests
```
The web application uses an Axios interceptor to attach the JWT to API requests.
The mobile application stores authentication information using Expo Secure Store.
Role-Based Access Control
The system supports two roles:
```text
                 USER
                   │
          ┌────────┴────────┐
          │                 │
       MANAGER            WORKER
          │                 │
          ▼                 ▼
   Site Management    Assigned Sites
   Worker Management  GPS Verification
   Assignments        Clock In / Out
   Live Tracking      Active Session
```
Protected backend routes use role restrictions to control access.
---
⏱️ Session Management
Each work session stores:
Worker
Site
Clock-in time
Clock-out time
Duration
Clock-in location
GPS location logs
Session status
Session states include:
```text
active
completed
```
Session Lifecycle
```text
        ┌─────────────┐
        │    IDLE     │
        └──────┬──────┘
               │
               │ Clock In
               ▼
        ┌─────────────┐
        │   ACTIVE    │
        └──────┬──────┘
               │
               │ Clock Out
               ▼
        ┌─────────────┐
        │  COMPLETED  │
        └─────────────┘
```
---
📡 Real-Time Location Tracking
SiteSync uses Socket.IO for real-time communication.
When a manager watches a site, the manager dashboard joins:
```text
site-{siteId}
```
When the worker's mobile application sends a location update:
```text
Worker
   ↓
POST /api/sessions/location
   ↓
Backend
   ↓
Socket.IO
   ↓
site-{siteId}
   ↓
Manager Dashboard
   ↓
Worker Marker Updated
```
The manager's worker marker can then be updated without manually refreshing the page.
---
🔌 REST API
The backend exposes REST APIs for authentication, workers, sites, and sessions.
🔐 Authentication
Method	Endpoint	Description
`POST`	`/api/auth/register`	Register a user
`POST`	`/api/auth/login`	Authenticate a user
`GET`	`/api/auth/me`	Get authenticated user
👥 Users / Workers
Method	Endpoint	Description
`GET`	`/api/users`	Retrieve users
`GET`	`/api/users?role=worker`	Retrieve workers
`POST`	`/api/users/workers`	Create worker
`PUT`	`/api/users/workers/:id`	Update worker
`DELETE`	`/api/users/workers/:id`	Deactivate worker
📍 Sites
Method	Endpoint	Description
`GET`	`/api/sites`	Retrieve sites
`GET`	`/api/sites/:id`	Retrieve a specific site
`POST`	`/api/sites`	Create a site
`PUT`	`/api/sites/:id`	Update a site
`DELETE`	`/api/sites/:id`	Delete a site
`POST`	`/api/sites/:id/assign`	Assign worker
`DELETE`	`/api/sites/:id/assign/:workerId`	Remove worker
⏱️ Sessions
Method	Endpoint	Description
`POST`	`/api/sessions/clock-in`	Start work session
`POST`	`/api/sessions/location`	Log worker GPS location
`POST`	`/api/sessions/clock-out`	Complete work session
`GET`	`/api/sessions/active`	Get worker's active session
`GET`	`/api/sessions/my`	Get worker session history
`GET`	`/api/sessions/site/:siteId`	Get sessions for a site
`GET`	`/api/sites/:id/sessions`	Get site sessions
❤️ Health Check
```text
GET /api/health
```
Returns:
```json
{
  "status": "ok"
}
```
---
🗄️ Database Design
SiteSync uses MongoDB with Mongoose.
👤 User
```text
User
├── name
├── email
├── password
├── role
├── manager
├── phone
├── isActive
└── timestamps
```
Passwords are hashed using bcryptjs before being stored.
📍 Site
```text
Site
├── name
├── address
├── geofence
├── center
├── areaSqMeters
├── manager
├── assignedWorkers
├── isActive
└── timestamps
```
The geofence is stored as a GeoJSON Polygon.
MongoDB `2dsphere` indexes support geospatial queries.
⏱️ Session
```text
Session
├── worker
├── site
├── clockIn
├── clockOut
├── durationMinutes
├── clockInLocation
├── locationLogs[]
├── status
└── timestamps
```
Each location log contains:
```text
GPS coordinates
GPS accuracy
Timestamp
```
---
🛠️ Technology Stack
Category	Technology
Web Frontend	React 18
Routing	React Router
Web Maps	Leaflet
Map Drawing	Leaflet Draw
Geospatial Processing	Turf.js
Mobile	React Native
Mobile Framework	Expo 54
Navigation	React Navigation
GPS	Expo Location
Secure Storage	Expo Secure Store
Backend	Node.js
API Framework	Express.js
Authentication	JWT
Password Hashing	bcryptjs
Validation	express-validator
Database	MongoDB
ODM	Mongoose
Real-Time Communication	Socket.IO
HTTP Client	Axios
Map Tiles	OpenStreetMap
Version Control	Git / GitHub
---
📂 Project Structure
```text
SiteSync/
│
├── client/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   └── AppLayout.css
│   │   │   │
│   │   │   ├── sites/
│   │   │   │   ├── SiteModal.jsx
│   │   │   │   ├── AssignWorkerModal.jsx
│   │   │   │   ├── GeofenceMap.jsx
│   │   │   │   └── GeofenceMap.css
│   │   │   │
│   │   │   └── workers/
│   │   │       └── WorkerModal.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SitesPage.jsx
│   │   │   ├── WorkersPage.jsx
│   │   │   └── LiveTrackingPage.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   │
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   └── UI.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── SitesScreen.js
│   │   │   └── ClockInScreen.js
│   │   │
│   │   └── utils/
│   │       └── api.js
│   │
│   ├── assets/
│   ├── App.js
│   ├── app.json
│   └── package.json
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Site.js
│   │   └── Session.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── sites.js
│   │   └── sessions.js
│   │
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── screenshots/
│   ├── banner.png
│   │
│   ├── web/
│   │   ├── 01-login.png
│   │   ├── 02-dashboard.png
│   │   ├── 03-sites.png
│   │   ├── 04-create-site.png
│   │   ├── 05-workers.png
│   │   ├── 06-add-worker.png
│   │   ├── 07-worker-assignment.png
│   │   └── 08-live-tracking.png
│   │
│   └── mobile/
│       ├── 01-login.png
│       ├── 02-sites.png
│       ├── 03-location.png
│       ├── 04-clock-in.png
│       ├── 05-active-session.png
│       └── 06-clock-out.png
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```
---
⚙️ Installation
Prerequisites
Make sure the following are installed:
Node.js 18+
npm
Git
MongoDB Atlas account
Expo-compatible mobile environment
---
1️⃣ Clone the Repository
```bash
git clone https://github.com/AbhinavBZ/SiteSync.git
cd SiteSync
```
---
2️⃣ Install Dependencies
From the root directory:
```bash
npm run install-all
```
This installs dependencies for the project components.
---
🔐 Environment Variables
Create:
```text
server/.env
```
Example:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
PORT=5000
```
> ⚠️ Never commit `.env` to GitHub.
---
▶️ Running the Application
Start Web Dashboard + Backend
From the project root:
```bash
npm run dev
```
The web dashboard runs at:
```text
http://localhost:3000
```
The backend API runs at:
```text
http://localhost:5000
```
---
📱 Mobile Application Setup
From the root:
```bash
npm run mobile
```
or:
```bash
cd mobile
npx expo start
```
Expo provides options for running the application on a connected device or emulator.
---
📡 Physical Device Networking
When running the mobile application on a physical phone, `localhost` refers to the phone itself.
Therefore, the mobile application must use the development machine's local network IP.
For example:
```text
http://192.168.x.x:5000
```
The phone and development machine should be connected to the same network.
---
🔒 Security Notes
The project keeps sensitive configuration outside the source code.
Do not commit:
```text
.env
Database credentials
JWT secrets
Private API keys
```
Use environment variables for sensitive configuration.
---
📸 Screenshots
The screenshots below are intended to demonstrate the actual SiteSync workflow.
🖥️ Web Platform
Authentication
<p align="center">
  <img src="screenshots/web/01-login.png" width="850" alt="Manager Login">
</p>
Dashboard
<p align="center">
  <img src="screenshots/web/02-dashboard.png" width="850" alt="Dashboard">
</p>
Site Management
<p align="center">
  <img src="screenshots/web/03-sites.png" width="850" alt="Site Management">
</p>
Geofence Creation
<p align="center">
  <img src="screenshots/web/04-create-site.png" width="850" alt="Geofence Creation">
</p>
Worker Management
<p align="center">
  <img src="screenshots/web/05-workers.png" width="850" alt="Worker Management">
</p>
Worker Assignment
<p align="center">
  <img src="screenshots/web/07-worker-assignment.png" width="850" alt="Worker Assignment">
</p>
Live Tracking
<p align="center">
  <img src="screenshots/web/08-live-tracking.png" width="900" alt="Live Tracking">
</p>
---
📱 Mobile Application
Worker Login
<p align="center">
  <img src="screenshots/mobile/01-login.png" width="280" alt="Worker Login">
</p>
Assigned Sites
<p align="center">
  <img src="screenshots/mobile/02-sites.png" width="280" alt="Assigned Sites">
</p>
GPS Verification
<p align="center">
  <img src="screenshots/mobile/03-location.png" width="280" alt="GPS Verification">
</p>
Clock In
<p align="center">
  <img src="screenshots/mobile/04-clock-in.png" width="280" alt="Clock In">
</p>
Active Session
<p align="center">
  <img src="screenshots/mobile/05-active-session.png" width="280" alt="Active Session">
</p>
Clock Out
<p align="center">
  <img src="screenshots/mobile/06-clock-out.png" width="280" alt="Clock Out">
</p>
---
📊 Project Status
Component	Status
Manager Authentication	✅
Worker Authentication	✅
JWT Authentication	✅
Password Hashing	✅
Role-Based Authorization	✅
Manager Dashboard	✅
Site Creation	✅
Site Editing	✅
Site Deletion	✅
Polygon Geofence Drawing	✅
Geofence Validation	✅
Geofence Area Calculation	✅
Worker Management	✅
Worker Assignment	✅
GPS Location Detection	✅
Server-Side Geofence Verification	✅
Clock-In	✅
Active Session	✅
Clock-Out	✅
GPS Location Logging	✅
30-Second Location Pings	✅
Socket.IO Location Broadcasting	✅
Manager Live Tracking	✅
MongoDB Atlas Integration	✅
Active Session Restoration	✅
---
🔮 Future Improvements
Potential extensions to the current system include:
📊 Advanced attendance analytics
📄 Automated timesheet reports
📥 CSV/PDF report generation
🔔 Push notifications
📈 Workforce performance analytics
🗺️ Enhanced location history visualization
🕒 Detailed attendance summaries
☁️ Production deployment
🔐 Additional production security hardening
📱 Production Android/iOS builds
---
🧠 What This Project Demonstrates
SiteSync brings together multiple software engineering concepts into one end-to-end application:
```text
                    SiteSync
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   Web Frontend    Mobile App       Backend API
       │               │                │
       └───────────────┼────────────────┘
                       │
                       ▼
                  REST APIs
                       │
                       ▼
                Authentication
                       │
                       ▼
              Geospatial Processing
                       │
                       ▼
                  MongoDB
                       │
                       ▼
                 Socket.IO
                       │
                       ▼
              Real-Time Tracking
```
The project demonstrates practical implementation of:
Full-stack application architecture
REST API development
JWT authentication
Role-based authorization
MongoDB data modeling
GeoJSON
Geospatial database queries
GPS integration
Geofencing
React development
React Native development
Real-time communication
Session management
Client-server integration
---
👨‍💻 Author
Abhinav Bhardwaj
B.Tech — Computer Science Engineering
Areas of Interest
`Full-Stack Development` · `React` · `Node.js` · `AI/ML` · `Generative AI`
---
<p align="center">
⭐ If you found SiteSync interesting, consider starring the repository.
</p>
