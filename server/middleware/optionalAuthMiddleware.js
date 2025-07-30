const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Если токена нет, продолжаем без авторизации
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (error) {
      // Если токен невалидный, продолжаем без авторизации
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

module.exports = optionalAuthMiddleware;
