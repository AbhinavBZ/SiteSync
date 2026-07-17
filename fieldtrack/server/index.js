const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const siteRoutes = require('./routes/sites');
const sessionRoutes = require('./routes/sessions');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Make io accessible to routes
app.set('io', io);

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Socket.io ────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`📡 Client connected: ${socket.id}`);

  // Manager joins a site's watching room
  socket.on('watch-site', (siteId) => {
    socket.join(`site-${siteId}`);
    console.log(`👀 Manager watching site ${siteId}`);
  });

  // Manager leaves watching
  socket.on('unwatch-site', (siteId) => {
    socket.leave(`site-${siteId}`);
    console.log(`👁 Manager stopped watching site ${siteId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ─── DB + Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });