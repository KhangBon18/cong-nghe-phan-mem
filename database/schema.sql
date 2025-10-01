-- ===================================================
-- Full Stack Application Database Schema
-- ReactJS + NodeJS + MySQL
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