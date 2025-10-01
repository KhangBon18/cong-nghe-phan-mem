const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve users',
      message: error.message 
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve user',
      message: error.message 
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, age' 
      });
    }
    
    if (age < 1 || age > 120) {
      return res.status(400).json({ 
        error: 'Age must be between 1 and 120' 
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    const newUser = await User.create({ name, email, age: parseInt(age) });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      message: error.message 
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, age' 
      });
    }
    
    if (age < 1 || age > 120) {
      return res.status(400).json({ 
        error: 'Age must be between 1 and 120' 
      });
    }
    
    // Check if email already exists for another user
    const emailUser = await User.findByEmail(email);
    if (emailUser && emailUser.id !== parseInt(id)) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    const updatedUser = await User.update(id, { name, email, age: parseInt(age) });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update user',
      message: error.message 
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await User.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Failed to delete user',
      message: error.message 
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};