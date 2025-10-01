# Task 3 - Smart School Bus System Architecture

## 1. Tổng quan kiến trúc

Smart School Bus Tracking System được thiết kế theo mô hình **Modular Monolith** trên stack công nghệ hiện có, đảm bảo khả năng mở rộng và bảo trì dễ dàng.

### 1.1 Nguyên tắc thiết kế
- **Separation of Concerns**: Mỗi module chịu trách nhiệm một domain cụ thể
- **Loose Coupling**: Các module giao tiếp qua interfaces rõ ràng
- **High Cohesion**: Logic liên quan được nhóm trong cùng module
- **Scalability First**: Thiết kế hỗ trợ 300+ xe đồng thời
- **Real-time Ready**: Kiến trúc event-driven cho tracking real-time

## 2. Module Structure

### 2.1 Backend Module Organization
```
backend/src/
├── modules/
│   ├── auth/                 # JWT + RBAC
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── models/
│   ├── catalog/              # Master data
│   │   ├── controllers/
│   │   │   ├── studentController.js
│   │   │   ├── parentController.js
│   │   │   ├── driverController.js
│   │   │   ├── busController.js
│   │   │   ├── routeController.js
│   │   │   └── stopController.js
│   │   ├── services/
│   │   └── models/
│   ├── schedule/             # Scheduling & trips
│   │   ├── controllers/
│   │   │   ├── scheduleController.js
│   │   │   ├── tripController.js
│   │   │   └── tripStopController.js
│   │   ├── services/
│   │   └── models/
│   ├── telemetry/           # Real-time tracking
│   │   ├── controllers/
│   │   │   └── telemetryController.js
│   │   ├── services/
│   │   │   ├── positionService.js
│   │   │   ├── distanceCalculator.js
│   │   │   └── etaCalculator.js
│   │   ├── models/
│   │   └── websocket/
│   ├── notify/              # Notifications
│   │   ├── services/
│   │   │   ├── websocketService.js
│   │   │   ├── alertService.js
│   │   │   └── pushNotificationService.js
│   │   └── templates/
│   └── messaging/           # Chat & communication
│       ├── controllers/
│       ├── services/
│       └── models/
├── shared/                  # Common utilities
│   ├── config/
│   ├── utils/
│   ├── middleware/
│   └── validators/
└── realtime/               # Socket.IO setup
    ├── index.js
    ├── handlers/
    └── events/
```

### 2.2 Module Responsibilities

#### 2.2.1 Auth Module
- **JWT Token Management**: Tạo, verify và refresh tokens
- **Role-Based Access Control**: Admin, Driver, Parent roles
- **Session Management**: Tracking user sessions
- **Password Security**: bcrypt hashing, password policies

#### 2.2.2 Catalog Module  
- **Master Data Management**: Students, Parents, Drivers, Buses, Routes, Stops
- **Data Validation**: Business rules và constraints
- **Relationship Management**: Parent-Student, Driver-Bus assignments
- **CRUD Operations**: RESTful APIs cho tất cả entities

#### 2.2.3 Schedule Module
- **Schedule Creation**: Tạo lịch trình cho routes
- **Trip Management**: Daily trip instances từ schedules
- **Assignment Logic**: Gán bus/driver cho trips
- **Trip Execution**: Start, progress tracking, completion

#### 2.2.4 Telemetry Module
- **Position Tracking**: Nhận và xử lý GPS coordinates
- **Distance Calculation**: Haversine formula cho earth distance
- **ETA Calculation**: Dự đoán thời gian đến dựa trên tốc độ và khoảng cách
- **Geofencing**: Detect khi xe gần stops
- **Data Aggregation**: Batch processing để tối ưu database writes

#### 2.2.5 Notify Module  
- **Real-time Notifications**: WebSocket broadcasting
- **Alert Engine**: Near stop, delay, emergency alerts
- **Template System**: Notification templates cho different events
- **Delivery Tracking**: Đảm bảo notifications được deliver

#### 2.2.6 Messaging Module
- **Chat System**: Communication giữa stakeholders  
- **Message Routing**: Route messages theo user roles
- **Message History**: Lưu trữ và query chat history
- **File Sharing**: Chia sẻ images/documents nếu cần

## 3. Real-time Architecture

### 3.1 WebSocket + Redis Pub/Sub
```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│   Driver    │    │   Backend    │    │     Redis     │
│   Device    │───▶│  Socket.IO   │───▶│   Pub/Sub     │
└─────────────┘    └──────────────┘    └───────────────┘
                           │                     │
                           │                     ▼
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│   Admin     │◀───│   WebSocket  │◀───│  Subscribers  │
│ Dashboard   │    │  Broadcast   │    │   (Topics)    │
└─────────────┘    └──────────────┘    └───────────────┘
                           │                     │
┌─────────────┐            │                     │
│   Parent    │◀───────────┘                     │
│    Web      │                                  │
└─────────────┘                                  │
                                                 ▼
                           ┌───────────────────────┐
                           │     MySQL DB          │
                           │  (Batch Inserts)      │
                           └───────────────────────┘
```

