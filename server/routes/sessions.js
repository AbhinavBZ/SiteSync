const express = require('express');
const Site = require('../models/Site');
const Session = require('../models/Session');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── POST /api/sessions/clock-in ───────────────────────────
// Worker clocks in. We check two things before allowing it:
//   1. The worker isn't already clocked in somewhere else.
//   2. Their GPS coordinates are inside the site's geofence polygon.
router.post('/clock-in', restrictTo('worker'), async (req, res) => {
  try {
    const { siteId, longitude, latitude, accuracy } = req.body;

    if (!siteId || longitude == null || latitude == null) {
      return res.status(400).json({ message: 'siteId, longitude and latitude are required.' });
    }

    // 1. Check for an existing active session
    const existing = await Session.findOne({ worker: req.user._id, status: 'active' });
    if (existing) {
      return res.status(400).json({
        message: 'You are already clocked in. Please clock out first.',
        sessionId: existing._id,
      });
    }

    // 2. Load the site and confirm the worker is assigned to it
    const site = await Site.findOne({ _id: siteId, assignedWorkers: req.user._id });
    if (!site) {
      return res.status(404).json({ message: 'Site not found or you are not assigned to it.' });
    }

    // 3. Geofence check — MongoDB's $geoIntersects tells us whether the
    //    worker's point falls inside the site's polygon.
    //    We re-query with a geospatial filter rather than doing the math
    //    ourselves because MongoDB uses the same GeoJSON we stored,
    //    so there's no risk of coordinate-order mix-ups.
    const workerPoint = { type: 'Point', coordinates: [longitude, latitude] };

    const siteWithinFence = await Site.findOne({
      _id: siteId,
      geofence: {
        $geoIntersects: {
          $geometry: workerPoint,
        },
      },
    });

    if (!siteWithinFence) {
      return res.status(403).json({
        message: 'You are not within the site geofence. Please move closer and try again.',
        outsideFence: true,
      });
    }

    // 4. All checks passed — create the session
    const session = await Session.create({
      worker: req.user._id,
      site: siteId,
      clockIn: new Date(),
      clockInLocation: { type: 'Point', coordinates: [longitude, latitude] },
      locationLogs: [
        {
          coords: { type: 'Point', coordinates: [longitude, latitude] },
          accuracy,
        },
      ],
      status: 'active',
    });

    await session.populate('site', 'name address');
    res.status(201).json({ session });
  } catch (err) {
    console.error('Clock-in error:', err);
    res.status(500).json({ message: 'Failed to clock in.' });
  }
});

// ── POST /api/sessions/location ───────────────────────────
// Worker's phone sends a GPS ping every 30s while clocked in.
// This is the endpoint that will feed Phase 4's Socket.io live map.
router.post('/location', restrictTo('worker'), async (req, res) => {
  try {
    const { longitude, latitude, accuracy } = req.body;

    if (longitude == null || latitude == null) {
      return res.status(400).json({ message: 'longitude and latitude are required.' });
    }

    const session = await Session.findOne({ worker: req.user._id, status: 'active' });
    if (!session) {
      return res.status(404).json({ message: 'No active session found.' });
    }

    session.locationLogs.push({
      coords: { type: 'Point', coordinates: [longitude, latitude] },
      accuracy,
    });
    await session.save();

    // Broadcast to all managers watching this site
  const io = req.app.get('io');
    io.to(`site-${session.site}`).emit('worker-location-update', {
    sessionId: session._id,
    workerId: session.worker,
    siteId: session.site,
    location: { lng: longitude, lat: latitude },
    accuracy: accuracy,
    timestamp: new Date(),
  });

    res.json({ message: 'Location logged.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to log location.' });
  }
});

// ── POST /api/sessions/clock-out ──────────────────────────
router.post('/clock-out', restrictTo('worker'), async (req, res) => {
  try {
    const session = await Session.findOne({ worker: req.user._id, status: 'active' });
    if (!session) {
      return res.status(404).json({ message: 'No active session to clock out from.' });
    }

    const clockOut = new Date();
    const durationMinutes = Math.round((clockOut - session.clockIn) / 1000 / 60);

    session.clockOut = clockOut;
    session.durationMinutes = durationMinutes;
    session.status = 'completed';
    await session.save();

    await session.populate('site', 'name address');
    
    // ─── NEW: Notify managers ────────────────────────────
    const io = req.app.get('io');
    io.to(`site-${session.site}`).emit('worker-clocked-out', {
      sessionId: session._id,
      workerId: session.worker._id,
      siteId: session.site,
    });
    // ──────────────────────────────────────────────────────
    
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clock out.' });
  }
});
// ──────────────────────────────────────────────────────

// ── GET /api/sessions/active ──────────────────────────────
// The mobile app calls this on launch so if a worker was clocked
// in and closed the app, they resume from where they left off.
router.get('/active', restrictTo('worker'), async (req, res) => {
  try {
    const session = await Session.findOne({ worker: req.user._id, status: 'active' })
      .populate('site', 'name address geofence center');
    res.json({ session }); // null if none active — that's fine
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch active session.' });
  }
});

// ── GET /api/sessions/my ──────────────────────────────────
// Worker's own session history (used for the timesheet screen in Phase 5)
router.get('/my', restrictTo('worker'), async (req, res) => {
  try {
    const sessions = await Session.find({ worker: req.user._id, status: 'completed' })
      .populate('site', 'name address')
      .sort('-clockIn')
      .limit(30);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sessions.' });
  }
});

// ── GET /api/sessions/site/:siteId ───────────────────────
// Manager view — all sessions for a specific site
router.get('/site/:siteId', restrictTo('manager'), async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.siteId, manager: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found.' });

    const sessions = await Session.find({ site: req.params.siteId })
      .populate('worker', 'name email phone')
      .sort('-clockIn')
      .limit(50);

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sessions.' });
  }
});

module.exports = router;
