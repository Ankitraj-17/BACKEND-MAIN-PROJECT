import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LuPlus, LuPaperclip, LuEye, LuTrash2, LuFolderOpen } from 'react-icons/lu';
import api from '../api/axios';
import CategoryTag from '../components/CategoryTag';
import DeleteModal from '../components/DeleteModal';

const CATEGORIES = ['All', 'ID Proof', 'Certificate', 'Other'];

// Admin view displaying all company documents with uploader info
const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all documents from server
  const fetchDocuments = async (cat = activeTab) => {
    try {
      setLoading(true);
      setError('');
      const params = cat !== 'All' ? { category: cat } : {};
      const res = await api.get('/documents', { params });
      setDocuments(res.data.documents || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(activeTab);
  }, [activeTab]);

  // Handle document deletion
  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/documents/${docToDelete._id}`);
      setDocToDelete(null);
      fetchDocuments(activeTab);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  const getTabCount = (cat) => {
    if (cat === 'All') return documents.length;
    return documents.filter((d) => d.category === cat).length;
  };

  return (
    <div>
      {/* 1. Header row */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Documents</h1>
          <div className="page-subtitle">
            Every employee's uploaded documents
          </div>
        </div>
        <div className="page-actions">
          <Link to="/upload" className="btn-green text-decoration-none">
            <LuPlus size={18} /> <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* 2. Table card */}
      <div className="card">
        <div className="card-header-strip">
          <span>Documents</span>
          <div className="tabs-group">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tab-item ${activeTab === cat ? 'active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                <span>{cat}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{getTabCount(cat)}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" variant="light" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-5">
            <LuFolderOpen size={40} style={{ color: 'var(--muted)', marginBottom: '12px' }} />
            <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>No documents yet</div>
            <Link to="/upload" className="btn-outline-custom text-decoration-none">Upload Document</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="table align-middle">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Date</th>
                  <th>Title</th>
                  <th style={{ width: '140px' }}>Category</th>
                  <th style={{ width: '90px' }}>Files</th>
                  <th style={{ width: '180px' }}>Uploader</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td style={{ color: 'var(--muted)', fontSize: '14px' }}>
                      {new Date(doc.uploadDate || doc.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td><div style={{ fontWeight: 500 }}>{doc.title}</div></td>
                    <td><CategoryTag category={doc.category} /></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--muted)' }}>
                        <LuPaperclip size={14} /> {doc.files?.length || doc.filePaths?.length || 0}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      {doc.uploadedBy?.name || doc.uploadedBy?.email || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="d-inline-flex gap-2">
                        <Link to={`/documents/${doc._id}`} className="btn-outline-custom text-decoration-none">
                          <LuEye size={14} /> <span>View</span>
                        </Link>
                        <button type="button" className="btn-delete" onClick={() => setDocToDelete(doc)}>
                          <LuTrash2 size={14} /> <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={!!docToDelete}
        title={docToDelete?.title}
        deleting={deleting}
        onHide={() => setDocToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