### 3.2 Message Flow
1. **Driver Device** gửi position qua WebSocket hoặc HTTP POST
2. **Backend** nhận và validate data
3. **Redis Pub/Sub** broadcast message đến subscribers
4. **Connected Clients** nhận real-time updates
5. **Background Worker** batch save positions vào MySQL mỗi 10-15s

### 3.3 Channel Strategy
- `bus:{busId}` - Position updates cho specific bus
- `alerts:{userId}` - Personal alerts cho users
- `system:broadcast` - System-wide announcements
- `trip:{tripId}` - Trip-specific events

## 4. Data Architecture

### 4.1 Hot vs Cold Data Strategy
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Redis Cache   │    │   Application    │    │   MySQL DB      │
│                 │    │      Layer       │    │                 │
│ • Current pos   │◀──▶│                  │◀──▶│ • Master data   │
│ • Active trips  │    │   • Business     │    │ • Position hist │
│ • User sessions │    │     Logic        │    │ • Trip records  │
│ • Temp alerts   │    │   • Validation   │    │ • Audit logs    │
└─────────────────┘    │   • Orchestration│    └─────────────────┘
                       └──────────────────┘
```

### 4.2 Performance Optimizations
- **Redis**: Current positions, active sessions, temporary alerts
- **MySQL**: Persistent data, historical records, reports
- **Batch Writes**: Aggregate position updates trước khi write DB
- **Indexing Strategy**: Optimize cho time-based queries
- **Connection Pooling**: Reuse database connections

## 5. Deployment Architecture

### 5.1 Development Stack
```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
├─────────────────┬─────────────────┬─────────────────────┤
│  Admin Web      │  Parent Web     │   Driver Web        │
│  (React)        │  (React)        │   (React)           │
└─────────────────┴─────────────────┴─────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  API Gateway                            │
│              Express + Socket.IO                        │
│              (Port 5001)                                │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
┌─────────────────────┐   ┌─────────────────────┐
│     Redis           │   │      MySQL          │
│   (Port 6379)       │   │    (Port 3306)      │
│                     │   │                     │
│ • Pub/Sub           │   │ • Persistent Data   │
│ • Session Cache     │   │ • Historical Data   │
│ • Position Cache    │   │ • Master Data       │
└─────────────────────┘   └─────────────────────┘
```

### 5.2 Scalability Considerations

#### 5.2.1 300 Bus Support Analysis
- **Message Rate**: 300 buses × 1 msg/3s = 100 msgs/second
- **Data Volume**: ~50KB/hour/bus = 15MB/hour total
- **Concurrent Users**: ~1000 parents + 300 drivers + 10 admins
- **WebSocket Connections**: ~1310 concurrent connections

#### 5.2.2 Performance Targets
- **API Response Time**: < 200ms for CRUD operations
- **WebSocket Latency**: < 100ms for position updates  
- **Database Write**: Batch every 15s to reduce I/O
- **Memory Usage**: < 2GB for application layer

## 6. Security Architecture

### 6.1 Authentication & Authorization
```
User Request → JWT Validation → Role Check → API Access
     │              │              │           │
     ▼              ▼              ▼           ▼
[Username/Pass] [Token Verify] [RBAC Rules] [Response]
```

### 6.2 Security Layers
1. **Input Validation**: express-validator cho all endpoints
2. **Authentication**: JWT tokens với expiration
3. **Authorization**: Role-based permissions
4. **Data Encryption**: Sensitive data in transit và at rest
5. **Rate Limiting**: Prevent abuse và DoS attacks
6. **Audit Logging**: Track all security-relevant events

## 7. Monitoring & Observability

### 7.1 Health Checks
- **Application Health**: `/api/health` endpoint
- **Database Connectivity**: MySQL connection status
- **Redis Connectivity**: Pub/sub functionality test
- **WebSocket Health**: Connection count và message throughput

### 7.2 Metrics Collection
- **Performance Metrics**: Response times, throughput
- **Business Metrics**: Active trips, messages sent, user engagement
- **System Metrics**: Memory, CPU, network usage
- **Error Tracking**: Exception logging và alerting

## 8. Integration Points

### 8.1 External Services
- **Map Services**: OpenStreetMap/Google Maps for frontend
- **SMS Gateway**: Optional SMS notifications
- **Email Service**: Email notifications backup
- **Push Notifications**: Browser push for mobile web

### 8.2 API Design
- **RESTful Endpoints**: CRUD operations cho all resources
- **WebSocket Events**: Real-time updates và commands
- **Webhook Support**: External system integrations
- **API Versioning**: Support multiple API versions

---

**Architecture Version**: 1.0  
**Last Updated**: October 1, 2025  
**Review Date**: Monthly architecture review