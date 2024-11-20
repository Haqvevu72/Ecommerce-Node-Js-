// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require("../model/user");

const authMiddleware = (req, res, next) => {
  // Get token from the 'Authorization' header
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting format: 'Bearer token'

  // If no token is provided, send a 403 Forbidden response
  if (!token) {
    return res.status(403).json({ message: 'Access token is required' });
  }

  try {
    // Verify the token using the JWT secret for access tokens
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Add the decoded user information to the request object

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired, send a 401 Unauthorized response
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next(); // Proceed if the user is an admin
  } else {
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }
};

module.exports = { authMiddleware, isAdminMiddleware };
