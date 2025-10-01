#!/usr/bin/env node

/**
 * Simple Driver Simulator for Testing
 */

const { io } = require('socket.io-client');

console.log('🚌 Simple Driver Simulator Starting...');
console.log('====================================');

const socket = io('http://localhost:5001');

let updateCount = 0;
let intervalId = null;

// Mock route points in Ho Chi Minh City
const route = [
  { lat: 10.762622, lng: 106.660172, name: 'Trường THPT ABC' },
  { lat: 10.765123, lng: 106.659876, name: 'Công viên 23/9' },
  { lat: 10.768751, lng: 106.659580, name: 'Chợ Bến Thành' },
  { lat: 10.772356, lng: 106.698234, name: 'Bitexco Tower' },
  { lat: 10.774772, lng: 106.701424, name: 'Phố đi bộ Nguyễn Huệ' },
];

socket.on('connect', () => {
  console.log('🔌 Connected to server:', socket.id);
  console.log('📍 Starting location simulation...');
  
  startLocationSimulation();
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
  if (intervalId) {
    clearInterval(intervalId);
  }
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

// Listen for responses
socket.on('position_updated', (data) => {
  console.log('✅ Position updated successfully:', data);
});

socket.on('bus_update', (data) => {
  console.log('📡 Bus update broadcasted:', data);
});

function startLocationSimulation() {
  let currentIndex = 0;
  
  intervalId = setInterval(() => {
    const currentPosition = route[currentIndex % route.length];
    
    // Add some random variation to make it more realistic
    const lat = currentPosition.lat + (Math.random() - 0.5) * 0.001;
    const lng = currentPosition.lng + (Math.random() - 0.5) * 0.001;
    
    const locationData = {
      busId: 1,
      driverId: 1,
      tripId: 1,
      lat: lat,
      lng: lng,
      timestamp: Date.now(),
      speed: Math.floor(Math.random() * 30) + 20, // 20-50 km/h
      heading: Math.floor(Math.random() * 360),
      accuracy: 5,
      location_name: currentPosition.name
    };
    
    console.log(`📍 [${++updateCount}] Sending location: ${currentPosition.name} (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
    
    socket.emit('driver:location', locationData);
    
    currentIndex++;
    
    // Stop after 20 updates (1 minute)
    if (updateCount >= 20) {
      console.log('✅ Simulation completed! Stopping...');
      clearInterval(intervalId);
      setTimeout(() => {
        socket.disconnect();
        process.exit(0);
      }, 1000);
    }
    
  }, 3000); // Every 3 seconds
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping simulation...');
  if (intervalId) {
    clearInterval(intervalId);
  }
  socket.disconnect();
  process.exit(0);
});

console.log('Press Ctrl+C to stop the simulation');