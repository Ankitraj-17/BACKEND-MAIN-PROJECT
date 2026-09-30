import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['ID Proof', 'Certificate', 'Other'];

// Upload and Update document form in a single card
const UploadDocument = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ID Proof');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // If in edit mode, fetch existing document
  useEffect(() => {
    if (editId) {
      api.get(`/documents/${editId}`)
        .then((res) => {
          const doc = res.data.document;
          setTitle(doc.title);
          setCategory(doc.category);
          setDescription(doc.description || '');
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load document.');
        });
    }
  }, [editId]);

  // Handle selected file changes
  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setError('');
    }
  };

  // Submit either new upload or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editId) {
        await api.put(`/documents/${editId}`, { title, category, description });
        navigate(`/documents/${editId}`);
      } else {
        if (selectedFiles.length === 0) {
          setError('Please select at least one file.');
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });

        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* 1. Header row */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{editId ? 'Update Document' : 'Upload Document'}</h1>
          <div className="page-subtitle">
            {editId ? 'Modify document information' : 'Add official files tagged with a category'}
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* 2. Form Card */}
      <div className="card">
        <div className="card-header-strip">
          <span>{editId ? 'Document Details' : 'New Submission'}</span>
        </div>
        <div className="card-body-custom">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="e.g. Passport 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {!editId && (
              <Form.Group className="mb-4">
                <Form.Label>Files</Form.Label>
                <label htmlFor="file-upload" className="drop-zone w-100 d-block">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                  />
                  <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    Click to select files from your computer
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 text-start" style={{ fontSize: '13px', color: 'var(--text)' }}>
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="text-truncate">• {f.name}</div>
                      ))}
                    </div>
                  )}
                </label>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2 pt-2">
              <Link to={editId ? `/documents/${editId}` : '/dashboard'} className="btn-outline-custom text-decoration-none">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-green"
                disabled={submitting || !title.trim()}
              >
                {submitting ? 'Saving...' : editId ? 'Save Changes' : 'Upload Document'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
