require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const dependentRoutes = require('./routes/dependentRoutes');
const doctorBriefRoutes = require('./routes/doctorBriefRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection (Graceful fallback if Mongo is offline)
connectDB();

// Global Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded reports statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'CareSetu API',
    tagline: 'Aapki Sehat, Aapki Kahani.',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/dependents', dependentRoutes);
app.use('/api/doctor-brief', doctorBriefRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 CareSetu Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💡 Tagline: "Aapki Sehat, Aapki Kahani."`);
  console.log(`=======================================================`);
});

module.exports = app;
