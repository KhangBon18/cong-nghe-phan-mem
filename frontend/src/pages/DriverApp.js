import React, { useState, useEffect } from 'react';
import socketService from '../utils/socketService';

const DriverApp = () => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentStop, setCurrentStop] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);

  useEffect(() => {
    // Initialize socket connection for driver
    const token = localStorage.getItem('authToken');
    if (token) {
      socketService.connect(token);
    }

    // Mock trip data
    initializeMockTripData();

    return () => {
      stopLocationTracking();
    };
  }, []);

  const initializeMockTripData = () => {
    // Mock current trip for driver
    const mockTrip = {
      id: 2,
      routeName: 'Tuyến 01 - Quận 1',
      busPlate: '51B-12345',
      shift: 'PM',
      serviceDate: new Date().toISOString().split('T')[0],
      status: 'planned',
      stops: [
        {
          id: 1,
          name: 'Trường THPT ABC',
          address: '123 Nguyễn Huệ, Quận 1',
          orderIndex: 1,
          status: 'pending',
          students: []
        },
        {
          id: 2,
          name: 'Công viên 23/9',
          address: 'Công viên 23/9, Quận 1',
          orderIndex: 2,
          status: 'pending',
          students: [
            { id: 1, name: 'Nguyễn Văn An', grade: '10A1', pickupStatus: 'unknown' },
            { id: 9, name: 'Mai Văn Khoa', grade: '10C1', pickupStatus: 'unknown' }
          ]
        },
        {
          id: 3,
          name: 'Chợ Bến Thành',
          address: 'Chợ Bến Thành, Quận 1',
          orderIndex: 3,
          status: 'pending',
          students: [
            { id: 2, name: 'Trần Thị Bình', grade: '11B2', pickupStatus: 'unknown' },
            { id: 10, name: 'Đặng Thị Lan', grade: '11B1', pickupStatus: 'unknown' }
          ]
        }
      ]
    };

    setCurrentTrip(mockTrip);
    setCurrentStop(mockTrip.stops[0]);
    
    // Flatten students from all stops
    const allStudents = mockTrip.stops.reduce((acc, stop) => {
      return acc.concat(stop.students.map(student => ({
        ...student,
        stopName: stop.name,
        stopId: stop.id
      })));
    }, []);
    setStudents(allStudents);
  };

  const startTrip = () => {
    if (!currentTrip) return;

    setCurrentTrip(prev => ({ ...prev, status: 'running' }));
    startLocationTracking();
    
    // Send trip start event
    socketService.sendTripStatus({
      tripId: currentTrip.id,
      status: 'started'
    });

    alert('Chuyến đi đã bắt đầu! Hệ thống bắt đầu theo dõi vị trí.');
  };

  const endTrip = () => {
    if (!currentTrip) return;

    setCurrentTrip(prev => ({ ...prev, status: 'completed' }));
    stopLocationTracking();
    
    // Send trip end event
    socketService.sendTripStatus({
      tripId: currentTrip.id,
      status: 'completed'
    });

    alert('Chuyến đi đã hoàn thành!');
  };

  const startLocationTracking = () => {
    if (isTracking) return;

    setIsTracking(true);
    
    // Send location every 3 seconds
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              busId: 1, // Mock bus ID
              tripId: currentTrip?.id,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              speed: position.coords.speed || 0,
              heading: position.coords.heading || 0
            };

            socketService.sendLocation(locationData);
          },
          (error) => {
            console.error('Location error:', error);
            // Send mock location for demo
            const mockLocation = {
              busId: 1,
              tripId: currentTrip?.id,
              lat: 10.770123 + (Math.random() - 0.5) * 0.001,
              lng: 106.661234 + (Math.random() - 0.5) * 0.001,
              speed: 20 + Math.random() * 20,
              heading: Math.random() * 360
            };
            socketService.sendLocation(mockLocation);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    }, 3000);

    setLocationInterval(interval);
  };

  const stopLocationTracking = () => {
    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
    }
    setIsTracking(false);
  };

  const arriveAtStop = (stop) => {
    setCurrentTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.id === stop.id ? { ...s, status: 'arrived' } : s
      )
    }));

    socketService.sendTripStatus({
      tripId: currentTrip.id,
      status: 'arrived',
      stopId: stop.id
    });

    setCurrentStop(stop);
  };

  const departFromStop = (stop) => {
    setCurrentTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.id === stop.id ? { ...s, status: 'departed' } : s
      )
    }));

    socketService.sendTripStatus({
      tripId: currentTrip.id,
      status: 'departed',
      stopId: stop.id
    });

    // Move to next stop
    const nextStop = currentTrip.stops.find(s => s.orderIndex === stop.orderIndex + 1);
    if (nextStop) {
      setCurrentStop(nextStop);
    }
  };

  const updateStudentStatus = (studentId, status) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, pickupStatus: status }
          : student
      )
    );

    socketService.sendTripStatus({
      tripId: currentTrip.id,
      status: 'student_update',
      studentId: studentId,
      pickupStatus: status
    });
  };

  const sendEmergencyAlert = () => {
    const message = prompt('Mô tả tình huống khẩn cấp:');
    if (message) {
      socketService.sendEmergencyAlert({
        busId: 1,
        tripId: currentTrip?.id,
        message: message
      });
      alert('Cảnh báo khẩn cấp đã được gửi!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'arrived': return '#2196f3';
      case 'departed': return '#4caf50';
      default: return '#666';
    }
  };

  const getStudentStatusColor = (status) => {
    switch (status) {
      case 'picked': return '#4caf50';
      case 'missed': return '#f44336';
      case 'unknown': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  if (!currentTrip) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🚌 Ứng dụng tài xế</h2>
        <p>Không có chuyến đi nào được phân công hôm nay.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>
        🚌 Ứng dụng tài xế
      </h1>

      {/* Trip Info */}
      <div style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Thông tin chuyến đi
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong>Tuyến:</strong> {currentTrip.routeName}<br />
            <strong>Xe:</strong> {currentTrip.busPlate}<br />
            <strong>Ca:</strong> {currentTrip.shift === 'AM' ? 'Sáng' : 'Chiều'}
          </div>
          <div>
            <strong>Ngày:</strong> {new Date(currentTrip.serviceDate).toLocaleDateString('vi-VN')}<br />
            <strong>Trạng thái:</strong> 
            <span style={{ 
              color: currentTrip.status === 'running' ? '#4caf50' : '#666',
              fontWeight: 'bold',
              marginLeft: '5px'
            }}>
              {currentTrip.status === 'planned' ? 'Chưa bắt đầu' : 
               currentTrip.status === 'running' ? 'Đang chạy' : 'Hoàn thành'}
            </span><br />
            <strong>Theo dõi GPS:</strong> 
            <span style={{ 
              color: isTracking ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
              marginLeft: '5px'
            }}>
              {isTracking ? 'Đang bật' : 'Đang tắt'}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {currentTrip.status === 'planned' && (
          <button
            onClick={startTrip}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🚀 Bắt đầu chuyến đi
          </button>
        )}
        
        {currentTrip.status === 'running' && (
          <button
            onClick={endTrip}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✅ Kết thúc chuyến đi
          </button>
        )}

        <button
          onClick={sendEmergencyAlert}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🚨 Cảnh báo khẩn cấp
        </button>
      </div>

      {/* Stops Progress */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Tiến độ tuyến đường</h3>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
          {currentTrip.stops.map((stop, index) => (
            <div
              key={stop.id}
              style={{
                minWidth: '200px',
                padding: '10px',
                border: '2px solid ' + getStatusColor(stop.status),
                borderRadius: '8px',
                backgroundColor: currentStop?.id === stop.id ? '#e3f2fd' : '#fff'
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {index + 1}. {stop.name}
              </div>
              <div style={{ fontSize: '0.8em', color: '#666', margin: '5px 0' }}>
                {stop.address}
              </div>
              <div style={{ 
                fontSize: '0.9em', 
                color: getStatusColor(stop.status),
                fontWeight: 'bold'
              }}>
                ● {stop.status === 'pending' ? 'Chờ' : 
                   stop.status === 'arrived' ? 'Đã đến' : 'Đã rời'}
              </div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {stop.students.length} học sinh
              </div>
              
              {currentTrip.status === 'running' && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  {stop.status === 'pending' && (
                    <button
                      onClick={() => arriveAtStop(stop)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.8em'
                      }}
                    >
                      Đã đến
                    </button>
                  )}
                  {stop.status === 'arrived' && (
                    <button
                      onClick={() => departFromStop(stop)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.8em'
                      }}
                    >
                      Rời đi
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Students List */}
      <div>
        <h3>Danh sách học sinh ({students.length})</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          maxHeight: '400px', 
          overflowY: 'auto' 
        }}>
          {students.map(student => (
            <div
              key={student.id}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>
                  {student.name}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Lớp: {student.grade} | Điểm đón: {student.stopName}
                </div>
                <div style={{ 
                  fontSize: '0.8em', 
                  color: getStudentStatusColor(student.pickupStatus),
                  fontWeight: 'bold'
                }}>
                  ● {student.pickupStatus === 'picked' ? 'Đã đón' : 
                     student.pickupStatus === 'missed' ? 'Vắng mặt' : 'Chưa xác định'}
                </div>
              </div>
              
              {currentTrip.status === 'running' && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => updateStudentStatus(student.id, 'picked')}
                    disabled={student.pickupStatus === 'picked'}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: student.pickupStatus === 'picked' ? '#ccc' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: student.pickupStatus === 'picked' ? 'not-allowed' : 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    Đã đón
                  </button>
                  <button
                    onClick={() => updateStudentStatus(student.id, 'missed')}
                    disabled={student.pickupStatus === 'missed'}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: student.pickupStatus === 'missed' ? '#ccc' : '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: student.pickupStatus === 'missed' ? 'not-allowed' : 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    Vắng mặt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverApp;