const mysql = require('mysql2/promise');

// Initialize database and tables
const initializeDatabase = async () => {
  // Database configuration (moved inside function to ensure env vars are loaded)
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  console.log('Database config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password ? '***' : 'empty',
    port: dbConfig.port
  });

  const connection = mysql.createPool(dbConfig);
  
  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'fullstack_app';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database "${dbName}" created or already exists`);
    
    // Create new connection with database selected
    const dbConfigWithDB = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    const dbConnection = mysql.createPool(dbConfigWithDB);
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT NOT NULL CHECK (age > 0 AND age <= 120),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await dbConnection.execute(createUsersTable);
    console.log('Users table created or already exists');
    
    return dbConnection;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Get database connection with the app database selected
const getConnection = () => {
  const dbName = process.env.DB_NAME || 'fullstack_app';
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  return mysql.createPool(dbConfig);
};

module.exports = {
  initializeDatabase,
  getConnection
};