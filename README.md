# 📍 SiteSync — Geo-Fenced Workforce Management Platform

<p align="center">
  <img src="screenshots/banner.png" alt="SiteSync Banner" width="900">
</p>

<p align="center">
  <strong>Geo-Fenced Workforce Management Platform</strong>
</p>

<p align="center">
  A full-stack platform for managing field workers, work sites, assignments, GPS-based verification, and attendance sessions.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-Mobile-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)

</p>

---

# 📌 Table of Contents

- [Overview](#-overview)
- [Problem](#-problem)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [How SiteSync Works](#-how-sitesync-works)
- [System Architecture](#-system-architecture)
- [Manager Web Dashboard](#-manager-web-dashboard)
- [Worker Mobile Application](#-worker-mobile-application)
- [Geofencing](#-geofencing)
- [Authentication and Authorization](#-authentication-and-authorization)
- [REST API](#-rest-api)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Workflow](#-project-workflow)
- [Current Implementation](#-current-implementation)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

# 🚀 Overview

**SiteSync** is a full-stack workforce management platform designed for organizations that manage employees working across multiple physical locations.

The platform consists of two major interfaces:

### 🖥️ Manager Web Dashboard

Managers can:

- Authenticate securely
- Create and manage work sites
- Configure geofence parameters
- Create and manage workers
- Assign workers to specific sites
- Manage workforce information

### 📱 Worker Mobile Application

Workers can:

- Log in securely
- View assigned work sites
- Obtain their current GPS location
- Request clock-in
- Get verified against the site's geofence
- Start an active work session
- Send periodic location updates
- Clock out when the work session ends

The backend acts as the central authority for authentication, authorization, site management, worker management, geofence validation, and session handling.

---

# 🎯 Problem

Managing field workers who operate from different physical locations can make attendance verification difficult.

Traditional attendance systems may not provide a reliable way to verify whether a worker is physically present at their assigned work location.

SiteSync addresses this by combining:

```text
Workforce Management
        +
GPS Location
        +
Geofencing
        +
Server-side Verification
        +
Attendance Sessions
