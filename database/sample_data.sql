-- ===================================================
-- Sample Data for Full Stack Application + Smart School Bus System
-- ===================================================

USE `fullstack_app`;

-- Clear existing data (optional)
-- TRUNCATE TABLE `users`;

-- Insert sample users
INSERT INTO `users` (`name`, `email`, `age`) VALUES
('Nguyễn Văn An', 'nguyenvanan@gmail.com', 25),
('Trần Thị Bình', 'tranthibinh@gmail.com', 30),
('Lê Văn Cường', 'levancuong@gmail.com', 28),
('Phạm Thị Dung', 'phamthidung@gmail.com', 22),
('Hoàng Văn Em', 'hoangvanem@gmail.com', 35),
('Vũ Thị Phương', 'vuthiphuong@gmail.com', 27),
('Đỗ Văn Giang', 'dovangiang@gmail.com', 33),
('Bùi Thị Hoa', 'buithihoa@gmail.com', 24),
('Mai Văn Khoa', 'maivankhoa@gmail.com', 29),
('Đặng Thị Lan', 'dangthilan@gmail.com', 26);

-- ===================================================
-- SMART SCHOOL BUS SAMPLE DATA
-- ===================================================

-- Insert sample buses
INSERT INTO `buses` (`plate`, `capacity`, `status`, `model`, `year`) VALUES
('51B-12345', 35, 'active', 'Hyundai County', 2020),
('51B-12346', 40, 'active', 'Thaco Universe', 2021),
('51B-12347', 35, 'maintenance', 'Hyundai County', 2019),
('51B-12348', 45, 'active', 'Samco Felix', 2022),
('51B-12349', 35, 'active', 'Hyundai County', 2020);

-- Insert sample drivers
INSERT INTO `drivers` (`name`, `phone`, `license_no`, `status`, `email`, `hire_date`) VALUES
('Nguyễn Văn Tài', '0901234567', 'D1-123456789', 'on', 'nguyenvantai@schoolbus.com', '2020-01-15'),
('Trần Văn Sơn', '0907654321', 'D1-987654321', 'on', 'tranvanson@schoolbus.com', '2019-06-10'),
('Lê Văn Dũng', '0912345678', 'D1-456789123', 'off', 'levandung@schoolbus.com', '2021-03-20'),
('Phạm Văn Hoàng', '0908765432', 'D1-321654987', 'on', 'phamvanhoang@schoolbus.com', '2020-09-05'),
('Võ Văn Minh', '0913579246', 'D1-147258369', 'on', 'vovanminh@schoolbus.com', '2021-01-12');

-- Insert sample routes
INSERT INTO `routes` (`name`, `description`, `distance_km`, `estimated_duration`, `status`) VALUES
('Tuyến 01 - Quận 1', 'Từ trường về các khu vực Quận 1', 15.5, 45, 'active'),
('Tuyến 02 - Quận 3', 'Từ trường về các khu vực Quận 3', 12.3, 35, 'active'),
('Tuyến 03 - Bình Thạnh', 'Từ trường về các khu vực Bình Thạnh', 18.7, 50, 'active'),
('Tuyến 04 - Phú Nhuận', 'Từ trường về các khu vực Phú Nhuận', 14.2, 40, 'active'),
('Tuyến 05 - Quận 10', 'Từ trường về các khu vực Quận 10', 13.8, 38, 'active');

-- Insert sample stops for Route 1 (Quận 1)
INSERT INTO `stops` (`route_id`, `name`, `lat`, `lng`, `order_index`, `address`, `landmark`) VALUES
(1, 'Trường THPT ABC', 10.762622, 106.660172, 1, '123 Nguyễn Huệ, Quận 1', 'Cạnh nhà thờ Đức Bà'),
(1, 'Công viên 23/9', 10.768751, 106.659580, 2, 'Công viên 23/9, Quận 1', 'Gần khách sạn Rex'),
(1, 'Chợ Bến Thành', 10.772356, 106.698234, 3, 'Chợ Bến Thành, Quận 1', 'Trước cổng chính chợ'),
(1, 'Bitexco Financial Tower', 10.771995, 106.704120, 4, '2 Hải Triều, Quận 1', 'Tòa nhà Bitexco'),
(1, 'Phố đi bộ Nguyễn Huệ', 10.774772, 106.701424, 5, 'Đường Nguyễn Huệ, Quận 1', 'Khu vực phố đi bộ');

