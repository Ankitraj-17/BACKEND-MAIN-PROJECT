import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LuPlus, LuPaperclip, LuEye, LuTrash2, LuFolderOpen, LuSearch, LuX } from 'react-icons/lu';
import api from '../api/axios';
import CategoryTag, { getCategoryMeta } from '../components/CategoryTag';
import DeleteModal from '../components/DeleteModal';
import { getFileIcon } from '../utils/fileIcons';

const CATEGORIES = ['All', 'ID Proof', 'Certificate', 'Other'];

// Admin view: Dedicated company-wide document repository with search and employee filter
const AdminDashboard = () => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetches all company documents from server
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/documents');
      setAllDocuments(res.data.documents || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handles confirmed deletion of any document by admin
  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/documents/${docToDelete._id}`);
      setDocToDelete(null);
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  // Distinct list of employees from loaded documents
  const uniqueEmployees = Array.from(
    new Set(
      allDocuments
        .map((d) => d.uploadedBy?.name || d.uploadedBy?.email)
        .filter(Boolean)
    )
  ).sort();

  // Filtered documents based on search, category, and employee
  const displayedDocs = allDocuments.filter((doc) => {
    if (activeCategory !== 'All' && doc.category !== activeCategory) {
      return false;
    }
    if (selectedEmployee !== 'All') {
      const uploader = doc.uploadedBy?.name || doc.uploadedBy?.email || '';
      if (uploader !== selectedEmployee) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const titleMatch = doc.title?.toLowerCase().includes(term);
      const descMatch = doc.description?.toLowerCase().includes(term);
      const uploaderMatch = (doc.uploadedBy?.name || doc.uploadedBy?.email || '').toLowerCase().includes(term);
      if (!titleMatch && !descMatch && !uploaderMatch) return false;
    }
    return true;
  });

  const hasActiveFilters = searchTerm.trim() !== '' || selectedEmployee !== 'All' || activeCategory !== 'All';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedEmployee('All');
    setActiveCategory('All');
  };

  // Helper to format ISO date to YYYY-MM-DD cleanly
  const formatDate = (raw) => {
    if (!raw) return '—';
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return '—';
      return d.toISOString().split('T')[0];
    } catch {
      return '—';
    }
  };

  return (
    <div>
      {/* 1. Header Row */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Documents</h1>
          <div className="page-subtitle">
            Organization-wide master repository of all employee records
          </div>
        </div>
        <div className="page-actions">
          <Link to="/upload" className="btn-green text-decoration-none">
            <LuPlus size={18} /> <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* 2. Admin Search & Filter Toolbar */}
      <div
        className="card p-3 mb-4"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px'
        }}
      >
        <div className="row g-3 align-items-center">
          {/* Search Box - Flex container so text never overlaps icon */}
          <div className="col-12 col-md-5">
            <div
              className="d-flex align-items-center gap-2 px-3"
              style={{
                backgroundColor: 'var(--raised)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                height: '42px'
              }}
            >
              <LuSearch size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search documents or employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <LuX size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Filter by Employee Dropdown */}
          <div className="col-12 col-sm-6 col-md-4">
            <select
              className="form-select"
              style={{ height: '42px' }}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="All">All Employees ({uniqueEmployees.length})</option>
              {uniqueEmployees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Category Dropdown */}
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select"
              style={{ height: '42px' }}
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div
          className="d-flex justify-content-between align-items-center mt-3 pt-2"
          style={{ borderTop: '1px solid var(--border)', fontSize: '13px' }}
        >
          <span style={{ color: 'var(--muted)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{displayedDocs.length}</strong> of{' '}
            {allDocuments.length} total company {allDocuments.length === 1 ? 'document' : 'documents'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--green)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              <LuX size={14} /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Full-Page Master Documents Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" />
          </div>
        ) : displayedDocs.length === 0 ? (
          <div className="text-center py-5">
            <LuFolderOpen size={44} style={{ color: 'rgba(124, 134, 245, 0.60)', marginBottom: '12px' }} />
            <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>
              {hasActiveFilters
                ? 'No documents matched your search or filters'
                : 'No company documents uploaded yet'}
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                className="btn-outline-custom"
                onClick={handleClearFilters}
              >
                Reset filters
              </button>
            ) : (
              <Link to="/upload" className="btn-outline-custom text-decoration-none">
                Upload Document
              </Link>
            )}
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
                  <th style={{ width: '190px' }}>Uploaded by</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedDocs.map((doc) => {
                  const catMeta = getCategoryMeta(doc.category);
                  const fileObj = doc.files?.[0] || doc.filePaths?.[0] || doc.title;
                  const fileCount = doc.files?.length || doc.filePaths?.length || 1;
                  const uploaderName = doc.uploadedBy?.name || doc.uploadedBy?.email || '—';
                  const uploaderInitial = uploaderName.charAt(0).toUpperCase();

                  return (
                    <tr key={doc._id}>
                      <td style={{ color: 'var(--muted)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {formatDate(doc.uploadDate || doc.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              minWidth: '36px',
                              borderRadius: '8px',
                              backgroundColor: catMeta.tint,
                              color: catMeta.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {getFileIcon(fileObj, 18)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text)' }}>{doc.title}</div>
                            {doc.description && (
                              <div
                                className="text-truncate"
                                style={{
                                  fontSize: '12px',
                                  color: 'var(--muted)',
                                  maxWidth: '300px'
                                }}
                              >
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <CategoryTag category={doc.category} />
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--muted)' }}>
                          <LuPaperclip size={14} /> {fileCount}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-pastel-28">
                            {uploaderInitial}
                          </div>
                          <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {uploaderName}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
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
                  );
                })}
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
