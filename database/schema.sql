-- ===================================================
-- Full Stack Application Database Schema
-- ReactJS + NodeJS + MySQL + Smart School Bus System
-- ===================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `fullstack_app` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `fullstack_app`;

-- ===================================================
-- Users Table
-- ===================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL COMMENT 'User full name',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email address',
  `age` INT NOT NULL CHECK (`age` > 0 AND `age` <= 120) COMMENT 'User age (1-120)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update time',
  
  -- Indexes for performance
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='User management table';

-- ===================================================
-- Sample Data (Optional)
-- ===================================================
INSERT IGNORE INTO `users` (`name`, `email`, `age`) VALUES
('Nguyễn Văn An', 'nguyenvanan@example.com', 25),
('Trần Thị Bình', 'tranthibinh@example.com', 30),
('Lê Văn Cường', 'levancuong@example.com', 28),
('Phạm Thị Dung', 'phamthidung@example.com', 22),
('Hoàng Văn Em', 'hoangvanem@example.com', 35);

-- ===================================================
-- SMART SCHOOL BUS SYSTEM TABLES
-- ===================================================

-- ===================================================
-- Catalog Tables
-- ===================================================

-- Buses Table
CREATE TABLE IF NOT EXISTS `buses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `plate` VARCHAR(20) UNIQUE NOT NULL COMMENT 'Vehicle license plate',
  `capacity` INT NOT NULL CHECK (`capacity` > 0) COMMENT 'Bus seating capacity',
  `status` ENUM('inactive','active','maintenance') DEFAULT 'active' COMMENT 'Bus operational status',
  `model` VARCHAR(100) DEFAULT NULL COMMENT 'Bus model/make',
  `year` INT DEFAULT NULL COMMENT 'Manufacturing year',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_plate` (`plate`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='School bus fleet management';

-- Drivers Table
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Driver full name',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Driver contact number',
  `license_no` VARCHAR(50) DEFAULT NULL COMMENT 'Driver license number',
  `status` ENUM('off','on','suspended') DEFAULT 'off' COMMENT 'Driver working status',
  `email` VARCHAR(255) DEFAULT NULL COMMENT 'Driver email',
  `hire_date` DATE DEFAULT NULL COMMENT 'Employment start date',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_phone` (`phone`),
  INDEX `idx_status` (`status`),
  INDEX `idx_license` (`license_no`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='School bus drivers';

-- Routes Table
CREATE TABLE IF NOT EXISTS `routes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Route name/identifier',
  `description` TEXT DEFAULT NULL COMMENT 'Route description',
  `distance_km` DECIMAL(8,2) DEFAULT NULL COMMENT 'Total route distance in kilometers',
  `estimated_duration` INT DEFAULT NULL COMMENT 'Estimated duration in minutes',
  `status` ENUM('active','inactive') DEFAULT 'active' COMMENT 'Route status',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_name` (`name`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='School bus routes';

-- Stops Table
CREATE TABLE IF NOT EXISTS `stops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT 'Stop name/location',
  `lat` DECIMAL(10,7) NOT NULL COMMENT 'Latitude coordinate',
  `lng` DECIMAL(10,7) NOT NULL COMMENT 'Longitude coordinate',
  `order_index` INT NOT NULL COMMENT 'Stop order in route sequence',
  `address` TEXT DEFAULT NULL COMMENT 'Full address of stop',
  `landmark` VARCHAR(255) DEFAULT NULL COMMENT 'Nearby landmark',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE CASCADE,
  INDEX `idx_route_order` (`route_id`, `order_index`),
  INDEX `idx_coordinates` (`lat`, `lng`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bus stops along routes';

-- Parents Table
CREATE TABLE IF NOT EXISTS `parents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Parent full name',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Parent contact number',
  `email` VARCHAR(100) DEFAULT NULL COMMENT 'Parent email address',
  `address` TEXT DEFAULT NULL COMMENT 'Parent home address',
  `emergency_contact` VARCHAR(20) DEFAULT NULL COMMENT 'Emergency contact number',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_phone` (`phone`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Student parents/guardians';

-- Students Table
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Student full name',
  `grade` VARCHAR(20) DEFAULT NULL COMMENT 'Student grade/class',
  `parent_id` INT DEFAULT NULL,
  `default_stop_id` INT DEFAULT NULL,
  `student_id` VARCHAR(50) DEFAULT NULL COMMENT 'School student ID',
  `date_of_birth` DATE DEFAULT NULL COMMENT 'Student date of birth',
  `address` TEXT DEFAULT NULL COMMENT 'Student home address',
  `medical_notes` TEXT DEFAULT NULL COMMENT 'Medical conditions or special needs',
  `status` ENUM('active','inactive','graduated') DEFAULT 'active' COMMENT 'Student enrollment status',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`default_stop_id`) REFERENCES `stops`(`id`) ON DELETE SET NULL,
  INDEX `idx_grade` (`grade`),
  INDEX `idx_student_id` (`student_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='School students';

-- ===================================================
-- Schedule & Trip Management Tables
-- ===================================================

-- Schedules Table
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route_id` INT NOT NULL,
  `driver_id` INT NOT NULL,
  `bus_id` INT NOT NULL,
  `shift` ENUM('AM','PM') NOT NULL COMMENT 'Morning or afternoon shift',
  `days_of_week` SET('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL COMMENT 'Operating days',
  `start_time` TIME NOT NULL COMMENT 'Scheduled start time',
  `end_time` TIME DEFAULT NULL COMMENT 'Scheduled end time',
  `effective_date` DATE NOT NULL COMMENT 'When schedule starts',
  `expiry_date` DATE DEFAULT NULL COMMENT 'When schedule ends',
  `status` ENUM('active','inactive','suspended') DEFAULT 'active' COMMENT 'Schedule status',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE CASCADE,
  INDEX `idx_schedule_lookup` (`route_id`, `shift`, `effective_date`),
  INDEX `idx_driver_schedule` (`driver_id`, `effective_date`),
  INDEX `idx_bus_schedule` (`bus_id`, `effective_date`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bus schedules and assignments';

-- Trips Table
CREATE TABLE IF NOT EXISTS `trips` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `schedule_id` INT NOT NULL,
  `service_date` DATE NOT NULL COMMENT 'Date of trip service',
  `status` ENUM('planned','running','completed','cancelled') DEFAULT 'planned' COMMENT 'Trip execution status',
  `started_at` DATETIME DEFAULT NULL COMMENT 'Actual trip start time',
  `ended_at` DATETIME DEFAULT NULL COMMENT 'Actual trip end time',
  `driver_notes` TEXT DEFAULT NULL COMMENT 'Driver notes about the trip',
  `total_distance` DECIMAL(8,2) DEFAULT NULL COMMENT 'Total distance traveled',
  `fuel_used` DECIMAL(6,2) DEFAULT NULL COMMENT 'Fuel consumption',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON DELETE CASCADE,
  INDEX `idx_trip_date` (`service_date`, `status`),
  INDEX `idx_schedule_date` (`schedule_id`, `service_date`),
  UNIQUE KEY `unique_schedule_date` (`schedule_id`, `service_date`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Daily trip instances';

-- Trip Stops Table
CREATE TABLE IF NOT EXISTS `trip_stops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trip_id` INT NOT NULL,
  `stop_id` INT NOT NULL,
  `planned_eta` DATETIME DEFAULT NULL COMMENT 'Planned estimated time of arrival',
  `arrival_time` DATETIME DEFAULT NULL COMMENT 'Actual arrival time',
  `departure_time` DATETIME DEFAULT NULL COMMENT 'Actual departure time',
  `status` ENUM('pending','arrived','departed','skipped') DEFAULT 'pending' COMMENT 'Stop visit status',
  `students_count` INT DEFAULT 0 COMMENT 'Number of students at this stop',
  `notes` TEXT DEFAULT NULL COMMENT 'Notes about this stop visit',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`stop_id`) REFERENCES `stops`(`id`) ON DELETE CASCADE,
  INDEX `idx_trip_stops` (`trip_id`, `status`),
  INDEX `idx_stop_times` (`stop_id`, `arrival_time`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Trip stop visits and timing';

-- Trip Students Table
CREATE TABLE IF NOT EXISTS `trip_students` (
  `trip_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `pickup_stop_id` INT DEFAULT NULL,
  `dropoff_stop_id` INT DEFAULT NULL,
  `pickup_status` ENUM('unknown','picked','missed','no_show') DEFAULT 'unknown' COMMENT 'Student pickup status',
  `dropoff_status` ENUM('unknown','dropped','missed','no_show') DEFAULT 'unknown' COMMENT 'Student dropoff status',
  `pickup_time` DATETIME DEFAULT NULL COMMENT 'Actual pickup time',
  `dropoff_time` DATETIME DEFAULT NULL COMMENT 'Actual dropoff time',
  `notes` TEXT DEFAULT NULL COMMENT 'Notes about student transport',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`trip_id`, `student_id`),
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`pickup_stop_id`) REFERENCES `stops`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`dropoff_stop_id`) REFERENCES `stops`(`id`) ON DELETE SET NULL,
  INDEX `idx_student_trips` (`student_id`, `pickup_status`, `dropoff_status`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Student participation in trips';

-- ===================================================
-- Telemetry & Tracking Tables
-- ===================================================

-- Positions Table (GPS tracking history)
CREATE TABLE IF NOT EXISTS `positions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `trip_id` INT DEFAULT NULL,
  `bus_id` INT NOT NULL,
  `lat` DECIMAL(10,7) NOT NULL COMMENT 'Latitude coordinate',
  `lng` DECIMAL(10,7) NOT NULL COMMENT 'Longitude coordinate',
  `speed` FLOAT DEFAULT NULL COMMENT 'Speed in km/h',
  `heading` FLOAT DEFAULT NULL COMMENT 'Direction in degrees (0-360)',
  `altitude` FLOAT DEFAULT NULL COMMENT 'Altitude in meters',
  `accuracy` FLOAT DEFAULT NULL COMMENT 'GPS accuracy in meters',
  `recorded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'GPS timestamp',
  `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Server received timestamp',
  
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE CASCADE,
  INDEX `idx_bus_time` (`bus_id`, `recorded_at`),
  INDEX `idx_trip_time` (`trip_id`, `recorded_at`),
  INDEX `idx_recorded_at` (`recorded_at`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='GPS position tracking history';

-- Alerts Table
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('near_stop','delay','emergency','maintenance','system') NOT NULL COMMENT 'Alert type',
  `severity` ENUM('low','medium','high','critical') NOT NULL COMMENT 'Alert severity level',
  `title` VARCHAR(255) NOT NULL COMMENT 'Alert title',
  `message` TEXT NOT NULL COMMENT 'Alert message content',
  `bus_id` INT DEFAULT NULL,
  `trip_id` INT DEFAULT NULL,
  `stop_id` INT DEFAULT NULL,
  `driver_id` INT DEFAULT NULL,
  `student_id` INT DEFAULT NULL,
  `parent_id` INT DEFAULT NULL,
  `is_resolved` BOOLEAN DEFAULT FALSE COMMENT 'Whether alert is resolved',
  `resolved_at` DATETIME DEFAULT NULL COMMENT 'Alert resolution time',
  `resolved_by` INT DEFAULT NULL COMMENT 'User who resolved alert',
  `metadata` JSON DEFAULT NULL COMMENT 'Additional alert data',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`stop_id`) REFERENCES `stops`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE,
  INDEX `idx_type_severity` (`type`, `severity`, `is_resolved`),
  INDEX `idx_bus_alerts` (`bus_id`, `created_at`),
  INDEX `idx_trip_alerts` (`trip_id`, `created_at`),
  INDEX `idx_parent_alerts` (`parent_id`, `is_resolved`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='System alerts and notifications';

-- ===================================================
-- User Management & Authentication for SSB
-- ===================================================

-- SSB Users Table (extends base users for SSB system)
CREATE TABLE IF NOT EXISTS `ssb_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Login username',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  `role` ENUM('admin','driver','parent') NOT NULL COMMENT 'User role in system',
  `full_name` VARCHAR(255) NOT NULL COMMENT 'User full name',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Contact phone number',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Account status',
  `last_login` DATETIME DEFAULT NULL COMMENT 'Last login timestamp',
  `driver_id` INT DEFAULT NULL COMMENT 'Link to driver record if role=driver',
  `parent_id` INT DEFAULT NULL COMMENT 'Link to parent record if role=parent',
  `settings` JSON DEFAULT NULL COMMENT 'User preferences and settings',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE SET NULL,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`, `is_active`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='SSB system users and authentication';

-- ===================================================
-- Views (Optional)
-- ===================================================
CREATE OR REPLACE VIEW `user_summary` AS
SELECT 
  COUNT(*) as `total_users`,
  AVG(`age`) as `average_age`,
  MIN(`age`) as `youngest_age`,
  MAX(`age`) as `oldest_age`,
  COUNT(CASE WHEN `age` < 25 THEN 1 END) as `users_under_25`,
  COUNT(CASE WHEN `age` >= 25 AND `age` < 35 THEN 1 END) as `users_25_to_34`,
  COUNT(CASE WHEN `age` >= 35 THEN 1 END) as `users_35_and_over`
FROM `users`;

-- ===================================================
-- Useful Queries
-- ===================================================

-- Get all users ordered by creation date
-- SELECT * FROM users ORDER BY created_at DESC;

-- Get users by age range
-- SELECT * FROM users WHERE age BETWEEN 20 AND 30;

-- Search users by name
-- SELECT * FROM users WHERE name LIKE '%Nguyễn%';

-- Get user statistics
-- SELECT * FROM user_summary;

-- Count users by age groups
-- SELECT 
--   CASE 
--     WHEN age < 25 THEN 'Under 25'
--     WHEN age >= 25 AND age < 35 THEN '25-34'
--     WHEN age >= 35 THEN '35 and over'
--   END as age_group,
--   COUNT(*) as user_count
-- FROM users 
-- GROUP BY age_group;

-- ===================================================
-- Database Maintenance
-- ===================================================

-- Check table structure
-- DESCRIBE users;

-- Check table indexes
-- SHOW INDEX FROM users;

-- Check table status
-- SHOW TABLE STATUS LIKE 'users';

-- Backup command (run from terminal)
-- mysqldump -u root -p fullstack_app > fullstack_app_backup.sql

-- Restore command (run from terminal)
-- mysql -u root -p fullstack_app < fullstack_app_backup.sql