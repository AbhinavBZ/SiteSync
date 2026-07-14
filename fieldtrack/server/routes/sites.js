const express = require('express');
const { body, validationResult } = require('express-validator');
const Site = require('../models/Site');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();
const turf = require('@turf/turf');

router.use(protect);
function buildGeofenceFields(points) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error('A geofence needs at least 3 points.');
  }

  const ring = [...points];
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) {
    ring.push(ring[0]);
  }

  let polygon;
  try {
    polygon = turf.polygon([ring]);
  } catch (e) {
    throw new Error('Could not build a valid shape from the drawn points.');
  }

  const selfIntersections = turf.kinks(polygon);
  if (selfIntersections.features.length > 0) {
    throw new Error('Geofence shape is invalid — its edges are crossing each other. Try redrawing without crossing lines.');
  }

  const centroid = turf.centroid(polygon);
  const areaSqMeters = turf.area(polygon);

  return {
    geofence: { type: 'Polygon', coordinates: [ring] },
    center: { type: 'Point', coordinates: centroid.geometry.coordinates },
    areaSqMeters: Math.round(areaSqMeters),
  };
}

// ── GET /api/sites ────────────────────────────────────────
// Manager: their own sites. Worker: sites they're assigned to.
router.get('/', async (req, res) => {
  try {
    let sites;

    if (req.user.role === 'manager') {
      sites = await Site.find({ manager: req.user._id })
        .populate('assignedWorkers', 'name email phone')
        .sort('-createdAt');
    } else {
      // Worker: find sites where they appear in assignedWorkers
      sites = await Site.find({ assignedWorkers: req.user._id, isActive: true })
        .populate('manager', 'name email')
        .sort('-createdAt');
    }

    res.json({ sites });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sites.' });
  }
});

// ── GET /api/sites/:id ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id)
      .populate('assignedWorkers', 'name email phone')
      .populate('manager', 'name email');

    if (!site) return res.status(404).json({ message: 'Site not found.' });
    res.json({ site });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch site.' });
  }
});

// ── POST /api/sites ───────────────────────────────────────
router.post(
  '/',
  restrictTo('manager'),
  [
    body('name').trim().notEmpty().withMessage('Site name is required'),
    body('points').isArray({ min: 3 }).withMessage('Draw at least 3 points to form a geofence'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, address, points } = req.body;
      const { geofence, center, areaSqMeters } = buildGeofenceFields(points);

      const site = await Site.create({
        name,
        address,
        geofence,
        center,
        areaSqMeters,
        manager: req.user._id,
      });

      res.status(201).json({ site });
    } catch (err) {
      res.status(400).json({ message: err.message || 'Failed to create site.' });
    }
    }
);

// ── PUT /api/sites/:id ────────────────────────────────────
router.put('/:id', restrictTo('manager'), async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, manager: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found.' });

   const { name, address, points, isActive } = req.body;

    if (name) site.name = name;
    if (address !== undefined) site.address = address;
    if (isActive !== undefined) site.isActive = isActive;

    if (points) {
      const { geofence, center, areaSqMeters } = buildGeofenceFields(points);
      site.geofence = geofence;
      site.center = center;
      site.areaSqMeters = areaSqMeters;
    }

    await site.save();
    res.json({ site });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update site.' });
  }
});

// ── POST /api/sites/:id/assign ────────────────────────────
// Assign a worker to a site
router.post('/:id/assign', restrictTo('manager'), async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, manager: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found.' });

    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ message: 'workerId is required.' });

    // Avoid duplicate assignments
    if (!site.assignedWorkers.includes(workerId)) {
      site.assignedWorkers.push(workerId);
      await site.save();
    }

    await site.populate('assignedWorkers', 'name email phone');
    res.json({ site });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign worker.' });
  }
});

// ── DELETE /api/sites/:id/assign/:workerId ────────────────
// Remove a worker from a site
router.delete('/:id/assign/:workerId', restrictTo('manager'), async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, manager: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found.' });

    site.assignedWorkers = site.assignedWorkers.filter(
      (id) => id.toString() !== req.params.workerId
    );
    await site.save();
    res.json({ message: 'Worker removed from site.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove worker.' });
  }
});

// ── DELETE /api/sites/:id ─────────────────────────────────
router.delete('/:id', restrictTo('manager'), async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({ _id: req.params.id, manager: req.user._id });
    if (!site) return res.status(404).json({ message: 'Site not found.' });
    res.json({ message: 'Site deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete site.' });
  }
});

module.exports = router;
