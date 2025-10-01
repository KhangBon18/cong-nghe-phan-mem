#!/bin/bash

# 🚌 Smart School Bus System - Quick Setup Script
# Automatically setup the entire SSB system for new team members

set -e  # Exit on any error

echo "🚌 Smart School Bus System v1.0 - Quick Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check Git
if command_exists git; then
    print_success "Git found"
else
    print_error "Git not found. Please install Git from https://git-scm.com/"
    exit 1
fi

# Check MySQL
if command_exists mysql; then
    print_success "MySQL found"
else
    print_warning "MySQL not found. You'll need to install MySQL manually."
    echo "  macOS: brew install mysql"
    echo "  Ubuntu: sudo apt-get install mysql-server"
    echo "  Windows: Download from https://dev.mysql.com/downloads/installer/"
fi

# Check Redis
if command_exists redis-cli; then
    print_success "Redis found"
else
    print_warning "Redis not found. You'll need to install Redis manually."
    echo "  macOS: brew install redis"
    echo "  Ubuntu: sudo apt-get install redis-server"
    echo "  Windows: Download from https://redis.io/download"
fi

echo ""
print_status "Setting up project dependencies..."

# Setup backend
print_status "📦 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please update database credentials in backend/.env"
fi

npm install
print_success "Backend dependencies installed"

# Setup frontend
print_status "🎨 Installing frontend dependencies..."
cd ../frontend
npm install --legacy-peer-deps
print_success "Frontend dependencies installed"

# Setup scripts
print_status "🧪 Installing testing scripts dependencies..."
cd ../scripts
if [ ! -f "package.json" ]; then
    npm init -y >/dev/null 2>&1
fi
npm install socket.io-client
print_success "Scripts dependencies installed"

# Go back to root
cd ..

echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update database credentials in backend/.env"
echo "2. Create MySQL database: CREATE DATABASE fullstack_app;"
echo "3. Import schema: mysql -u root -p fullstack_app < database/schema.sql"
echo "4. Import sample data: mysql -u root -p fullstack_app < database/sample_data.sql"
echo "5. Start services:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo "   - Simulator: cd scripts && node simple-simulator.js"
echo ""
echo "🌐 Access URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5001"
echo "   - Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📖 For detailed setup guide, see SETUP_GUIDE.md"
echo ""
print_success "Happy coding with Smart School Bus System! 🚌"