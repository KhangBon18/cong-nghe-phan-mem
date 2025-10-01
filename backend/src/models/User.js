const { getConnection } = require('./database');

class User {
  static async create(userData) {
    const connection = getConnection();
    try {
      const { name, email, age } = userData;
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age]
      );
      
      // Get the created user
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const connection = getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT * FROM users ORDER BY created_at DESC'
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const connection = getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    const connection = getConnection();
    try {
      const { name, email, age } = userData;
      await connection.execute(
        'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
        [name, email, age, id]
      );
      
      // Get the updated user
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const connection = getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const connection = getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;