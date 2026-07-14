const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    // The geofence boundary itself — a polygon drawn by the manager on the map.
    // GeoJSON Polygon format: coordinates[0] is the outer ring, a closed loop
    // of [longitude, latitude] pairs (first point === last point).
    geofence: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
    // Centroid of the polygon. Stored separately (not derived on every read)
    // so we can sort/center maps quickly without recomputing geometry.
    // Recalculated server-side any time the geofence changes — see routes/sites.js.
    center: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    // Approximate area in square metres, for display purposes only.
    areaSqMeters: {
      type: Number,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedWorkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 2dsphere indexes enable MongoDB's native geospatial queries, e.g.
// Site.find({ geofence: { $geoIntersects: { $geometry: workerPoint } } })
// which Phase 3 will use to validate a worker's clock-in location.
siteSchema.index({ geofence: '2dsphere' });
siteSchema.index({ center: '2dsphere' });

module.exports = mongoose.model('Site', siteSchema);
