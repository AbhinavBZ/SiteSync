# **SiteSync**
Final year Project

## Tools Used
IDE -> VS Code,
DataBase -> MongoDB Workbench 

## 1. The Core Problem
Formal Statement: "Remote and field workers (construction, logistics, sales) often operate without direct supervision. Managers lack visibility into whether a worker is physically at the assigned site during working hours. Current manual reporting methods (WhatsApp/Phone) are unreliable, leading to time theft, billing disputes, and inefficient resource allocation."

## 2. The Solution Architecture
You will build a two-part system:

Mobile App (for Workers): Uses GPS to track location. It prevents "Clock In" unless the worker is inside the geofence (the specific work site).

Web Dashboard (for Managers): A "Command Center" to create work zones (geofences) on a map, view live worker positions, and generate timesheets based on location data
