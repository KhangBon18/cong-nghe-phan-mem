const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const db = require('./models/database');
const socketManager = require('./realtime/socketManager');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🚀 Starting Smart School Bus Server...');
console.log('Environment check:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('REDIS_HOST:', process.env.REDIS_HOST || '127.0.0.1');
console.log('REDIS_PORT:', process.env.REDIS_PORT || 6379);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
socketManager.init(server);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// SSB API Routes (to be implemented)
// app.use('/api/auth', require('./modules/auth/routes/authRoutes'));
// app.use('/api/buses', require('./modules/catalog/routes/busRoutes'));
// app.use('/api/drivers', require('./modules/catalog/routes/driverRoutes'));
// app.use('/api/students', require('./modules/catalog/routes/studentRoutes'));
// app.use('/api/routes', require('./modules/catalog/routes/routeRoutes'));
// app.use('/api/schedules', require('./modules/schedule/routes/scheduleRoutes'));
// app.use('/api/trips', require('./modules/schedule/routes/tripRoutes'));
// app.use('/api/telemetry', require('./modules/telemetry/routes/telemetryRoutes'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');
    
    // Get socket statistics
    const socketStats = socketManager.getStats();
    
    res.json({ 
      status: 'OK', 
      message: 'Smart School Bus Server is running',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      websocket: {
        connected: true,
        stats: socketStats
      },
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await db.initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    server.listen(PORT, () => {
      console.log('🚌 Smart School Bus Server started successfully!');
      console.log(`📡 API Server: http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO: ws://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
      console.log('🎯 Ready to track school buses...');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();