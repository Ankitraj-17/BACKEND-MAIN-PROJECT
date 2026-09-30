const mongoose = require('mongoose');

const fileItemSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    fileData: {
      type: Buffer
    }
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a document title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Please specify a document category'],
      enum: {
        values: ['ID Proof', 'Certificate', 'Other'],
        message: '{VALUE} is not a supported category'
      }
    },
    // Array of file metadata items
    files: [fileItemSchema],
    // Array of file paths directly (satisfying the prompt's filePaths[] requirement explicitly)
    filePaths: {
      type: [String],
      required: [true, 'At least one file path is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A document submission must have at least one uploaded file.'
      }
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast category search and user queries
documentSchema.index({ category: 1, uploadDate: -1 });
documentSchema.index({ uploadedBy: 1, uploadDate: -1 });

module.exports = mongoose.model('Document', documentSchema);
