import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Modal } from 'react-bootstrap';
import { LuFileText, LuTrash2, LuPencil, LuExternalLink, LuDownload, LuArrowLeft } from 'react-icons/lu';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CategoryTag from '../components/CategoryTag';
import DeleteModal from '../components/DeleteModal';

// Document Details page with 5/12 and 7/12 split layout
const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch document details from backend API
  const fetchDoc = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/documents/${id}`);
      setDocument(res.data.document);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [id]);

  // Delete document and redirect to dashboard
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/documents/${id}`);
      setShowDeleteModal(false);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
      setDeleting(false);
    }
  };

  // Handle authenticated file View with in-app modal preview
  const handleViewFile = async (file, index) => {
    setShowPreviewModal(true);
    setPreviewFile({
      name: file.originalName || 'File Preview',
      loading: true,
      url: null,
      rawFile: file,
      index
    });

    try {
      const fileId = file._id || index;
      const response = await api.get(`/documents/${id}/files/${fileId}`, {
        responseType: 'blob'
      });
      const blobType = file.mimeType || response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: blobType });
      const objectUrl = URL.createObjectURL(blob);
      const isImage = blobType.startsWith('image/');
      const isPdf = blobType === 'application/pdf';

      setPreviewFile({
        name: file.originalName || 'File Preview',
        loading: false,
        url: objectUrl,
        mimeType: blobType,
        isImage,
        isPdf,
        rawFile: file,
        index
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load file preview.');
      setShowPreviewModal(false);
      setPreviewFile(null);
    }
  };

  const handleClosePreview = () => {
    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile.url);
    }
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  // Handle authenticated file Download
  const handleDownloadFile = async (file, index) => {
    try {
      const fileId = file._id || index;
      const response = await api.get(`/documents/${id}/files/${fileId}?download=true`, {
        responseType: 'blob'
      });
      const blobType = file.mimeType || response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: blobType });
      const objectUrl = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', file.originalName || 'download');
      window.document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to download file.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 py-4">
        <Spinner animation="border" size="sm" />
        <span style={{ color: 'var(--muted)' }}>Loading document...</span>
      </div>
    );
  }

  if (error || !document) {
    return <div className="error-box">{error || 'Document not found.'}</div>;
  }

  const isOwner = document.uploadedBy?._id === user?.id || document.uploadedBy === user?.id;
  const canManage = isOwner || isAdmin;
  const files = document.files?.length ? document.files : (document.filePaths || []).map((p) => ({ originalName: p.split('/').pop(), filePath: p }));

  return (
    <div>
      {/* 1. Header row */}
      <div className="mb-4">
        <button
          type="button"
          className="btn-outline-custom mb-3"
          onClick={() => navigate('/dashboard')}
        >
          <LuArrowLeft size={16} /> <span>Back to Dashboard</span>
        </button>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="page-title">{document.title}</h1>
          <CategoryTag category={document.category} />
        </div>
        <div className="page-subtitle">
          Uploaded on {new Date(document.uploadDate || document.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* 2. Two-column grid (5/12 and 7/12) */}
      <Row className="g-4">
        {/* Left card: Details */}
        <Col lg={5} md={12}>
          <div className="card h-100">
            <div className="card-header-strip">Details</div>
            <div className="card-body-custom d-flex flex-column h-100">
              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Title</span>
                  <span style={{ fontWeight: 500, fontSize: '14px' }}>{document.title}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Category</span>
                  <CategoryTag category={document.category} />
                </div>
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Uploaded on</span>
                  <span style={{ fontSize: '14px' }}>{new Date(document.uploadDate || document.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Uploaded by</span>
                  <span style={{ fontSize: '14px' }}>{document.uploadedBy?.name || document.uploadedBy?.email || '—'}</span>
                </div>
              </div>

              {canManage && (
                <div className="d-flex gap-3 mt-auto pt-3">
                  <button
                    type="button"
                    className="btn-outline-custom flex-grow-1 justify-content-center"
                    style={{ height: '40px' }}
                    onClick={() => navigate(`/upload?id=${document._id}`)}
                  >
                    <LuPencil size={15} /> <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-delete flex-grow-1 justify-content-center"
                    style={{ height: '40px' }}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <LuTrash2 size={15} /> <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Right card: Files */}
        <Col lg={7} md={12}>
          <div className="card h-100">
            <div className="card-header-strip">Files ({files.length})</div>
            <div className="card-body-custom d-flex flex-column gap-2">
              {files.map((file, idx) => (
                <div key={idx} className="file-row-item">
                  <div className="d-flex align-items-center gap-3 text-truncate">
                    <div className="icon-tile-green">
                      <LuFileText size={18} />
                    </div>
                    <span className="text-truncate" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                      {file.originalName}
                    </span>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0 ms-2">
                    <button
                      type="button"
                      onClick={() => handleViewFile(file, idx)}
                      className="btn-outline-custom"
                    >
                      <LuExternalLink size={13} /> <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(file, idx)}
                      className="btn-outline-custom"
                    >
                      <LuDownload size={13} /> <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        title={document.title}
        deleting={deleting}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* 4. In-App File Preview Modal */}
      <Modal
        show={showPreviewModal}
        onHide={handleClosePreview}
        size="lg"
        centered
        contentClassName="bg-dark text-light border-secondary"
      >
        <Modal.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid var(--border)' }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }} className="text-truncate">
            {previewFile?.name || 'File Preview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            minHeight: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#141619',
            padding: '1.5rem'
          }}
        >
          {previewFile?.loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 mb-0" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                Loading preview...
              </p>
            </div>
          ) : previewFile?.isImage ? (
            <img
              src={previewFile.url}
              alt={previewFile.name}
              style={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: '6px'
              }}
            />
          ) : previewFile?.isPdf ? (
            <iframe
              src={previewFile.url}
              title={previewFile.name}
              style={{
                width: '100%',
                height: '65vh',
                border: 'none',
                borderRadius: '6px'
              }}
            />
          ) : (
            <div className="text-center py-4">
              <LuFileText size={48} style={{ color: 'var(--muted)' }} className="mb-3" />
              <p style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                In-browser preview is not supported for this file type.
              </p>
              <button
                type="button"
                className="btn-outline-custom mx-auto"
                onClick={() => handleDownloadFile(previewFile.rawFile, previewFile.index)}
              >
                <LuDownload size={14} /> <span>Download to View</span>
              </button>
            </div>
          )}
        </Modal.Body>
        {previewFile?.url && (
          <Modal.Footer style={{ borderTop: '1px solid var(--border)' }}>
            <a
              href={previewFile.url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-custom text-decoration-none"
            >
              <LuExternalLink size={14} /> <span>Open in New Tab</span>
            </a>
            <button
              type="button"
              className="btn-outline-custom"
              onClick={() => handleDownloadFile(previewFile.rawFile, previewFile.index)}
            >
              <LuDownload size={14} /> <span>Download</span>
            </button>
            <button
              type="button"
              className="btn-outline-custom"
              onClick={handleClosePreview}
            >
              <span>Close</span>
            </button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default DocumentDetails;
