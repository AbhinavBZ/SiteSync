const mongoose = require('mongoose');

// A single LocationLog is one GPS ping sent by the worker's phone
// while they are clocked in. Stored as a GeoJSON Point so we can
// run geospatial queries on them in Phase 4/5 if needed.
const locationLogSchema = new mongoose.Schema(
  {
    coords: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
    },
    accuracy: Number, // metres — GPS accuracy reported by the device
  },
  { timestamps: true }
);

const sessionSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    clockIn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    clockOut: {
      type: Date,
      default: null, // null means the worker is still clocked in
    },
    // Duration in minutes — computed when the worker clocks out and
    // stored so reports don't have to subtract dates on every read.
    durationMinutes: {
      type: Number,
      default: null,
    },
    // GPS coordinate at the moment the worker clocked in.
    // Stored separately so we always know where they were at
    // clock-in time, even if location logs get big or pruned.
    clockInLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
    },
    // Running list of location pings sent every ~30s while clocked in.
    // Phase 4 (Socket.io live tracking) will read these.
    locationLogs: [locationLogSchema],

    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

sessionSchema.index({ worker: 1, status: 1 });
sessionSchema.index({ site: 1, status: 1 });
sessionSchema.index({ clockIn: -1 });

module.exports = mongoose.model('Session', sessionSchema);