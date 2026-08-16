# SiteSync - Geo-Fenced Workforce Management Platform

SiteSync is a **geo-fenced workforce management platform** designed to automate employee attendance tracking and location-based work verification for distributed teams.

The platform enables organizations to monitor field workers, verify physical presence at assigned locations, and improve workforce transparency through GPS-based validation and real-time workforce insights.

---

# 🚀 Overview

Managing remote and field employees such as construction workers, logistics teams, and sales representatives is challenging due to limited visibility into their actual working locations.

Traditional attendance methods like manual registers, phone calls, and messaging apps are unreliable, resulting in:

- Time theft
- Fake attendance records
- Billing disputes
- Poor resource allocation
- Lack of workforce visibility

SiteSync solves this problem by combining **GPS tracking, geofencing, mobile applications, and backend validation** to create a reliable workforce monitoring system.

---

# 🎯 Core Problem

## Problem Statement

> Remote and field workers often operate without direct supervision. Managers lack visibility into whether workers are physically present at assigned work locations during working hours.

Existing manual reporting systems are inefficient and can lead to inaccurate attendance records and operational losses.

---

# 💡 Solution

SiteSync provides a two-part ecosystem:

## 1. Worker Mobile Application

A mobile application that allows employees to:

- View assigned work locations
- Verify their current GPS position
- Clock-in only when inside an authorized geofence
- Track active work sessions
- Clock-out after completing assigned work

The application prevents false attendance by validating the worker's location before recording attendance.

---

## 2. Manager Web Dashboard

A management dashboard that enables administrators to:

- Create and manage work locations
- Configure geofence boundaries
- Monitor active workforce sessions
- View worker activity
- Manage sites and employees
- Analyze attendance records

---

# 🏗️ System Architecture

```
                 Worker Mobile App
                 (React Native)
                       |
                       |
                 GPS Location Data
                       |
                       |
                  REST API Layer
                       |
                       |
              Node.js Backend Server
                       |
          -----------------------------
          |                           |
     Authentication              Geofence Engine
          |                           |
          -----------------------------
                       |
                 MongoDB Database
                       |
                       |
              Manager Web Dashboard
```

---

# ✨ Key Features

## 📍 GPS Based Geofencing

- Defines authorized work zones
- Validates employee location before attendance
- Prevents unauthorized clock-in attempts

---

## ⏱️ Smart Attendance System

- Location verified clock-in
- Active session tracking
- Automated clock-out workflow
- Attendance history management

---

## 📱 Mobile Workforce Application

- Worker authentication
- Assigned site management
- Real-time location validation
- Session monitoring

---

## 🖥️ Manager Dashboard

- Create work sites
- Manage employees
- Monitor workforce activity
- View attendance records

---

## 🔐 Backend Validation

- Server-side geofence verification
- Secure API communication
- Reliable attendance processing

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|-|-|
| React Native | Mobile Application |
| React.js | Web Dashboard |
| JavaScript | Application Logic |

---

## Backend

| Technology | Purpose |
|-|-|
| Node.js | Backend Runtime |
| Express.js | REST API Development |

---

## Database

| Technology | Purpose |
|-|-|
| MongoDB | Data Storage |
| MongoDB Workbench | Database Management |

---

## Development Tools

| Tool | Purpose |
|-|-|
| VS Code | Development Environment |
| Git & GitHub | Version Control |
| Postman | API Testing |

---

# 📂 Project Structure

```
SiteSync/

│
├── mobile-app/
│   ├── screens/
│   ├── components/
│   ├── services/
│   └── App.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── dashboard/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

# 🔄 Application Workflow

```
Worker Opens App
        |
        ↓
Login Authentication
        |
        ↓
Select Assigned Site
        |
        ↓
Fetch Current GPS Location
        |
        ↓
Server Validates Geofence
        |
        ↓
Location Verified?
        |
   YES ------ NO
    |          |
 Clock-In    Reject
    |
 Active Session Tracking
    |
 Clock-Out
    |
 Attendance Saved
```

---

# 📊 Database Design

## Users Collection

Stores employee information:

- User ID
- Name
- Email
- Role
- Assigned Sites


## Sites Collection

Stores workplace information:

- Site ID
- Site Name
- Latitude
- Longitude
- Geofence Radius


## Sessions Collection

Stores attendance sessions:

- Employee ID
- Site ID
- Clock-in Time
- Clock-out Time
- Location Verification Status

---

# 🔒 Security Considerations

- Server-side location validation
- Authentication protected APIs
- Prevent client-side attendance manipulation
- Controlled access based on user roles

---

# 📈 Future Improvements

- Live worker tracking dashboard
- Route history visualization
- Attendance analytics
- Push notifications
- Offline location caching
- AI-based workforce productivity insights
- Payroll integration
- Multi-company support

---

# 👨‍💻 Developer

**Abhinav Bhardwaj**

Computer Science Student | Full-Stack Developer | AI/ML Enthusiast

---

# ⭐ Project Highlights

- Real-world workforce management solution
- GPS + Geofencing based verification
- Full-stack mobile and web architecture
- Real-time location-driven workflows
- Designed for scalable field operations