-- Insert sample stops for Route 2 (Quận 3)
INSERT INTO `stops` (`route_id`, `name`, `lat`, `lng`, `order_index`, `address`, `landmark`) VALUES
(2, 'Trường THPT ABC', 10.762622, 106.660172, 1, '123 Nguyễn Huệ, Quận 1', 'Điểm xuất phát'),
(2, 'Công viên Tao Đàn', 10.779494, 106.693544, 2, 'Công viên Tao Đàn, Quận 3', 'Cổng chính công viên'),
(2, 'Bệnh viện Nhi Đồng 1', 10.786234, 106.687456, 3, '341 Sư Vạn Hạnh, Quận 10', 'Cổng bệnh viện'),
(2, 'Chợ Tân Định', 10.788567, 106.691234, 4, 'Chợ Tân Định, Quận 1', 'Trước chợ'),
(2, 'Công viên Lê Văn Tám', 10.792345, 106.695678, 5, 'Công viên Lê Văn Tám, Quận 1', 'Cạnh công viên');

-- Insert sample parents
INSERT INTO `parents` (`name`, `phone`, `email`, `address`, `emergency_contact`) VALUES
('Nguyễn Thị Mai', '0902345678', 'nguyenthimai@gmail.com', '123 Lê Lợi, Quận 1, TP.HCM', '0907777777'),
('Trần Văn Nam', '0913456789', 'tranvannam@gmail.com', '456 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', '0908888888'),
('Lê Thị Hoa', '0924567890', 'lethihoa@gmail.com', '789 Điện Biên Phủ, Bình Thạnh, TP.HCM', '0909999999'),
('Phạm Văn Đức', '0935678901', 'phamvanduc@gmail.com', '321 Cách Mạng Tháng 8, Quận 10, TP.HCM', '0901111111'),
('Võ Thị Lan', '0946789012', 'vothilan@gmail.com', '654 Phan Xích Long, Phú Nhuận, TP.HCM', '0902222222'),
('Đỗ Văn Tuấn', '0957890123', 'dovantuan@gmail.com', '987 Nguyễn Văn Cừ, Quận 5, TP.HCM', '0903333333'),
('Bùi Thị Nga', '0968901234', 'buithinga@gmail.com', '147 Trần Hưng Đạo, Quận 1, TP.HCM', '0904444444'),
('Hoàng Văn Minh', '0979012345', 'hoangvanminh@gmail.com', '258 Lý Tự Trọng, Quận 1, TP.HCM', '0905555555');

-- Insert sample students
INSERT INTO `students` (`name`, `grade`, `parent_id`, `default_stop_id`, `student_id`, `date_of_birth`, `status`) VALUES
('Nguyễn Văn An', '10A1', 1, 2, 'HS001', '2008-03-15', 'active'),
('Trần Thị Bình', '11B2', 2, 3, 'HS002', '2007-07-22', 'active'),
('Lê Văn Cường', '10A2', 3, 4, 'HS003', '2008-01-10', 'active'),
('Phạm Thị Dung', '12C1', 4, 5, 'HS004', '2006-11-05', 'active'),
('Võ Văn Em', '11A1', 5, 2, 'HS005', '2007-09-18', 'active'),
('Đỗ Thị Phương', '10B1', 6, 3, 'HS006', '2008-05-30', 'active'),
('Bùi Văn Giang', '12A2', 7, 4, 'HS007', '2006-12-12', 'active'),
('Hoàng Thị Hà', '11C2', 8, 5, 'HS008', '2007-04-25', 'active'),
('Mai Văn Khoa', '10C1', 1, 2, 'HS009', '2008-08-08', 'active'),
('Đặng Thị Lan', '11B1', 2, 3, 'HS010', '2007-02-14', 'active');

