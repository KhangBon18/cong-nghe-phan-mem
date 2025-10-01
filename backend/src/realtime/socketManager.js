const { Server } = require('socket.io');
const Redis = require('ioredis');
const authService = require('../modules/auth/services/authService');

class SocketManager {
  constructor() {
    this.io = null;
    this.redis = null;
    this.redisSub = null;
    this.connectedClients = new Map(); // userId -> socketId mapping
    this.userSockets = new Map(); // socketId -> user data mapping
  }

  /**
   * Initialize Socket.IO server
   */
  init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Initialize Redis connections
    this.initRedis();

    // Setup Socket.IO event handlers
    this.setupSocketHandlers();

    // Setup Redis pub/sub handlers
    this.setupRedisHandlers();

    console.log('🚌 SSB Socket.IO server initialized');
    return this.io;
  }

  /**
   * Initialize Redis connections
   */
  initRedis() {
    const redisConfig = {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    };

    this.redis = new Redis(redisConfig);
    this.redisSub = new Redis(redisConfig);

    this.redis.on('connect', () => console.log('✅ Redis publisher connected'));
    this.redisSub.on('connect', () => console.log('✅ Redis subscriber connected'));
    
    this.redis.on('error', (err) => console.error('❌ Redis publisher error:', err));
    this.redisSub.on('error', (err) => console.error('❌ Redis subscriber error:', err));
  }

  /**
   * Setup Socket.IO event handlers
   */
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`📱 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          const decoded = authService.verifyToken(token);
          const user = await authService.getUserProfile(decoded.id);
          
          // Store user data
          this.userSockets.set(socket.id, user);
          this.connectedClients.set(user.id, socket.id);
          
          // Join user-specific room
          socket.join(`user:${user.id}`);
          
          // Join role-specific rooms
          socket.join(`role:${user.role}`);
          
          // Join entity-specific rooms based on role
          if (user.role === 'driver' && user.driver_id) {
            socket.join(`driver:${user.driver_id}`);
          } else if (user.role === 'parent' && user.parent_id) {
            socket.join(`parent:${user.parent_id}`);
          }
          
          socket.emit('authenticated', { 
            success: true, 
            user: { id: user.id, role: user.role } 
          });
          
          console.log(`🔐 User authenticated: ${user.full_name} (${user.role})`);
        } catch (error) {
          socket.emit('authentication_error', { message: 'Invalid token' });
        }
      });

      // Handle driver location updates
      socket.on('driver:location', async (data) => {
        try {
          const user = this.userSockets.get(socket.id);
          if (!user || user.role !== 'driver') {
            socket.emit('error', { message: 'Driver authentication required' });
            return;
          }

          const locationData = {
            type: 'location',
            busId: data.busId,
            tripId: data.tripId,
            lat: data.lat,
            lng: data.lng,
            speed: data.speed || 0,
            heading: data.heading || 0,
            timestamp: new Date().toISOString(),
            driverId: user.driver_id
          };

          // Validate required fields
          if (!locationData.busId || !locationData.lat || !locationData.lng) {
            socket.emit('error', { message: 'Missing required location data' });
            return;
          }

          // Publish to Redis for real-time distribution
          await this.publishBusUpdate(`bus:${data.busId}`, locationData);
          
          // Store in Redis cache for current position
          await this.redis.setex(
            `current_position:${data.busId}`, 
            300, // 5 minutes TTL
            JSON.stringify(locationData)
          );

          socket.emit('location_received', { success: true });
        } catch (error) {
          console.error('Location update error:', error);
          socket.emit('error', { message: 'Failed to process location update' });
        }
      });

      // Handle trip status updates
      socket.on('driver:trip_status', async (data) => {
        try {
          const user = this.userSockets.get(socket.id);
          if (!user || user.role !== 'driver') {
            socket.emit('error', { message: 'Driver authentication required' });
            return;
          }

          const statusData = {
            type: 'trip_status',
            tripId: data.tripId,
            status: data.status,
            stopId: data.stopId,
            studentId: data.studentId,
            timestamp: new Date().toISOString(),
            driverId: user.driver_id
          };

          // Publish trip status update
          await this.publishBusUpdate(`trip:${data.tripId}`, statusData);
          
          socket.emit('trip_status_received', { success: true });
        } catch (error) {
          console.error('Trip status update error:', error);
          socket.emit('error', { message: 'Failed to process trip status update' });
        }
      });

      // Handle emergency alerts
      socket.on('driver:emergency', async (data) => {
        try {
          const user = this.userSockets.get(socket.id);
          if (!user || user.role !== 'driver') {
            socket.emit('error', { message: 'Driver authentication required' });
            return;
          }

          const alertData = {
            type: 'emergency',
            busId: data.busId,
            tripId: data.tripId,
            message: data.message,
            severity: 'critical',
            timestamp: new Date().toISOString(),
            driverId: user.driver_id
          };

          // Publish emergency alert to all admins
          await this.publishAlert('emergency', alertData);
          
          socket.emit('emergency_sent', { success: true });
        } catch (error) {
          console.error('Emergency alert error:', error);
          socket.emit('error', { message: 'Failed to send emergency alert' });
        }
      });

      // Handle bus subscription for tracking
      socket.on('subscribe:bus', (data) => {
        const user = this.userSockets.get(socket.id);
        if (!user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const { busId } = data;
        if (busId) {
          socket.join(`bus:${busId}`);
          socket.emit('subscription_confirmed', { busId });
        }
      });

      // Handle bus unsubscription
      socket.on('unsubscribe:bus', (data) => {
        const { busId } = data;
        if (busId) {
          socket.leave(`bus:${busId}`);
          socket.emit('unsubscription_confirmed', { busId });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const user = this.userSockets.get(socket.id);
        if (user) {
          this.connectedClients.delete(user.id);
          this.userSockets.delete(socket.id);
          console.log(`📱 User disconnected: ${user.full_name}`);
        } else {
          console.log(`📱 Client disconnected: ${socket.id}`);
        }
      });
    });
  }

  /**
   * Setup Redis pub/sub handlers
   */
  setupRedisHandlers() {
    // Subscribe to all bus channels
    this.redisSub.psubscribe('bus:*');
    this.redisSub.psubscribe('trip:*');
    this.redisSub.psubscribe('alert:*');

    this.redisSub.on('pmessage', (pattern, channel, message) => {
      try {
        const data = JSON.parse(message);
        this.handleRedisMessage(channel, data);
      } catch (error) {
        console.error('Redis message parsing error:', error);
      }
    });
  }

  /**
   * Handle Redis pub/sub messages
   */
  handleRedisMessage(channel, data) {
    if (channel.startsWith('bus:')) {
      // Broadcast to all clients subscribed to this bus
      this.io.to(channel).emit('bus_update', data);
    } else if (channel.startsWith('trip:')) {
      // Broadcast trip updates
      this.io.to(channel).emit('trip_update', data);
    } else if (channel.startsWith('alert:')) {
      // Handle different types of alerts
      this.handleAlert(data);
    }
  }

  /**
   * Handle alert distribution
   */
  handleAlert(alertData) {
    switch (alertData.type) {
      case 'emergency':
        // Send to all admins
        this.io.to('role:admin').emit('emergency_alert', alertData);
        break;
      case 'near_stop':
        // Send to specific parents
        if (alertData.parentIds) {
          alertData.parentIds.forEach(parentId => {
            this.io.to(`parent:${parentId}`).emit('near_stop_alert', alertData);
          });
        }
        break;
      case 'delay':
        // Send to relevant stakeholders
        this.io.to('role:admin').emit('delay_alert', alertData);
        if (alertData.parentIds) {
          alertData.parentIds.forEach(parentId => {
            this.io.to(`parent:${parentId}`).emit('delay_alert', alertData);
          });
        }
        break;
    }
  }

  /**
   * Publish bus update to Redis
   */
  async publishBusUpdate(channel, data) {
    try {
      await this.redis.publish(channel, JSON.stringify(data));
    } catch (error) {
      console.error('Redis publish error:', error);
    }
  }

  /**
   * Publish alert to Redis
   */
  async publishAlert(type, data) {
    try {
      await this.redis.publish(`alert:${type}`, JSON.stringify(data));
    } catch (error) {
      console.error('Redis alert publish error:', error);
    }
  }

  /**
   * Get current position from Redis cache
   */
  async getCurrentPosition(busId) {
    try {
      const position = await this.redis.get(`current_position:${busId}`);
      return position ? JSON.parse(position) : null;
    } catch (error) {
      console.error('Redis get position error:', error);
      return null;
    }
  }

  /**
   * Send notification to specific user
   */
  async sendToUser(userId, event, data) {
    const socketId = this.connectedClients.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * Send notification to user role
   */
  async sendToRole(role, event, data) {
    this.io.to(`role:${role}`).emit(event, data);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      totalSockets: this.userSockets.size,
      rooms: this.io.sockets.adapter.rooms.size
    };
  }
}

module.exports = new SocketManager();