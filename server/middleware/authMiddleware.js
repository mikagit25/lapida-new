const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
  console.log('BODY TOKEN:', req.body && req.body.token);
  let token = null;
    const authHeader = req.header('Authorization') || req.header('authorization');
    console.log('=== AuthMiddleware Debug ===');
    console.log('Authorization header:', authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }
    // Попытка получить токен из cookie
    if (!token && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|; )token=([^;]*)/);
      if (match) token = match[1];
    }
    // Попытка получить токен из тела запроса (например, FormData)
    if (!token && req.body && req.body.token) {
      token = req.body.token;
    }
    console.log('Extracted token:', token ? 'EXISTS' : 'MISSING');
    if (!token) {
      console.log('ERROR: No token provided');
      return res.status(401).json({ message: 'Нет токена, доступ запрещен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Found user:', user ? user._id : 'NOT FOUND');
    
    if (!user) {
      console.log('ERROR: User not found for token');
      return res.status(401).json({ message: 'Токен недействителен' });
    }

    req.user = user;
    console.log('=== Auth Success ===');
    next();
  } catch (error) {
    console.error('=== Auth middleware error ===', error);
    res.status(401).json({ message: 'Токен недействителен' });
  }
};

module.exports = authMiddleware;
