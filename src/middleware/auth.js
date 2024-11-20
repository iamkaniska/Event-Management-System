const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, '123');
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};