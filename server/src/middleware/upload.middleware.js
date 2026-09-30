const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.resolve(process.env.UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate clean, collision-free filename with utf8 originalname
    const originalNameUtf8 = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedOriginal = originalNameUtf8.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}`);
  }
});

// File filter for allowed extensions and MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const allowedExtensions = /pdf|jpg|jpeg|png|webp|doc|docx|txt/i;
  const originalNameUtf8 = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const extName = allowedExtensions.test(
    path.extname(originalNameUtf8).toLowerCase()
  );
  const mimeTypeMatches = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeTypeMatches) {
    return cb(null, true);
  } else {
    const err = new Error(
      `Invalid file type "${path.extname(file.originalname)}". Only PDF, DOC, DOCX, TXT, PNG, JPG, and WEBP files are allowed.`
    );
    err.statusCode = 400;
    return cb(err, false);
  }
};

// Initialize Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB per file
    files: 10 // Max 10 files per request
  },
  fileFilter: fileFilter
});

module.exports = upload;
