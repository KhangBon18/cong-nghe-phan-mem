-- ===================================================
-- Sample Data for Full Stack Application
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

-- Verify inserted data
SELECT 
    id,
    name,
    email,
    age,
    created_at
FROM users 
ORDER BY created_at DESC;