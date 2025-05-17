// middleware/fraudMiddleware.js

const fraudMiddleware = (req, res, next) => {
  // Future fraud detection logic can go here
  next();
};

module.exports = fraudMiddleware;
