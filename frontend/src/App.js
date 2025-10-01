import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DriverApp from './pages/DriverApp';
import ParentView from './pages/ParentView';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{
          padding: '15px 20px',
          backgroundColor: '#2196f3',
          color: 'white',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h2 style={{ margin: 0 }}>🚌 Smart School Bus System</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/driver" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                🚗 Tài xế
              </Link>
              <Link 
                to="/parent" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                👨‍👩‍👧‍👦 Phụ huynh
              </Link>
              <Link 
                to="/users" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                👥 Quản lý User
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/driver" element={<DriverApp />} />
          <Route path="/parent" element={<ParentView />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>

        <footer style={{
          marginTop: '50px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>Smart School Bus Tracking System v1.0</p>
          <p>Developed with ReactJS + NodeJS + MySQL + Socket.IO + Redis</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;