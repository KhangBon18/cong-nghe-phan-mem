#!/usr/bin/env node

/**
 * Smart School Bus - Driver Location Simulator
 * 
 * This script simulates a driver sending location updates every 3 seconds
 * to demonstrate the real-time tracking functionality.
 */

const { io } = require('socket.io-client');

class DriverSimulator {
  constructor(config = {}) {
    this.config = {
      serverUrl: config.serverUrl || 'http://localhost:5001',
      busId: config.busId || 1,
      tripId: config.tripId || 2,
      driverToken: config.driverToken || 'mock-driver-token',
      updateInterval: config.updateInterval || 3000, // 3 seconds
      route: config.route || this.getDefaultRoute(),
      ...config
    };
    
    this.socket = null;
    this.currentPositionIndex = 0;
    this.isRunning = false;
    this.intervalId = null;
  }

  getDefaultRoute() {
    // Simulate route from school to various stops in Ho Chi Minh City
    return [
      { lat: 10.762622, lng: 106.660172, name: 'Trường THPT ABC' },
      { lat: 10.765123, lng: 106.659876, name: 'Di chuyển về Công viên 23/9' },
      { lat: 10.768751, lng: 106.659580, name: 'Công viên 23/9' },
      { lat: 10.769234, lng: 106.660123, name: 'Rời Công viên 23/9' },
      { lat: 10.770123, lng: 106.661234, name: 'Đang đến Chợ Bến Thành' },
      { lat: 10.771456, lng: 106.665789, name: 'Gần Chợ Bến Thành' },
      { lat: 10.772356, lng: 106.698234, name: 'Chợ Bến Thành' },
      { lat: 10.772001, lng: 106.700123, name: 'Rời Chợ Bến Thành' },
      { lat: 10.771995, lng: 106.704120, name: 'Bitexco Financial Tower' },
      { lat: 10.773456, lng: 106.702789, name: 'Di chuyển về phố đi bộ' },
      { lat: 10.774772, lng: 106.701424, name: 'Phố đi bộ Nguyễn Huệ' },
    ];
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to SSB server...');
      
      this.socket = io(this.config.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server');
        this.authenticate().then(resolve).catch(reject);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection failed:', error.message);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('📱 Disconnected from server');
        this.stop();
      });

      this.socket.on('authenticated', (data) => {
        if (data.success) {
          console.log('🔐 Authentication successful');
        }
      });

      this.socket.on('authentication_error', (data) => {
        console.error('🔐 Authentication failed:', data.message);
        reject(new Error(data.message));
      });

      this.socket.on('location_received', (data) => {
        if (data.success) {
          console.log('📍 Location update confirmed');
        }
      });

