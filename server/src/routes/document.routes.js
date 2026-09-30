const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentStats,
  getFile
} = require('../controllers/document.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Document metrics
router.get('/metrics/stats', protect, getDocumentStats);

// Main document routes: List & Multi-file Upload
router
  .route('/')
  .get(protect, getDocuments)
  .post(protect, upload.array('files', 10), uploadDocument);

// Single file stream/download route (Owner or Admin enforced in controller)
router.get('/:id/files/:fileId', protect, getFile);

// Single document operations: View, Update, Delete (Owner or Admin enforced in controller)
router
  .route('/:id')
  .get(protect, getDocumentById)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;
