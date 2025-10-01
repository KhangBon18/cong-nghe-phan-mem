# Task 1 - Smart School Bus Tracking System Requirements

## 1. Stakeholders và Nhu cầu

### 1.1 Quản lý nhà trường/Dispatcher
- **Vai trò**: Người quản lý tổng thể hệ thống xe buýt trường học
- **Nhu cầu**:
  - Lập lịch tuyến xe buýt cho từng học kỳ/tháng
  - Gán xe và tài xế cho từng tuyến
  - Giám sát vị trí xe realtime trên bản đồ
  - Nhắn tin với tài xế và phụ huynh
  - Theo dõi trạng thái đón/trả học sinh
  - Quản lý báo cáo và thống kê

### 1.2 Tài xế xe buýt
- **Vai trò**: Người điều khiển xe và đảm bảo an toàn học sinh
- **Nhu cầu**:
  - Xem lịch làm việc trong ngày/tuần
  - Xem danh sách học sinh và điểm đón/trả
  - Báo cáo đã đón/trả học sinh tại các điểm
  - Gửi cảnh báo khẩn cấp khi có sự cố
  - Nhận thông báo từ quản lý
  - Chia sẻ vị trí xe tự động

### 1.3 Phụ huynh
- **Vai trò**: Người giám hộ học sinh, quan tâm đến an toàn con em
- **Nhu cầu**:
  - Xem vị trí xe buýt của con em realtime
  - Nhận thông báo khi xe sắp tới điểm đón
  - Nhận cảnh báo khi xe trễ so với lịch dự kiến
  - Xem lịch sử hành trình
  - Liên lạc với tài xế khi cần thiết

## 2. Lợi ích của hệ thống

### 2.1 Minh bạch hành trình
- Theo dõi realtime vị trí xe buýt
- Lưu trữ lịch sử di chuyển
- Báo cáo chi tiết về việc đón/trả học sinh

### 2.2 Giảm gọi điện trao đổi
- Thông tin tự động cập nhật
- Thông báo proactive về trạng thái xe
- Kênh nhắn tin trực tiếp trong hệ thống

### 2.3 Tăng an toàn và đúng giờ
- Giám sát realtime giúp phát hiện sớm vấn đề
- Cảnh báo tự động khi có sự cố
- Tối ưu hóa lộ trình dựa trên dữ liệu lịch sử

## 3. Yêu cầu chức năng

### 3.1 Quản lý cơ sở dữ liệu
- **F1**: Quản lý thông tin học sinh (tên, lớp, phụ huynh, điểm đón/trả)
- **F2**: Quản lý thông tin xe buýt (biển số, sức chứa, trạng thái)
- **F3**: Quản lý thông tin tài xế (tên, GPLX, số điện thoại)
- **F4**: Quản lý tuyến đường và điểm dừng
- **F5**: Quản lý lịch trình xe buýt

### 3.2 Theo dõi realtime
- **F6**: Hiển thị vị trí xe trên bản đồ realtime (< 3 giây delay)
- **F7**: Tự động gửi vị trí từ thiết bị trên xe
- **F8**: Lưu trữ lịch sử di chuyển
- **F9**: Hiển thị trạng thái hoạt động của xe (đang chạy, dừng, bảo trì)

### 3.3 Quản lý chuyến đi
- **F10**: Tạo và quản lý lịch trình hàng ngày
- **F11**: Báo cáo đón/trả học sinh tại từng điểm
- **F12**: Theo dõi tiến độ chuyến đi
- **F13**: Xử lý các trường hợp bất thường (trễ, hỏng xe)

### 3.4 Thông báo và cảnh báo
- **F14**: Thông báo cho phụ huynh khi xe sắp tới điểm đón
- **F15**: Cảnh báo khi xe trễ so với lịch dự kiến
- **F16**: Thông báo khẩn cấp từ tài xế
- **F17**: Nhắn tin giữa các stakeholders