-- Insert sample schedules
INSERT INTO `schedules` (`route_id`, `driver_id`, `bus_id`, `shift`, `days_of_week`, `start_time`, `end_time`, `effective_date`, `status`) VALUES
(1, 1, 1, 'AM', 'Mon,Tue,Wed,Thu,Fri', '06:30:00', '08:00:00', '2025-09-01', 'active'),
(1, 1, 1, 'PM', 'Mon,Tue,Wed,Thu,Fri', '16:30:00', '18:00:00', '2025-09-01', 'active'),
(2, 2, 2, 'AM', 'Mon,Tue,Wed,Thu,Fri', '06:45:00', '08:15:00', '2025-09-01', 'active'),
(2, 2, 2, 'PM', 'Mon,Tue,Wed,Thu,Fri', '16:45:00', '18:15:00', '2025-09-01', 'active'),
(3, 4, 4, 'AM', 'Mon,Tue,Wed,Thu,Fri', '06:20:00', '07:50:00', '2025-09-01', 'active'),
(3, 4, 4, 'PM', 'Mon,Tue,Wed,Thu,Fri', '16:20:00', '17:50:00', '2025-09-01', 'active');

-- Insert sample trips for today
INSERT INTO `trips` (`schedule_id`, `service_date`, `status`, `started_at`) VALUES
(1, CURDATE(), 'completed', CONCAT(CURDATE(), ' 06:30:00')),
(2, CURDATE(), 'running', CONCAT(CURDATE(), ' 16:30:00')),
(3, CURDATE(), 'completed', CONCAT(CURDATE(), ' 06:45:00')),
(4, CURDATE(), 'planned', NULL),
(5, CURDATE(), 'completed', CONCAT(CURDATE(), ' 06:20:00')),
(6, CURDATE(), 'planned', NULL);

-- Insert sample trip stops
INSERT INTO `trip_stops` (`trip_id`, `stop_id`, `planned_eta`, `status`) VALUES
-- Trip 1 stops (Route 1 AM - completed)
(1, 1, CONCAT(CURDATE(), ' 06:30:00'), 'departed'),
(1, 2, CONCAT(CURDATE(), ' 06:45:00'), 'departed'),
(1, 3, CONCAT(CURDATE(), ' 07:00:00'), 'departed'),
(1, 4, CONCAT(CURDATE(), ' 07:15:00'), 'departed'),
(1, 5, CONCAT(CURDATE(), ' 07:30:00'), 'departed'),
-- Trip 2 stops (Route 1 PM - running)
(2, 1, CONCAT(CURDATE(), ' 16:30:00'), 'departed'),
(2, 2, CONCAT(CURDATE(), ' 16:45:00'), 'arrived'),
(2, 3, CONCAT(CURDATE(), ' 17:00:00'), 'pending'),
(2, 4, CONCAT(CURDATE(), ' 17:15:00'), 'pending'),
(2, 5, CONCAT(CURDATE(), ' 17:30:00'), 'pending');

-- Insert sample trip students
INSERT INTO `trip_students` (`trip_id`, `student_id`, `pickup_stop_id`, `dropoff_stop_id`, `pickup_status`, `dropoff_status`) VALUES
(1, 1, 2, 2, 'picked', 'dropped'),
(1, 9, 2, 2, 'picked', 'dropped'),
(1, 2, 3, 3, 'picked', 'dropped'),
(1, 10, 3, 3, 'picked', 'dropped'),
(1, 3, 4, 4, 'picked', 'dropped'),
(1, 6, 3, 3, 'picked', 'dropped'),
(2, 1, 2, 2, 'unknown', 'unknown'),
(2, 9, 2, 2, 'unknown', 'unknown'),
(2, 2, 3, 3, 'unknown', 'unknown'),
(2, 10, 3, 3, 'unknown', 'unknown');

-- Insert sample positions (GPS tracking data)
INSERT INTO `positions` (`trip_id`, `bus_id`, `lat`, `lng`, `speed`, `heading`, `recorded_at`) VALUES
-- Current position for active trip
(2, 1, 10.768751, 106.659580, 25.5, 120.0, NOW() - INTERVAL 30 SECOND),
(2, 1, 10.769234, 106.660123, 28.2, 125.0, NOW() - INTERVAL 20 SECOND),
(2, 1, 10.769567, 106.660456, 22.8, 115.0, NOW() - INTERVAL 10 SECOND),
(2, 1, 10.770123, 106.661234, 30.1, 130.0, NOW()),
-- Historical positions for completed trips
(1, 1, 10.762622, 106.660172, 0.0, 0.0, CONCAT(CURDATE(), ' 06:30:00')),
(1, 1, 10.765123, 106.659876, 35.5, 90.0, CONCAT(CURDATE(), ' 06:35:00')),
(1, 1, 10.768751, 106.659580, 32.2, 95.0, CONCAT(CURDATE(), ' 06:45:00'));

