# Database Management

Thư mục này chứa các file SQL để quản lý database của ứng dụng Full Stack.

## Files

### 📄 `schema.sql`
- **Mục đích**: Tạo database schema và tables
- **Nội dung**: 
  - Tạo database `fullstack_app`
  - Tạo table `users` với đầy đủ constraints
  - View `user_summary` để thống kê
  - Các queries mẫu hữu ích

### 📄 `sample_data.sql`
- **Mục đích**: Insert dữ liệu mẫu để test
- **Nội dung**: 10 users mẫu với thông tin đầy đủ

## Cách sử dụng

### 1. Tạo database và tables
```bash
mysql -u root -p < database/schema.sql
```

### 2. Insert dữ liệu mẫu
```bash
mysql -u root -p < database/sample_data.sql
```

### 3. Backup database
```bash
mysqldump -u root -p fullstack_app > backup/fullstack_app_$(date +%Y%m%d_%H%M%S).sql
```

### 4. Restore database
```bash
mysql -u root -p fullstack_app < backup/fullstack_app_20241001_120000.sql
```

## Database Schema

### Table: `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| `name` | VARCHAR(255) | NOT NULL | User full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `age` | INT | NOT NULL, CHECK (1-120) | User age |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### Indexes
- `PRIMARY KEY` on `id`
- `UNIQUE INDEX` on `email`
- `INDEX` on `created_at`

## Useful Queries

### Get all users
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Search by name
```sql
SELECT * FROM users WHERE name LIKE '%Nguyễn%';
```

### Age statistics
```sql
SELECT * FROM user_summary;
```

### Users by age group
```sql
SELECT 
  CASE 
    WHEN age < 25 THEN 'Dưới 25'
    WHEN age >= 25 AND age < 35 THEN '25-34'
    WHEN age >= 35 THEN '35 trở lên'
  END as age_group,
  COUNT(*) as user_count
FROM users 
GROUP BY age_group;
```