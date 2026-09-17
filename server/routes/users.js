const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes require login
router.use(protect);

// ── GET /api/users ────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;  // Add this line
    let query = {};
    if (role) query.role = role;  // Add this line
    
    const users = await User.find(query).select('-password').sort('name');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});
// ── POST /api/users/workers ───────────────────────────────
// Manager creates a new worker account
router.post(
  '/workers',
  restrictTo('manager'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, password, phone } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered.' });

      const worker = await User.create({
        name,
        email,
        password,
        phone,
        role: 'worker',
        manager: req.user._id, // Link to this manager
      });

      res.status(201).json({
        worker: {
          id: worker._id,
          name: worker.name,
          email: worker.email,
          phone: worker.phone,
          role: worker.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create worker.' });
    }
  }
);

// ── PUT /api/users/workers/:id ────────────────────────────
// Manager updates a worker
router.put('/workers/:id', restrictTo('manager'), async (req, res) => {
  try {
    // Ensure this worker belongs to the requesting manager
    const worker = await User.findOne({ _id: req.params.id, manager: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker not found.' });

    const { name, phone, isActive } = req.body;
    if (name) worker.name = name;
    if (phone !== undefined) worker.phone = phone;
    if (isActive !== undefined) worker.isActive = isActive;

    await worker.save();
    res.json({ worker });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update worker.' });
  }
});

// ── DELETE /api/users/workers/:id ────────────────────────
// Manager deactivates a worker (soft delete)
router.delete('/workers/:id', restrictTo('manager'), async (req, res) => {
  try {
    const worker = await User.findOne({ _id: req.params.id, manager: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker not found.' });

    worker.isActive = false;
    await worker.save();
    res.json({ message: 'Worker deactivated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to deactivate worker.' });
  }
});

module.exports = router;
