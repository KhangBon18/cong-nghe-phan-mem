import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

function App() {
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
    <div className="App">
      <header className="header">
        <h1>Quản lý người dùng</h1>
        <p>Ứng dụng Full Stack: ReactJS + NodeJS + MySQL</p>
      </header>
      
      <div className="container">
        <div className="main-content">
          {error && <div className="error">{error}</div>}
          
          <UserForm onUserAdded={handleUserAdded} />
          
          {loading ? (
            <div className="loading">Đang tải...</div>
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

export default App;