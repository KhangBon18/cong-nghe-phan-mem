import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.user = null;
    this.subscriptions = new Map();
  }

  /**
   * Initialize socket connection
   */
  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    
    this.socket = io(serverUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.setupEventHandlers();
    
    // Authenticate after connection
    this.socket.on('connect', () => {
      console.log('🔌 Connected to SSB server');
      this.isConnected = true;
      
      if (token) {
        this.authenticate(token);
      }
    });

    return this.socket;
  }

  /**
   * Setup basic event handlers
   */
  setupEventHandlers() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.on('authenticated', (data) => {
      if (data.success) {
        this.user = data.user;
        console.log('🔐 Socket authenticated:', data.user);
      }
    });

    this.socket.on('authentication_error', (data) => {
      console.error('🔐 Authentication failed:', data.message);
    });

    this.socket.on('error', (data) => {
      console.error('❌ Socket error:', data.message);
    });
  }

  /**
   * Authenticate with JWT token
   */
  authenticate(token) {
    if (this.socket && this.isConnected) {
      this.socket.emit('authenticate', { token });
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.user = null;
      this.subscriptions.clear();
    }
  }

  /**
   * Subscribe to bus location updates
   */
  subscribeToBus(busId, callback) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return;
    }

    // Subscribe to bus updates
    this.socket.emit('subscribe:bus', { busId });
    
    // Listen for bus updates
    const eventName = 'bus_update';
    this.socket.on(eventName, callback);
    
    // Store subscription for cleanup
    this.subscriptions.set(`bus:${busId}`, { eventName, callback });
    
    console.log(`📍 Subscribed to bus ${busId}`);
  }

  /**
   * Unsubscribe from bus updates
   */
  unsubscribeFromBus(busId) {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:bus', { busId });
    
    const subscription = this.subscriptions.get(`bus:${busId}`);
    if (subscription) {
      this.socket.off(subscription.eventName, subscription.callback);
      this.subscriptions.delete(`bus:${busId}`);
    }
    
    console.log(`📍 Unsubscribed from bus ${busId}`);
  }

  /**
   * Send driver location update
   */
  sendLocation(locationData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return false;
    }

    if (!this.user || this.user.role !== 'driver') {
      console.warn('Driver authentication required');
      return false;
    }

    this.socket.emit('driver:location', locationData);
    return true;
  }

  /**
   * Send trip status update
   */
  sendTripStatus(statusData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return false;
    }

    if (!this.user || this.user.role !== 'driver') {
      console.warn('Driver authentication required');
      return false;
    }

    this.socket.emit('driver:trip_status', statusData);
    return true;
  }

  /**
   * Send emergency alert
   */
  sendEmergencyAlert(alertData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected');
      return false;
    }

    if (!this.user || this.user.role !== 'driver') {
      console.warn('Driver authentication required');
      return false;
    }

    this.socket.emit('driver:emergency', alertData);
    return true;
  }

  /**
   * Listen for alerts
   */
  onAlert(callback) {
    if (!this.socket) return;

    this.socket.on('near_stop_alert', callback);
    this.socket.on('delay_alert', callback);
    this.socket.on('emergency_alert', callback);
  }

  /**
   * Remove alert listeners
   */
  offAlert(callback) {
    if (!this.socket) return;

    this.socket.off('near_stop_alert', callback);
    this.socket.off('delay_alert', callback);
    this.socket.off('emergency_alert', callback);
  }

  /**
   * Generic event listener
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Generic event emitter
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      authenticated: !!this.user,
      user: this.user,
      subscriptions: Array.from(this.subscriptions.keys())
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;