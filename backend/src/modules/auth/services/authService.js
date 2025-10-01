const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../../models/database');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'ssb-secret-key-2025';
    this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
    this.saltRounds = 10;
  }

  /**
   * Authenticate user with username/email and password
   */
  async login(username, password) {
    try {
      // Find user by username or email
      const query = `
        SELECT id, username, email, password_hash, role, full_name, phone, 
               is_active, driver_id, parent_id 
        FROM ssb_users 
        WHERE (username = ? OR email = ?) AND is_active = true
      `;
      
      const users = await db.query(query, [username, username]);
      
      if (users.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await db.query(
        'UPDATE ssb_users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );

      // Generate JWT token
      const token = this.generateToken(user);

      // Remove password from response
      delete user.password_hash;

      return {
        user,
        token,
        expiresIn: this.jwtExpiration
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Generate JWT token for user
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      driver_id: user.driver_id,
      parent_id: user.parent_id
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Create new user account
   */
  async register(userData) {
    try {
      const { username, email, password, role, full_name, phone, driver_id, parent_id } = userData;

      // Check if username or email already exists
      const existingUser = await db.query(
        'SELECT id FROM ssb_users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser.length > 0) {
        throw new Error('Username or email already exists');
      }

      // Hash password
      const password_hash = await this.hashPassword(password);

      // Insert new user
      const result = await db.query(`
        INSERT INTO ssb_users (username, email, password_hash, role, full_name, phone, driver_id, parent_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [username, email, password_hash, role, full_name, phone, driver_id, parent_id]);

      // Return new user (without password)
      const newUser = await db.query(
        'SELECT id, username, email, role, full_name, phone, driver_id, parent_id FROM ssb_users WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const query = `
        SELECT u.id, u.username, u.email, u.role, u.full_name, u.phone, 
               u.is_active, u.last_login, u.driver_id, u.parent_id,
               d.name as driver_name, p.name as parent_name
        FROM ssb_users u
        LEFT JOIN drivers d ON u.driver_id = d.id
        LEFT JOIN parents p ON u.parent_id = p.id
        WHERE u.id = ? AND u.is_active = true
      `;
      
      const users = await db.query(query, [userId]);
      
      if (users.length === 0) {
        throw new Error('User not found');
      }

      return users[0];
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * Check if user has required role
   */
  hasRole(user, requiredRoles) {
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  }

  /**
   * Check if user can access resource
   */
  canAccess(user, resource, action) {
    // Admin can access everything
    if (user.role === 'admin') {
      return true;
    }

    // Role-based access control rules
    const permissions = {
      driver: {
        trips: ['read', 'update'],
        positions: ['create', 'read'],
        students: ['read'],
        alerts: ['create', 'read']
      },
      parent: {
        students: ['read'],
        trips: ['read'],
        positions: ['read'],
        alerts: ['read']
      }
    };

    const userPermissions = permissions[user.role];
    if (!userPermissions || !userPermissions[resource]) {
      return false;
    }

    return userPermissions[resource].includes(action);
  }
}

module.exports = new AuthService();