import React, { useState } from 'react';
import axios from 'axios';

const UserList = ({ users, onUserDeleted, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    setDeletingId(userId);
    try {
      await axios.delete(`/api/users/${userId}`);
      onUserDeleted(userId);
    } catch (error) {
      alert('Lỗi khi xóa người dùng: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeletingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="user-list">
        <h2>Danh sách người dùng</h2>
        <p>Chưa có người dùng nào.</p>
        <button onClick={onRefresh} className="button">
          Làm mới
        </button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Danh sách người dùng ({users.length})</h2>
      <button onClick={onRefresh} className="button">
        Làm mới
      </button>
      
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tuổi:</strong> {user.age}</p>
          <p><strong>Ngày tạo:</strong> {new Date(user.created_at).toLocaleString('vi-VN')}</p>
          <button
            onClick={() => handleDelete(user.id)}
            className="button"
            style={{ backgroundColor: '#dc3545' }}
            disabled={deletingId === user.id}
          >
            {deletingId === user.id ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;