import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import UserList from './UserList';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#333' }}>👥 Quản lý người dùng</h1>
        <p style={{ color: '#666' }}>Ứng dụng Full Stack: ReactJS + NodeJS + MySQL</p>
      </header>
      
      <div className="container">
        <div className="main-content">
          {error && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}
          
          <UserForm onUserAdded={handleUserAdded} />
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#666'
            }}>
              Đang tải...
            </div>
          ) : (
            <UserList 
              users={users} 
              onUserDeleted={handleUserDeleted}
              onRefresh={fetchUsers}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;