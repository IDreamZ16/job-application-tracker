const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const contactsRoutes = require('./routes/contacts');
const activitiesRoutes = require('./routes/activities');

const app = express();

// Security and parsing middleware localhost used for development
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Health check — useful for Docker and CI
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes — all require a valid JWT
app.use('/api/jobs', authMiddleware, jobsRoutes);
app.use('/api/jobs/:jobId/contacts', authMiddleware, contactsRoutes);
app.use('/api/jobs/:jobId/activities', authMiddleware, activitiesRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;