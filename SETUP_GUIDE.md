# 📋 Hướng dẫn Setup cho Team Members

## 🚀 Smart School Bus System v1.0 - Setup Guide

Hướng dẫn này dành cho các thành viên team muốn pull code về và chạy hệ thống SSB trên máy local.

---

## 📋 Prerequisites (Cài đặt trước)

### 1. **Node.js & npm**
```bash
# Kiểm tra Node.js version (cần >= 16.x)
node --version
npm --version

# Nếu chưa có, download từ: https://nodejs.org/
```

### 2. **Git**
```bash
# Kiểm tra Git
git --version

# Nếu chưa có, download từ: https://git-scm.com/
```

### 3. **MySQL**
```bash
# macOS - sử dụng Homebrew
brew install mysql
brew services start mysql

# Windows - download từ: https://dev.mysql.com/downloads/installer/
# Ubuntu/Debian
sudo apt-get install mysql-server
```

### 4. **Redis**
```bash
# macOS
brew install redis
brew services start redis

# Windows - download từ: https://redis.io/download
# Ubuntu/Debian  
sudo apt-get install redis-server
```

---

## 🔄 Bước 1: Clone Repository

```bash
# Clone project từ GitHub
git clone https://github.com/KhangBon18/cong-nghe-phan-mem.git

# Di chuyển vào thư mục project
cd cong-nghe-phan-mem
```

---

## 🗄️ Bước 2: Setup Database

### Tạo MySQL Database
```bash
# Kết nối MySQL (có thể cần nhập password)
mysql -u root -p

# Tạo database trong MySQL prompt
CREATE DATABASE fullstack_app;
exit;
```

### Import Schema và Sample Data
```bash
# Import database schema
mysql -u root -p fullstack_app < database/schema.sql

# Import sample data để demo
mysql -u root -p fullstack_app < database/sample_data.sql
```

---

## 🔧 Bước 3: Setup Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file environment từ template
cp .env.example .env
```

### Cấu hình Environment Variables

Mở file `backend/.env` và cập nhật:

```env
# Environment variables
NODE_ENV=development
PORT=5001

# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=fullstack_app
DB_PORT=3306

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-2025

# CORS Origins
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Quan trọng**: Thay `your_mysql_password_here` bằng password MySQL thực tế của bạn.

---

## 🎨 Bước 4: Setup Frontend

```bash
# Quay về thư mục root project
cd ..

# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install --legacy-peer-deps
```

**Note**: Sử dụng `--legacy-peer-deps` để tránh conflict với React 18 và React Leaflet.

---

## 🧪 Bước 5: Setup Testing Scripts

```bash
# Di chuyển vào thư mục scripts
cd ../scripts

# Cài đặt dependencies cho simulator
npm install
```

---

## 🏃‍♂️ Bước 6: Chạy Hệ thống

### Option 1: Sử dụng VS Code Tasks (Recommended)

1. Mở project trong VS Code:
   ```bash
   code .
   ```

2. Sử dụng Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):
   - Gõ "Tasks: Run Task"
   - Chọn "Start Full Stack App"

### Option 2: Chạy thủ công

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm start
```

**Terminal 3 - Driver Simulator (Optional):**
```bash
cd scripts
node simple-simulator.js
```

---

## 🌐 Bước 7: Truy cập Ứng dụng

Sau khi tất cả services đã khởi động thành công:

### **URLs chính:**
- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/dashboard  
- **Driver App**: http://localhost:3000/driver
- **Parent View**: http://localhost:3000/parent
- **User Management**: http://localhost:3000/users

### **API Endpoints:**
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health
- **Socket.IO**: ws://localhost:5001

---

## ✅ Bước 8: Verify Installation

### 1. Kiểm tra Backend
```bash
curl http://localhost:5001/api/health
```
**Expected response**: JSON với status information

### 2. Kiểm tra Frontend
Mở browser và truy cập http://localhost:3000 - sẽ thấy trang chủ SSB

### 3. Test Real-time Features
```bash
# Chạy driver simulator để test real-time tracking
cd scripts
node simple-simulator.js
```

Sau đó mở Dashboard (http://localhost:3000/dashboard) để xem real-time bus tracking.

---

## 🐛 Troubleshooting

### **Lỗi thường gặp:**

#### 1. MySQL Connection Error
```bash
# Kiểm tra MySQL service
brew services list | grep mysql

# Start MySQL nếu chưa chạy
brew services start mysql

# Reset password nếu cần
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

#### 2. Redis Connection Error
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Start Redis nếu chưa chạy
brew services start redis
```

#### 3. Port Already in Use
```bash
# Kill process sử dụng port 5001
lsof -ti:5001 | xargs kill -9

# Kill process sử dụng port 3000  
lsof -ti:3000 | xargs kill -9
```

#### 4. Frontend Build Issues
```bash
# Clear cache và reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 5. Backend Module Not Found
```bash
# Reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Project Structure Overview

```
project/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── modules/        # Modular architecture (auth, catalog, etc.)
│   │   ├── realtime/       # Socket.IO + Redis
│   │   ├── models/         # Database models
│   │   └── server.js       # Main server file
│   └── .env                # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Driver, Parent views
│   │   ├── components/    # Reusable components
│   │   └── utils/         # Socket.IO client service
├── database/              # MySQL schema & sample data
├── docs/ssb/             # Complete documentation
├── scripts/              # Driver simulator & testing tools
└── README.md             # Main documentation
```

---

## 🤝 Development Workflow

### 1. **Before Making Changes**
```bash
git pull origin main
```

### 2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

### 3. **After Making Changes**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 4. **Create Pull Request**
- Tạo PR trên GitHub
- Request review từ team members
- Merge sau khi approved

---

## 📞 Support

Nếu gặp vấn đề trong quá trình setup:

1. **Kiểm tra Prerequisites** - đảm bảo tất cả tools đã được cài đặt
2. **Xem Troubleshooting section** - check các lỗi thường gặp
3. **Check GitHub Issues** - có thể đã có người gặp vấn đề tương tự
4. **Contact team** - hỏi trực tiếp team members

---

## 🎯 Next Steps

Sau khi setup thành công:

1. **Explore codebase** - familiarize với architecture
2. **Run tests** - đảm bảo mọi thứ hoạt động
3. **Read documentation** - xem `/docs/ssb/` để hiểu requirements
4. **Start developing** - begin working on assigned tasks

---

**🚌 Happy Coding với Smart School Bus System v1.0!**