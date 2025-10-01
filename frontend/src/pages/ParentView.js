import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const ParentView = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [busPosition, setBusPosition] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mapCenter] = useState([10.762622, 106.660172]); // Ho Chi Minh City center

  useEffect(() => {
    // Initialize socket connection for parent
    const token = localStorage.getItem('authToken');
    if (token) {
      socketService.connect(token);
    }

    // Initialize mock data
    initializeMockData();

    // Setup alert listeners
    socketService.onAlert(handleAlert);

    return () => {
      socketService.offAlert(handleAlert);
      if (selectedChild?.busId) {
        socketService.unsubscribeFromBus(selectedChild.busId);
      }
    };
  }, []);

  const initializeMockData = () => {
    // Mock children data for parent
    const mockChildren = [
      {
        id: 1,
        name: 'Nguyễn Văn An',
        grade: '10A1',
        busId: 1,
        busPlate: '51B-12345',
        routeName: 'Tuyến 01 - Quận 1',
        stopName: 'Công viên 23/9',
        shift: 'PM',
        scheduledTime: '16:45',
        driverName: 'Nguyễn Văn Tài',
        driverPhone: '0901234567'
      },
      {
        id: 9,
        name: 'Mai Văn Khoa',
        grade: '10C1',
        busId: 1,
        busPlate: '51B-12345',
        routeName: 'Tuyến 01 - Quận 1',
        stopName: 'Công viên 23/9',
        shift: 'PM',
        scheduledTime: '16:45',
        driverName: 'Nguyễn Văn Tài',
        driverPhone: '0901234567'
      }
    ];

    setChildren(mockChildren);
    
    // Auto-select first child
    if (mockChildren.length > 0) {
      selectChild(mockChildren[0]);
    }
  };

  const selectChild = (child) => {
    // Unsubscribe from previous bus if different
    if (selectedChild?.busId && selectedChild.busId !== child.busId) {
      socketService.unsubscribeFromBus(selectedChild.busId);
    }

    setSelectedChild(child);
    
    // Subscribe to bus updates
    socketService.subscribeToBus(child.busId, (data) => {
      if (data.type === 'location') {
        setBusPosition({
          lat: data.lat,
          lng: data.lng,
          speed: data.speed,
          heading: data.heading,
          timestamp: data.timestamp
        });
        setLastUpdate(new Date().toISOString());
      }
    });

    // Set initial mock position
    setBusPosition({
      lat: 10.770123,
      lng: 106.661234,
      speed: 25.5,
      heading: 120,
      timestamp: new Date().toISOString()
    });
    setLastUpdate(new Date().toISOString());
  };

  const handleAlert = (alertData) => {
    setAlerts(prev => [...prev, {
      id: Date.now(),
      ...alertData,
      timestamp: new Date().toISOString()
    }]);

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Thông báo xe buýt', {
        body: alertData.message,
        icon: '/favicon.ico'
      });
    }

    // Auto-remove alert after 15 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== Date.now()));
    }, 15000);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Đã bật thông báo! Bạn sẽ nhận được thông báo khi xe buýt sắp tới.');
        }
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN');
  };

  const calculateETA = () => {
    if (!busPosition || !selectedChild) return 'Không xác định';
    
    // Mock ETA calculation
    const baseETA = 5; // minutes
    const variation = Math.floor(Math.random() * 5) - 2; // -2 to +3 minutes
    const eta = Math.max(1, baseETA + variation);
    
    return `${eta} phút`;
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'near_stop': return '#2196f3';
      case 'delay': return '#ff9800';
      case 'emergency': return '#f44336';
      default: return '#4caf50';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'near_stop': return '🚌';
      case 'delay': return '⏰';
      case 'emergency': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>
        👨‍👩‍👧‍👦 Theo dõi xe buýt con em
      </h1>

      {/* Notification Permission */}
      {'Notification' in window && Notification.permission === 'default' && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🔔 Bật thông báo để nhận cảnh báo khi xe buýt sắp tới</span>
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '5px 15px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Bật thông báo
          </button>
        </div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                padding: '12px',
                margin: '5px 0',
                backgroundColor: '#fff',
                border: `2px solid ${getAlertColor(alert.type)}`,
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{getAlertIcon(alert.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: getAlertColor(alert.type) }}>
                    {alert.type === 'near_stop' ? 'Xe buýt sắp tới!' :
                     alert.type === 'delay' ? 'Xe buýt bị trễ' :
                     alert.type === 'emergency' ? 'Cảnh báo khẩn cấp' : 'Thông báo'}
                  </div>
                  <div style={{ color: '#333', margin: '5px 0' }}>{alert.message}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {formatTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Children Selection */}
        <div style={{ minWidth: '300px', flex: '1' }}>
          <h3>Chọn con em cần theo dõi</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '10px',
            marginBottom: '20px'
          }}>
            {children.map(child => (
              <div
                key={child.id}
                onClick={() => selectChild(child)}
                style={{
                  padding: '12px',
                  margin: '8px 0',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedChild?.id === child.id ? '#e3f2fd' : '#fff',
                  borderColor: selectedChild?.id === child.id ? '#2196f3' : '#e0e0e0'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333' }}>
                  {child.name}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Lớp: {child.grade}
                </div>
                <div style={{ fontSize: '0.8em', color: '#2196f3' }}>
                  Xe: {child.busPlate} | Tuyến: {child.routeName}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  Điểm đón: {child.stopName} ({child.scheduledTime})
                </div>
              </div>
            ))}
          </div>

          {/* Bus Status */}
          {selectedChild && (
            <div style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                Thông tin xe buýt {selectedChild.busPlate}
              </h4>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em' }}>
                  <div>
                    <strong>Tài xế:</strong> {selectedChild.driverName}<br />
                    <strong>SĐT:</strong> {selectedChild.driverPhone}<br />
                    <strong>Tuyến:</strong> {selectedChild.routeName}
                  </div>
                  <div>
                    <strong>Ca:</strong> {selectedChild.shift === 'AM' ? 'Sáng' : 'Chiều'}<br />
                    <strong>Giờ dự kiến:</strong> {selectedChild.scheduledTime}<br />
                    <strong>Điểm đón:</strong> {selectedChild.stopName}
                  </div>
                </div>
              </div>

              {busPosition && (
                <div style={{ 
                  padding: '10px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
                    🟢 Xe đang hoạt động
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#333' }}>
                    <strong>Tốc độ:</strong> {busPosition.speed.toFixed(1)} km/h<br />
                    <strong>ETA:</strong> {calculateETA()}<br />
                    <strong>Cập nhật lần cuối:</strong> {formatTime(lastUpdate)}
                  </div>
                </div>
              )}

              <div style={{ fontSize: '0.8em', color: '#666', textAlign: 'center', marginTop: '10px' }}>
                💡 Bạn sẽ nhận được thông báo khi xe sắp tới điểm đón
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <h3>Vị trí xe buýt realtime</h3>
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

              {/* Render bus position */}
              {busPosition && (
                <Marker
                  position={[busPosition.lat, busPosition.lng]}
                  icon={busIcon}
                >
                  <Popup>
                    <div>
                      <strong>Xe {selectedChild?.busPlate}</strong><br />
                      Tài xế: {selectedChild?.driverName}<br />
                      Tốc độ: {busPosition.speed.toFixed(1)} km/h<br />
                      Hướng: {busPosition.heading.toFixed(0)}°<br />
                      Cập nhật: {formatTime(busPosition.timestamp)}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Render stop marker if selected */}
              {selectedChild && (
                <Marker
                  position={[10.768751, 106.659580]} // Mock stop position
                >
                  <Popup>
                    <div>
                      <strong>{selectedChild.stopName}</strong><br />
                      Điểm đón của {selectedChild.name}<br />
                      Giờ dự kiến: {selectedChild.scheduledTime}
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Map Legend */}
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '5px',
            fontSize: '0.9em'
          }}>
            <strong>Chú thích:</strong>
            <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
              <span>🚌 Xe buýt</span>
              <span>📍 Điểm đón</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {selectedChild && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <h4>Liên hệ nhanh</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.open(`tel:${selectedChild.driverPhone}`)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📞 Gọi tài xế
            </button>
            <button
              onClick={() => window.open(`sms:${selectedChild.driverPhone}`)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💬 Nhắn tin tài xế
            </button>
            <button
              onClick={() => alert('Tính năng liên hệ nhà trường đang được phát triển')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🏫 Liên hệ nhà trường
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentView;