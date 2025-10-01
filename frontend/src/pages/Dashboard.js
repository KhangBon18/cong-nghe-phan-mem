import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import socketService from '../utils/socketService';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6B35" width="32" height="32">
      <path d="M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16M6.5,17.5A1.5,1.5 0 0,1 5,16A1.5,1.5 0 0,1 6.5,14.5A1.5,1.5 0 0,1 8,16A1.5,1.5 0 0,1 6.5,17.5M17.5,17.5A1.5,1.5 0 0,1 16,16A1.5,1.5 0 0,1 17.5,14.5A1.5,1.5 0 0,1 19,16A1.5,1.5 0 0,1 17.5,17.5M6,13V6H18V13H6Z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Stop icon
const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="24" height="24">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const Dashboard = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busPositions, setBusPositions] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [mapCenter] = useState([10.762622, 106.660172]); // Ho Chi Minh City center

  useEffect(() => {
    // Initialize socket connection (for admin dashboard)
    const token = localStorage.getItem('authToken');
    if (token) {
      socketService.connect(token);
    }

    // Mock data for demonstration
    initializeMockData();

    // Setup alert listeners
    socketService.onAlert(handleAlert);

    return () => {
      socketService.offAlert(handleAlert);
      // Cleanup subscriptions
      buses.forEach(bus => {
        socketService.unsubscribeFromBus(bus.id);
      });
    };
  }, []);

  const initializeMockData = () => {
    // Mock buses data
    const mockBuses = [
      {
        id: 1,
        plate: '51B-12345',
        capacity: 35,
        status: 'active',
        currentTrip: {
          id: 2,
          routeName: 'Tuyến 01 - Quận 1',
          driver: 'Nguyễn Văn Tài'
        }
      },
      {
        id: 2,
        plate: '51B-12346',
        capacity: 40,
        status: 'active',
        currentTrip: null
      }
    ];

    // Mock routes with stops
    const mockRoutes = [
      {
        id: 1,
        name: 'Tuyến 01 - Quận 1',
        stops: [
          { id: 1, name: 'Trường THPT ABC', lat: 10.762622, lng: 106.660172 },
          { id: 2, name: 'Công viên 23/9', lat: 10.768751, lng: 106.659580 },
          { id: 3, name: 'Chợ Bến Thành', lat: 10.772356, lng: 106.698234 },
          { id: 4, name: 'Bitexco Tower', lat: 10.771995, lng: 106.704120 },
          { id: 5, name: 'Phố đi bộ Nguyễn Huệ', lat: 10.774772, lng: 106.701424 }
        ]
      }
    ];

    setBuses(mockBuses);
    setRoutes(mockRoutes);

    // Subscribe to active buses
    mockBuses.forEach(bus => {
      if (bus.status === 'active') {
        subscribeTobus(bus.id);
      }
    });

    // Mock initial position for active bus
    setBusPositions({
      1: {
        lat: 10.770123,
        lng: 106.661234,
        speed: 25.5,
        heading: 120,
        timestamp: new Date().toISOString()
      }
    });
  };

  const subscribeTobus = (busId) => {
    socketService.subscribeToBus(busId, (data) => {
      if (data.type === 'location') {
        setBusPositions(prev => ({
          ...prev,
          [data.busId]: {
            lat: data.lat,
            lng: data.lng,
            speed: data.speed,
            heading: data.heading,
            timestamp: data.timestamp
          }
        }));
      }
    });
  };

  const handleAlert = (alertData) => {
    setAlerts(prev => [...prev, {
      id: Date.now(),
      ...alertData,
      timestamp: new Date().toISOString()
    }]);

    // Auto-remove alert after 10 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== Date.now()));
    }, 10000);
  };

  const selectBus = (bus) => {
    setSelectedBus(bus);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>
        🚌 Smart School Bus Dashboard
      </h1>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: alert.type === 'emergency' ? '#ffebee' : '#e3f2fd',
                border: `1px solid ${alert.type === 'emergency' ? '#f44336' : '#2196f3'}`,
                borderRadius: '4px',
                color: alert.type === 'emergency' ? '#c62828' : '#1565c0'
              }}
            >
              <strong>{alert.type.toUpperCase()}:</strong> {alert.message}
              <span style={{ float: 'right', fontSize: '0.8em' }}>
                {formatTime(alert.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Bus List Sidebar */}
        <div style={{ width: '300px' }}>
          <h3>Danh sách xe buýt</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '10px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {buses.map(bus => {
              const position = busPositions[bus.id];
              return (
                <div
                  key={bus.id}
                  onClick={() => selectBus(bus)}
                  style={{
                    padding: '12px',
                    margin: '8px 0',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: selectedBus?.id === bus.id ? '#e3f2fd' : '#fff',
                    borderColor: selectedBus?.id === bus.id ? '#2196f3' : '#e0e0e0'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {bus.plate}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Sức chứa: {bus.capacity} học sinh
                  </div>
                  <div style={{ 
                    fontSize: '0.8em', 
                    color: bus.status === 'active' ? '#4caf50' : '#f44336' 
                  }}>
                    ● {bus.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </div>
                  {bus.currentTrip && (
                    <div style={{ fontSize: '0.8em', color: '#2196f3' }}>
                      Tuyến: {bus.currentTrip.routeName}
                    </div>
                  )}
                  {position && (
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                      Tốc độ: {position.speed} km/h | Cập nhật: {formatTime(position.timestamp)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Section */}
        <div style={{ flex: 1 }}>
          <h3>Bản đồ theo dõi realtime</h3>
          <div style={{ height: '500px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render bus positions */}
              {Object.entries(busPositions).map(([busId, position]) => {
                const bus = buses.find(b => b.id === parseInt(busId));
                return (
                  <Marker
                    key={busId}
                    position={[position.lat, position.lng]}
                    icon={busIcon}
                  >
                    <Popup>
                      <div>
                        <strong>{bus?.plate}</strong><br />
                        Tốc độ: {position.speed} km/h<br />
                        Hướng: {position.heading}°<br />
                        Cập nhật: {formatTime(position.timestamp)}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Render route stops */}
              {routes.map(route => (
                <React.Fragment key={route.id}>
                  {route.stops.map(stop => (
                    <Marker
                      key={stop.id}
                      position={[stop.lat, stop.lng]}
                      icon={stopIcon}
                    >
                      <Popup>
                        <div>
                          <strong>{stop.name}</strong><br />
                          Tuyến: {route.name}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Draw route line */}
                  <Polyline
                    positions={route.stops.map(stop => [stop.lat, stop.lng])}
                    color="#2196f3"
                    weight={3}
                    opacity={0.7}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          {/* Selected Bus Details */}
          {selectedBus && (
            <div style={{ 
              marginTop: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4>Chi tiết xe {selectedBus.plate}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <strong>Thông tin cơ bản:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>Biển số: {selectedBus.plate}</li>
                    <li>Sức chứa: {selectedBus.capacity} học sinh</li>
                    <li>Trạng thái: {selectedBus.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</li>
                  </ul>
                </div>
                
                {busPositions[selectedBus.id] && (
                  <div>
                    <strong>Vị trí hiện tại:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                      <li>Tọa độ: {busPositions[selectedBus.id].lat.toFixed(6)}, {busPositions[selectedBus.id].lng.toFixed(6)}</li>
                      <li>Tốc độ: {busPositions[selectedBus.id].speed} km/h</li>
                      <li>Hướng: {busPositions[selectedBus.id].heading}°</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {selectedBus.currentTrip && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Chuyến đi hiện tại:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>Tuyến: {selectedBus.currentTrip.routeName}</li>
                    <li>Tài xế: {selectedBus.currentTrip.driver}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;