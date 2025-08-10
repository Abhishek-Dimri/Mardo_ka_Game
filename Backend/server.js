const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

// Basic env validation
['MONGO_URI'].forEach((k) => {
  if (!process.env[k]) {
    console.error(`❌ Missing required env var: ${k}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Trust proxy (if behind reverse proxy / deployment platform)
app.set('trust proxy', 1);

// Security & performance middleware
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Body parsing with limits
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));

// Health & diagnostics
app.get('/healthz', (req, res) => res.json({ status: 'ok', time: Date.now() }));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: 'Server Error' });
});

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Attach socket handlers
require('./sockets')(io);
global.io = io;

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.warn('Forcing shutdown');
    process.exit(1);
  }, 10000).unref();
};
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
