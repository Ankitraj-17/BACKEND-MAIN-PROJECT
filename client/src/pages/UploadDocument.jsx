import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LuUpload, LuArrowLeft, LuX, LuPaperclip, LuCheck } from 'react-icons/lu';
import api from '../api/axios';
import CategoryTag from '../components/CategoryTag';
import { getFileIcon } from '../utils/fileIcons';

const CATEGORIES = ['ID Proof', 'Certificate', 'Other'];

// Formats file byte size into human-readable format
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Rebuilt Upload and Update document page with balanced 2-column layout
const UploadDocument = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ID Proof');
  const [description, setDescription] = useState('');
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // If in edit mode, fetch the existing document details
  useEffect(() => {
    if (editId) {
      setLoadingDoc(true);
      api.get(`/documents/${editId}`)
        .then((res) => {
          const doc = res.data.document;
          setTitle(doc.title || '');
          setCategory(doc.category || 'ID Proof');
          setDescription(doc.description || '');
          const files = doc.files?.length
            ? doc.files
            : (doc.filePaths || []).map((p) => ({ originalName: p.split('/').pop(), filePath: p }));
          setExistingFiles(files);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load document.');
        })
        .finally(() => {
          setLoadingDoc(false);
        });
    }
  }, [editId]);

  // Handles manual file selection via file picker input
  const handleFileChange = (e) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...incoming]);
      setError('');
    }
  };

  // Handles drag over event on the drop zone
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handles drag leave event on the drop zone
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handles drop event with dropped files
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const incoming = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...incoming]);
      setError('');
    }
  };

  // Removes a specific file from the pending upload list
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submits the upload or update payload to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a document title.');
      return;
    }

    if (!editId && selectedFiles.length === 0) {
      setError('Please select or drop at least one file to upload.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editId) {
        await api.put(`/documents/${editId}`, { title, category, description });
        navigate(`/documents/${editId}`);
      } else {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('category', category);
        formData.append('description', description.trim());
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });

        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loadingDoc) {
    return (
      <div className="d-flex align-items-center gap-2 py-4">
        <Spinner animation="border" size="sm" />
        <span style={{ color: 'var(--muted)' }}>Loading document details...</span>
      </div>
    );
  }

  return (
    <div>
      {/* 1. Header Row with Navigation */}
      <div className="page-header">
        <div>
          <button
            type="button"
            className="btn-outline-custom mb-3"
            onClick={() => navigate(editId ? `/documents/${editId}` : '/dashboard')}
          >
            <LuArrowLeft size={16} /> <span>Back</span>
          </button>
          <h1 className="page-title">{editId ? 'Update Document' : 'Upload Document'}</h1>
          <div className="page-subtitle">
            {editId
              ? 'Modify document metadata and settings'
              : 'Add official files tagged with a category to your secure vault'}
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* 2. Two-Column Form Layout */}
      <Form onSubmit={handleSubmit}>
        <Row className="g-4 mb-4">
          {/* Left Column: Metadata */}
          <Col lg={5} md={12}>
            <div className="card h-100 mb-0">
              <div className="card-header-strip">
                <span>Document Details</span>
              </div>
              <div className="card-body-custom d-flex flex-column gap-3">
                <Form.Group>
                  <Form.Label>
                    Document Title <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="e.g. Passport 2026, Degree Certificate"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Tag preview:</span>
                    <CategoryTag category={category} />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Add notes, expiration dates, or reference numbers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
          </Col>

          {/* Right Column: Files & Upload Area */}
          <Col lg={7} md={12}>
            <div className="card h-100 mb-0">
              <div className="card-header-strip">
                <span>
                  Files {selectedFiles.length > 0 ? `(${selectedFiles.length} selected)` : ''}
                </span>
              </div>
              <div className="card-body-custom d-flex flex-column gap-3">
                {!editId && (
                  <div>
                    <label
                      htmlFor="file-upload-input"
                      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="file-upload-input"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon-circle">
                        <LuUpload size={24} />
                      </div>
                      <div style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                        Drag & drop files here, or browse
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
                        Supports PDF, PNG, JPG, DOCX, TXT up to 10MB
                      </div>
                    </label>
                  </div>
                )}

                {/* Existing files if editing */}
                {editId && existingFiles.length > 0 && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>
                      Current Files
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {existingFiles.map((file, idx) => (
                        <div key={idx} className="file-row-item">
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            <LuPaperclip size={16} style={{ color: 'var(--green)' }} />
                            <span className="text-truncate" style={{ fontSize: '14px', color: 'var(--text)' }}>
                              {file.originalName}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Saved</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Upload List */}
                {selectedFiles.length > 0 && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>
                      Selected for Upload ({selectedFiles.length})
                    </div>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="file-row-item">
                          <div className="d-flex align-items-center gap-3 text-truncate">
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--raised)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {getFileIcon(file, 16)}
                            </div>
                            <div className="text-truncate">
                              <div className="text-truncate" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                                {file.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-icon-danger"
                            onClick={() => removeFile(idx)}
                            title="Remove file"
                          >
                            <LuX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* 3. Bottom Action Bar */}
        <div className="d-flex justify-content-end align-items-center gap-3 pt-2">
          <Link
            to={editId ? `/documents/${editId}` : '/dashboard'}
            className="btn-outline-custom text-decoration-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-green"
            disabled={submitting || !title.trim()}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <LuCheck size={16} />
                <span>{editId ? 'Save Changes' : 'Upload Document'}</span>
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default UploadDocument;