-- Insert sample SSB users
INSERT INTO `ssb_users` (`username`, `email`, `password_hash`, `role`, `full_name`, `phone`, `driver_id`, `parent_id`) VALUES
-- Admin users
('admin', 'admin@schoolbus.com', '$2b$10$1234567890abcdef', 'admin', 'Quản trị viên hệ thống', '0901000000', NULL, NULL),
('manager', 'manager@schoolbus.com', '$2b$10$1234567890abcdef', 'admin', 'Nguyễn Văn Quản', '0901000001', NULL, NULL),
-- Driver users
('driver1', 'nguyenvantai@schoolbus.com', '$2b$10$1234567890abcdef', 'driver', 'Nguyễn Văn Tài', '0901234567', 1, NULL),
('driver2', 'tranvanson@schoolbus.com', '$2b$10$1234567890abcdef', 'driver', 'Trần Văn Sơn', '0907654321', 2, NULL),
('driver4', 'phamvanhoang@schoolbus.com', '$2b$10$1234567890abcdef', 'driver', 'Phạm Văn Hoàng', '0908765432', 4, NULL),
-- Parent users
('parent1', 'nguyenthimai@gmail.com', '$2b$10$1234567890abcdef', 'parent', 'Nguyễn Thị Mai', '0902345678', NULL, 1),
('parent2', 'tranvannam@gmail.com', '$2b$10$1234567890abcdef', 'parent', 'Trần Văn Nam', '0913456789', NULL, 2),
('parent3', 'lethihoa@gmail.com', '$2b$10$1234567890abcdef', 'parent', 'Lê Thị Hoa', '0924567890', NULL, 3),
('parent4', 'phamvanduc@gmail.com', '$2b$10$1234567890abcdef', 'parent', 'Phạm Văn Đức', '0935678901', NULL, 4),
('parent5', 'vothilan@gmail.com', '$2b$10$1234567890abcdef', 'parent', 'Võ Thị Lan', '0946789012', NULL, 5);

-- Insert sample alerts
INSERT INTO `alerts` (`type`, `severity`, `title`, `message`, `bus_id`, `trip_id`, `parent_id`, `is_resolved`) VALUES
('near_stop', 'medium', 'Xe buýt sắp tới điểm đón', 'Xe buýt 51B-12345 sẽ đến điểm đón Công viên 23/9 trong 2 phút nữa', 1, 2, 1, FALSE),
('near_stop', 'medium', 'Xe buýt sắp tới điểm đón', 'Xe buýt 51B-12345 sẽ đến điểm đón Công viên 23/9 trong 2 phút nữa', 1, 2, 2, FALSE),
('delay', 'high', 'Xe buýt trễ lịch', 'Xe buýt 51B-12346 đang trễ 10 phút so với lịch dự kiến', 2, NULL, NULL, FALSE),
('system', 'low', 'Thông báo bảo trì', 'Hệ thống sẽ bảo trì từ 23:00 - 01:00 đêm nay', NULL, NULL, NULL, FALSE);

-- Verify sample data
SELECT 'Buses' as entity_type, COUNT(*) as count FROM buses
UNION ALL
SELECT 'Drivers', COUNT(*) FROM drivers  
UNION ALL
SELECT 'Routes', COUNT(*) FROM routes
UNION ALL
SELECT 'Stops', COUNT(*) FROM stops
UNION ALL
SELECT 'Parents', COUNT(*) FROM parents
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Schedules', COUNT(*) FROM schedules
UNION ALL
SELECT 'Trips', COUNT(*) FROM trips
UNION ALL
SELECT 'Positions', COUNT(*) FROM positions
UNION ALL
SELECT 'SSB Users', COUNT(*) FROM ssb_users
UNION ALL
SELECT 'Alerts', COUNT(*) FROM alerts;

-- Verify inserted data
SELECT 
    id,
    name,
    email,
    age,
    created_at
FROM users 
ORDER BY created_at DESC;