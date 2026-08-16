**SiteSync** is a geo-fenced workforce management platform designed to automate employee attendance tracking and location-based work verification for distributed teams.

• Developed a full-stack mobile and web solution for managing remote workforce operations using modern application architecture.
• Implemented GPS-based geofencing to verify employee presence within authorized work locations before allowing clock-in and clock-out actions.
• Built a React Native mobile application with location services for real-time workforce tracking and session management.
• Designed backend APIs using Node.js for authentication, site management, session handling, and geolocation validation.
• Implemented periodic location updates and server-side verification to improve reliability and prevent false attendance records.
• Designed database workflows for managing users, work sites, active sessions, and attendance history.
• Focused on building a scalable solution for improving workforce transparency, operational efficiency, and field-team management.


## Tools Used
IDE -> VS Code,
DataBase -> MongoDB Workbench 

## 1. The Core Problem
Formal Statement: "Remote and field workers (construction, logistics, sales) often operate without direct supervision. Managers lack visibility into whether a worker is physically at the assigned site during working hours. Current manual reporting methods (WhatsApp/Phone) are unreliable, leading to time theft, billing disputes, and inefficient resource allocation."

## 2. The Solution Architecture
You will build a two-part system:

Mobile App (for Workers): Uses GPS to track location. It prevents "Clock In" unless the worker is inside the geofence (the specific work site).

Web Dashboard (for Managers): A "Command Center" to create work zones (geofences) on a map, view live worker positions, and generate timesheets based on location data
