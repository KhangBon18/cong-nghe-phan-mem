# Full Stack Application

Ứng dụng full-stack sử dụng ReactJS frontend, NodeJS backend và MySQL database.

## Cấu trúc dự án

```
Project/
├── frontend/          # ReactJS Application
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
├── backend/           # NodeJS API Server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── database/          # SQL Files
│   ├── schema.sql     # Database schema
│   ├── sample_data.sql # Sample data
│   └── README.md      # Database documentation
└── README.md
```

## Công nghệ sử dụng

### Frontend
- **ReactJS 18.2.0** - Framework UI
- **Axios** - HTTP client
- **React Router DOM** - Routing

### Backend
- **NodeJS** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - MySQL driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Database
- **MySQL** - Relational database

## Tính năng

- ✅ Thêm người dùng mới
- ✅ Hiển thị danh sách người dùng
- ✅ Xóa người dùng
- ✅ Validation dữ liệu
- ✅ Error handling
- ✅ Responsive design

## Cài đặt và chạy

### Yêu cầu
- Node.js (v14 hoặc cao hơn)
- MySQL Server
- npm hoặc yarn

### 1. Setup Database

Tạo MySQL database:
```sql
CREATE DATABASE fullstack_app;
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật thông tin database trong file `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=fullstack_app
DB_PORT=3306
```

Chạy server:
```bash
npm run dev  # Development mode với nodemon
# hoặc
npm start    # Production mode
```

Server sẽ chạy trên http://localhost:5000

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy trên http://localhost:3000

## API Endpoints

### Users
- `GET /api/users` - Lấy danh sách tất cả người dùng
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INT NOT NULL CHECK (age > 0 AND age <= 120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Scripts

### Backend
- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với nodemon

### Frontend
- `npm start` - Chạy development server
- `npm run build` - Build production
- `npm test` - Chạy tests

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=fullstack_app
DB_PORT=3306
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Database Connection Issues
1. Đảm bảo MySQL server đang chạy
2. Kiểm tra thông tin kết nối trong file `.env`
3. Tạo database nếu chưa có
4. Kiểm tra quyền truy cập của user MySQL

### CORS Issues
1. Đảm bảo CORS_ORIGIN được set đúng trong backend
2. Frontend proxy được cấu hình trong package.json

### Port Conflicts
1. Thay đổi PORT trong backend/.env
2. Cập nhật proxy trong frontend/package.json

## Development Notes

- Backend tự động tạo database và tables khi khởi động
- Frontend sử dụng proxy để kết nối với backend
- Error handling được implement ở cả frontend và backend
- Validation được thực hiện ở cả client và server side

## Tác giả

Dự án được tạo bởi GitHub Copilot