### 3.5 Báo cáo và thống kê
- **F18**: Báo cáo hàng ngày về các chuyến đi
- **F19**: Thống kê tình hình đón/trả học sinh
- **F20**: Phân tích hiệu suất tuyến đường

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu suất
- **NF1**: Hệ thống hỗ trợ đồng thời tối thiểu 300 xe buýt
- **NF2**: Thời gian phản hồi API < 2 giây
- **NF3**: Cập nhật vị trí realtime < 3 giây
- **NF4**: Độ chính xác vị trí GPS ± 5 mét

### 4.2 Bảo mật
- **NF5**: Xác thực và phân quyền dựa trên vai trò (RBAC)
- **NF6**: Mã hóa dữ liệu nhạy cảm
- **NF7**: Audit log cho các thao tác quan trọng
- **NF8**: Bảo vệ thông tin cá nhân theo GDPR

### 4.3 Khả năng mở rộng
- **NF9**: Kiến trúc modular cho phép mở rộng tính năng
- **NF10**: Hỗ trợ horizontal scaling
- **NF11**: Cache dữ liệu để giảm tải database
- **NF12**: Queue system cho xử lý batch data

### 4.4 Khả dụng
- **NF13**: Uptime 99.5% trong giờ học
- **NF14**: Graceful degradation khi mất kết nối
- **NF15**: Backup và recovery tự động
- **NF16**: Health check monitoring

### 4.5 Quốc tế hóa (i18n)
- **NF17**: Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh)
- **NF18**: Đơn vị đo lường có thể cấu hình (km/h, mph)
- **NF19**: Định dạng thời gian theo múi giờ
- **NF20**: Currency và số formatting theo locale

### 4.6 Tính bền vững
- **NF21**: Tối ưu hóa pin cho thiết bị mobile
- **NF22**: Giảm thiểu băng thông mạng
- **NF23**: Offline mode cho một số tính năng cơ bản
- **NF24**: Progressive Web App (PWA) support

## 5. Use Cases Tổng Thể

### 5.1 Use Case "Quản lý"
- **UC1**: Thiết lập hệ thống (xe, tài xế, tuyến đường)
- **UC2**: Lập lịch trình xe buýt
- **UC3**: Giám sát hoạt động realtime
- **UC4**: Quản lý sự cố và bất thường
- **UC5**: Tạo báo cáo và thống kê

### 5.2 Use Case "Tài xế"
- **UC6**: Đăng nhập và xem lịch làm việc
- **UC7**: Bắt đầu và kết thúc chuyến đi
- **UC8**: Báo cáo đón/trả học sinh
- **UC9**: Gửi cảnh báo khẩn cấp
- **UC10**: Nhận và trả lời tin nhắn

### 5.3 Use Case "Phụ huynh"
- **UC11**: Theo dõi vị trí xe của con
- **UC12**: Nhận thông báo về lịch trình
- **UC13**: Xem lịch sử hành trình
- **UC14**: Liên lạc với tài xế/quản lý
- **UC15**: Cấu hình thông báo cá nhân

## 6. Ràng buộc kỹ thuật

### 6.1 Platform
- **C1**: Web application responsive cho desktop và mobile
- **C2**: Tương thích với các trình duyệt chính (Chrome, Firefox, Safari, Edge)
- **C3**: API RESTful cho tích hợp với hệ thống khác

### 6.2 Infrastructure
- **C4**: Database MySQL cho production
- **C5**: Redis cho caching và real-time messaging
- **C6**: Node.js/Express backend
- **C7**: React frontend

### 6.3 Integration
- **C8**: GPS/GNSS integration cho tracking
- **C9**: SMS/Email notification service
- **C10**: Map service integration (OpenStreetMap hoặc Google Maps)
- **C11**: Push notification cho mobile browsers

---

**Ngày tạo**: October 1, 2025  
**Phiên bản**: 1.0  
**Tác giả**: Development Team