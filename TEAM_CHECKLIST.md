# ✅ Team Member Setup Checklist

## Pre-Setup Requirements

- [ ] **Node.js >= 16.x** installed (`node --version`)
- [ ] **npm** installed (`npm --version`) 
- [ ] **Git** installed (`git --version`)
- [ ] **MySQL** installed and running
- [ ] **Redis** installed and running
- [ ] **GitHub access** to repository

---

## Setup Process

### 📥 Code Setup
- [ ] Clone repository: `git clone https://github.com/KhangBon18/cong-nghe-phan-mem.git`
- [ ] Navigate to project: `cd cong-nghe-phan-mem`
- [ ] Run setup script: `./setup.sh` (or follow SETUP_GUIDE.md)

### 🗄️ Database Setup  
- [ ] Create MySQL database: `CREATE DATABASE fullstack_app;`
- [ ] Import schema: `mysql -u root -p fullstack_app < database/schema.sql`
- [ ] Import sample data: `mysql -u root -p fullstack_app < database/sample_data.sql`
- [ ] Update `backend/.env` with your MySQL credentials

### 📦 Dependencies
- [ ] Backend dependencies: `cd backend && npm install`
- [ ] Frontend dependencies: `cd frontend && npm install --legacy-peer-deps`
- [ ] Scripts dependencies: `cd scripts && npm install`

### 🚀 Services
- [ ] Start Backend: `cd backend && npm run dev` (Port 5001)
- [ ] Start Frontend: `cd frontend && npm start` (Port 3000)
- [ ] Test Simulator: `cd scripts && node simple-simulator.js`

---

## Verification Tests

### ✅ Backend Tests
- [ ] Health check: `curl http://localhost:5001/api/health`
- [ ] Should return JSON with system status
- [ ] No database connection errors in console

### ✅ Frontend Tests  
- [ ] Homepage loads: http://localhost:3000
- [ ] Dashboard loads: http://localhost:3000/dashboard
- [ ] Driver app loads: http://localhost:3000/driver
- [ ] Parent view loads: http://localhost:3000/parent
- [ ] No console errors in browser

### ✅ Real-time Tests
- [ ] Run simulator: `cd scripts && node simple-simulator.js`
- [ ] See location updates in simulator console
- [ ] Backend logs show "Client connected" messages
- [ ] Dashboard shows real-time updates (if implemented)

### ✅ Database Tests
- [ ] MySQL connection successful
- [ ] All SSB tables created (buses, drivers, students, etc.)
- [ ] Sample data inserted (check with: `SELECT * FROM buses LIMIT 5;`)

---

## Common Issues & Solutions

### ❌ MySQL Issues
- [ ] **"Access denied"**: Update password in `backend/.env`
- [ ] **"Can't connect"**: Check if MySQL service is running
- [ ] **"Database doesn't exist"**: Run `CREATE DATABASE fullstack_app;`

### ❌ Redis Issues  
- [ ] **"Redis connection failed"**: Check if Redis is running (`redis-cli ping`)
- [ ] **"ECONNREFUSED"**: Start Redis service

### ❌ Node Issues
- [ ] **"Module not found"**: Run `npm install` in affected directory
- [ ] **"Port in use"**: Kill existing process or use different port
- [ ] **"Permission denied"**: Check file permissions and Node.js installation

### ❌ Frontend Issues
- [ ] **React warnings**: Use `npm install --legacy-peer-deps`
- [ ] **Build errors**: Clear cache: `rm -rf node_modules package-lock.json && npm install`
- [ ] **Blank page**: Check browser console for errors

---

## Development Environment

### 🛠️ Recommended Tools
- [ ] **VS Code** with extensions:
  - [ ] ES7+ React/Redux/React-Native snippets
  - [ ] Prettier - Code formatter  
  - [ ] ESLint
  - [ ] MySQL extension
- [ ] **Browser DevTools** for frontend debugging
- [ ] **Postman** or **Thunder Client** for API testing
- [ ] **MySQL Workbench** for database management

### 📁 Project Structure Understanding
- [ ] **`/backend`**: Node.js + Express + Socket.IO server
- [ ] **`/frontend`**: React 18 application with routing
- [ ] **`/database`**: MySQL schema and sample data
- [ ] **`/docs/ssb`**: Complete documentation and UML diagrams
- [ ] **`/scripts`**: Testing tools and simulators

---

## Team Workflow

### 🔄 Daily Development
- [ ] **Pull latest**: `git pull origin main`
- [ ] **Create branch**: `git checkout -b feature/your-feature`
- [ ] **Make changes** and test locally
- [ ] **Commit**: `git add . && git commit -m "feat: description"`
- [ ] **Push**: `git push origin feature/your-feature`
- [ ] **Create PR** on GitHub

### 📋 Before Pull Request
- [ ] All tests pass locally
- [ ] No console errors
- [ ] Code follows project conventions
- [ ] Documentation updated if needed
- [ ] Real-time features tested with simulator

---

## Contact & Support

If you encounter issues:
1. ✅ Check this checklist first
2. 📖 Review `SETUP_GUIDE.md` for detailed instructions  
3. 🔍 Search GitHub issues for similar problems
4. 💬 Ask team members in project chat
5. 🐛 Create new GitHub issue if needed

---

## Success Criteria

**✅ Setup is complete when:**
- [ ] All checkboxes above are marked
- [ ] Backend server runs without errors
- [ ] Frontend loads and displays correctly
- [ ] Real-time simulation works  
- [ ] Database queries execute successfully
- [ ] You can access all main pages
- [ ] Socket.IO connections establish properly

**🎉 Ready to contribute to Smart School Bus System v1.0!**