const authService = require('../services/authService');

/**
 * JWT Authentication Middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = authService.verifyToken(token);
    
    // Get fresh user data
    const user = await authService.getUserProfile(decoded.id);
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based Authorization Middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!authService.hasRole(req.user, userRoles)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Resource-based Authorization Middleware
 */
const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!authService.canAccess(req.user, resource, action)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: cannot ${action} ${resource}`
      });
    }

    next();
  };
};

/**
 * Optional Authentication Middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      const user = await authService.getUserProfile(decoded.id);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Middleware to ensure user can only access their own data
 */
const requireOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access any user's data
    if (req.user.role === 'admin') {
      return next();
    }

    const requestedUserId = req.params[userIdParam] || req.body[userIdParam];
    
    if (parseInt(requestedUserId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: can only access your own data'
      });
    }

    next();
  };
};

/**
 * Middleware for driver-specific access
 */
const requireDriverAccess = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Admin can access any driver data
  if (req.user.role === 'admin') {
    return next();
  }

  // Driver can only access their own data
  if (req.user.role === 'driver') {
    const driverId = req.params.driverId || req.body.driver_id;
    if (parseInt(driverId) !== req.user.driver_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: can only access your own driver data'
      });
    }
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: driver access required'
  });
};

/**
 * Middleware for parent-specific access
 */
const requireParentAccess = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Admin can access any parent data
  if (req.user.role === 'admin') {
    return next();
  }

  // Parent can only access their own data
  if (req.user.role === 'parent') {
    const parentId = req.params.parentId || req.body.parent_id;
    if (parseInt(parentId) !== req.user.parent_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: can only access your own parent data'
      });
    }
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: parent access required'
  });
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission,
  optionalAuth,
  requireOwnership,
  requireDriverAccess,
  requireParentAccess
};