      this.socket.on('error', (data) => {
        console.error('❌ Socket error:', data.message);
      });
    });
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      // In a real implementation, this would be a valid JWT token
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.driver.token';
      
      this.socket.emit('authenticate', { token: mockToken });
      
      // Resolve after a short delay to simulate auth process
      setTimeout(() => {
        console.log('🔐 Mock authentication completed');
        resolve();
      }, 1000);
    });
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Simulator is already running');
      return;
    }

    if (!this.socket || !this.socket.connected) {
      console.error('❌ Not connected to server');
      return;
    }

    console.log('🚀 Starting driver simulation...');
    console.log(`📊 Config: Bus ${this.config.busId}, Trip ${this.config.tripId}`);
    console.log(`🗺️ Route: ${this.config.route.length} waypoints`);
    console.log(`⏱️ Update interval: ${this.config.updateInterval}ms`);
    
    this.isRunning = true;
    this.currentPositionIndex = 0;
    
    // Send initial location
    this.sendLocationUpdate();
    
    // Start periodic updates
    this.intervalId = setInterval(() => {
      this.sendLocationUpdate();
    }, this.config.updateInterval);
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Simulator is not running');
      return;
    }

    console.log('🛑 Stopping driver simulation...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  sendLocationUpdate() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Cannot send location: not connected');
      this.stop();
      return;
    }

    const currentWaypoint = this.config.route[this.currentPositionIndex];
    
    // Add some random variation to simulate real GPS data
    const lat = currentWaypoint.lat + (Math.random() - 0.5) * 0.0001; // ~10m variation
    const lng = currentWaypoint.lng + (Math.random() - 0.5) * 0.0001;
    
    // Simulate speed and heading
    const speed = 15 + Math.random() * 25; // 15-40 km/h
    const heading = Math.random() * 360; // 0-360 degrees
    
    const locationData = {
      busId: this.config.busId,
      tripId: this.config.tripId,
      lat: lat,
      lng: lng,
      speed: Math.round(speed * 10) / 10, // Round to 1 decimal
      heading: Math.round(heading),
      timestamp: new Date().toISOString()
    };

    this.socket.emit('driver:location', locationData);
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📍 [${timestamp}] Sent location: ${currentWaypoint.name} (${lat.toFixed(6)}, ${lng.toFixed(6)}) - ${locationData.speed} km/h`);

    // Move to next waypoint (loop back to start)
    this.currentPositionIndex = (this.currentPositionIndex + 1) % this.config.route.length;
  }

  disconnect() {
    console.log('🔌 Disconnecting...');
    this.stop();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Simulate trip events
  async simulateTrip() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Not connected to server');
      return;
    }

    console.log('🚌 Starting trip simulation...');
    
    // Start trip
    this.socket.emit('driver:trip_status', {
      tripId: this.config.tripId,
      status: 'started'
    });
    console.log('🚀 Trip started');

    // Start location tracking
    this.start();

    // Simulate arriving at stops
    const stops = [
      { id: 2, name: 'Công viên 23/9', delayMs: 8000 },
      { id: 3, name: 'Chợ Bến Thành', delayMs: 16000 },
      { id: 4, name: 'Bitexco Tower', delayMs: 24000 },
      { id: 5, name: 'Phố đi bộ Nguyễn Huệ', delayMs: 32000 }
    ];

    for (const stop of stops) {
      setTimeout(() => {
        this.socket.emit('driver:trip_status', {
          tripId: this.config.tripId,
          status: 'arrived',
          stopId: stop.id
        });
        console.log(`🚏 Arrived at ${stop.name}`);
        
        // Depart after 30 seconds
        setTimeout(() => {
          this.socket.emit('driver:trip_status', {
            tripId: this.config.tripId,
            status: 'departed',
            stopId: stop.id
          });
          console.log(`🚀 Departed from ${stop.name}`);
        }, 30000);
      }, stop.delayMs);
    }

    // End trip after route completion
    setTimeout(() => {
      this.socket.emit('driver:trip_status', {
        tripId: this.config.tripId,
        status: 'completed'
      });
      console.log('✅ Trip completed');
      this.stop();
    }, 40000);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const config = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      if (key === 'busId' || key === 'tripId' || key === 'updateInterval') {
        config[key] = parseInt(value);
      } else {
        config[key] = value;
      }
    }
  }

  console.log('🚌 Smart School Bus - Driver Simulator');
  console.log('=====================================');

  const simulator = new DriverSimulator(config);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    simulator.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    simulator.disconnect();
    process.exit(0);
  });

  try {
    await simulator.connect();
    
    // Check if we should run full trip simulation or just location updates
    if (args.includes('--trip')) {
      await simulator.simulateTrip();
    } else {
      simulator.start();
      
      console.log('\n📋 Simulator is running. Commands:');
      console.log('   - Press Ctrl+C to stop');
      console.log('   - The simulator will send location updates every 3 seconds');
      console.log('   - Location data is sent to /api/telemetry endpoint');
      console.log('\n🎯 Monitoring real-time location updates...\n');
    }
  } catch (error) {
    console.error('❌ Failed to start simulator:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = DriverSimulator;

// Run as CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}