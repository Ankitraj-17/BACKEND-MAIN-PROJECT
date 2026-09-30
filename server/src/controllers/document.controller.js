const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// Check if user is the document owner or an admin
const canAccess = (doc, user) => {
  const isOwner = doc.uploadedBy && (doc.uploadedBy._id || doc.uploadedBy).toString() === user._id.toString();
  return isOwner || user.role === 'admin';
};

// Safely unlink files from disk
const cleanupDiskFiles = (files) => {
  files?.forEach((file) => {
    const fullPath = file.path || (file.filePath ? path.resolve(file.filePath) : null);
    if (fullPath && fs.existsSync(fullPath)) {
      try { fs.unlinkSync(fullPath); } catch (e) {}
    }
  });
};

// Upload new document with multiple files
exports.uploadDocument = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !category) {
      cleanupDiskFiles(req.files);
      return res.status(400).json({
        success: false,
        message: 'Title and category are required.'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one file.'
      });
    }

    const filesMetadata = req.files.map((file) => ({
      fileName: file.filename,
      originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      filePath: `uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));

    const document = await Document.create({
      title,
      description: description || '',
      category,
      files: filesMetadata,
      filePaths: filesMetadata.map((f) => f.filePath),
      uploadedBy: req.user._id,
      uploadDate: new Date()
    });

    const populatedDoc = await Document.findById(document._id).populate(
      'uploadedBy',
      'name email department role'
    );

    res.status(201).json({
      success: true,
      message: 'Document and files uploaded successfully.',
      document: populatedDoc
    });
  } catch (error) {
    cleanupDiskFiles(req.files);
    next(error);
  }
};

// Get documents list with optional category filter
exports.getDocuments = async (req, res, next) => {
  try {
    const queryObj = {};

    if (req.user.role !== 'admin') {
      queryObj.uploadedBy = req.user._id;
    } else if (req.query.employeeId) {
      queryObj.uploadedBy = req.query.employeeId;
    }

    if (req.query.category && req.query.category !== 'All') {
      queryObj.category = req.query.category;
    }

    const documents = await Document.find(queryObj)
      .populate('uploadedBy', 'name email department role')
      .sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// Get single document by ID
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      'uploadedBy',
      'name email department role'
    );

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!canAccess(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the document owner or an administrator can view this document.'
      });
    }

    res.status(200).json({ success: true, document });
  } catch (error) {
    next(error);
  }
};

// Update document metadata
exports.updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!canAccess(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to edit this document.'
      });
    }

    const { title, category, description } = req.body;
    if (title) document.title = title;
    if (category) document.category = category;
    if (description !== undefined) document.description = description;

    await document.save();

    const updatedDoc = await Document.findById(document._id).populate(
      'uploadedBy',
      'name email department role'
    );

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDoc
    });
  } catch (error) {
    next(error);
  }
};

// Delete document and remove physical files from disk
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!canAccess(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the uploading employee or an admin can delete this document.'
      });
    }

    cleanupDiskFiles(document.files);
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document and associated files deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get document metrics & category breakdown
exports.getDocumentStats = async (req, res, next) => {
  try {
    const matchStage = req.user.role === 'admin' ? {} : { uploadedBy: req.user._id };

    const categoryStats = await Document.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const totalCount = await Document.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      totalCount,
      categoryStats
    });
  } catch (error) {
    next(error);
  }
};

// Stream or download a file with authorization check
exports.getFile = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!canAccess(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this file.'
      });
    }

    const { fileId } = req.params;
    let targetFile = null;

    if (Array.isArray(document.files) && document.files.length > 0) {
      targetFile = document.files.find((f) => f._id && f._id.toString() === fileId);

      if (!targetFile && !isNaN(Number(fileId))) {
        const index = parseInt(fileId, 10);
        if (index >= 0 && index < document.files.length) {
          targetFile = document.files[index];
        }
      }

      if (!targetFile) {
        targetFile = document.files.find(
          (f) => f.fileName === fileId || path.basename(f.filePath || '') === fileId
        );
      }
    }

    if (!targetFile) {
      return res.status(404).json({ success: false, message: 'File not found in this document' });
    }

    const uploadBaseDir = path.resolve(process.env.UPLOAD_PATH || 'uploads');
    const safeFilename = path.basename(targetFile.fileName || targetFile.filePath);
    const absoluteFilePath = path.join(uploadBaseDir, safeFilename);

    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ success: false, message: 'File does not exist on disk' });
    }

    const originalName = targetFile.originalName || safeFilename;

    if (req.query.download === 'true') {
      return res.download(absoluteFilePath, originalName);
    }

    if (targetFile.mimeType) {
      res.setHeader('Content-Type', targetFile.mimeType);
    }
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
    return res.sendFile(absoluteFilePath);
  } catch (error) {
    next(error);
  }
};
