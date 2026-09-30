const multer = require('multer');

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  // Multer limit errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large (max 15 MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files uploaded. Maximum allowed is 10 files per upload.' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }

  // File filter validation error or custom 400
  if (err.statusCode === 400 || (err.message && err.message.startsWith('Invalid file type'))) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: `Resource not found with id of ${err.value}` });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `Duplicate value entered for ${field}. Please use another value.` });
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
