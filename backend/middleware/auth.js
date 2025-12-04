// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });

    // Format: "Bearer tokenvalue"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token)
      return res.status(401).json({ success: false, message: 'Token missing' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');

    // Attach full payload (id, email) to request
    req.user = decoded; 
    // Example: req.user = { id: 'mongoId', email: 'user@example.com', iat, exp }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};
