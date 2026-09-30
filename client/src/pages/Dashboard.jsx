import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LuPlus, LuPaperclip, LuEye, LuTrash2, LuFolderOpen, LuArrowRight } from 'react-icons/lu';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CategoryTag, { getCategoryMeta } from '../components/CategoryTag';
import StatsSummary from '../components/StatsSummary';
import RecentlyUploaded from '../components/RecentlyUploaded';
import DeleteModal from '../components/DeleteModal';
import { getFileIcon } from '../utils/fileIcons';

// Main Dashboard view featuring Folders, Recently Uploaded, and Recent Activity
const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [allDocuments, setAllDocuments] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetches all documents from the backend API
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

  // Handles confirmed deletion of a document
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

  const displayedDocs = activeCategory === 'All'
    ? allDocuments
    : allDocuments.filter((d) => d.category === activeCategory);

  // Latest 5 uploads across the company for admin recent activity
  const recentActivityDocs = allDocuments.slice(0, 5);

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
          <h1 className="page-title">Dashboard</h1>
          <div className="page-subtitle">
            {isAdmin ? 'System overview and quick access' : 'Your uploaded documents'}
          </div>
        </div>
        <div className="page-actions">
          <Link to="/upload" className="btn-green text-decoration-none">
            <LuPlus size={18} /> <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* 2. Folders Section */}
      <section className="dashboard-section">
        <div className="section-heading-row">
          <h2 className="section-heading">Folders</h2>
        </div>
        <StatsSummary
          documents={allDocuments}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </section>

      {/* 3. Recently Uploaded Section */}
      <section className="dashboard-section">
        <div className="section-heading-row">
          <h2 className="section-heading">Recently uploaded</h2>
        </div>
        <RecentlyUploaded documents={allDocuments} />
      </section>

      {/* 4A. Recent Activity Section (For Admin: Compact summary of latest 5 company uploads) */}
      {isAdmin && (
        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <h2 className="section-heading">Recent activity</h2>
              <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
                Latest document uploads across the organization
              </div>
            </div>
            <Link to="/admin" className="btn-outline-custom text-decoration-none">
              <span>View all documents</span> <LuArrowRight size={14} />
            </Link>
          </div>

          <div className="card">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" size="sm" />
              </div>
            ) : recentActivityDocs.length === 0 ? (
              <div className="text-center py-5">
                <LuFolderOpen size={44} style={{ color: 'rgba(124, 134, 245, 0.60)', marginBottom: '12px' }} />
                <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>
                  No documents uploaded yet
                </div>
                <Link to="/upload" className="btn-outline-custom text-decoration-none">
                  Upload Document
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table className="table align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '130px' }}>Date</th>
                        <th>Name</th>
                        <th style={{ width: '150px' }}>Category</th>
                        <th style={{ width: '90px' }}>Files</th>
                        <th style={{ width: '190px' }}>Uploaded by</th>
                        <th style={{ width: '120px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivityDocs.map((doc) => {
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
                                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{doc.title}</span>
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
                              <Link to={`/documents/${doc._id}`} className="btn-outline-custom text-decoration-none">
                                <LuEye size={14} /> <span>View</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div
                  className="d-flex justify-content-between align-items-center p-3"
                  style={{ borderTop: '1px solid var(--border)', fontSize: '13px' }}
                >
                  <span style={{ color: 'var(--muted)' }}>
                    Showing latest {recentActivityDocs.length} of {allDocuments.length} company {allDocuments.length === 1 ? 'document' : 'documents'}
                  </span>
                  <Link
                    to="/admin"
                    style={{
                      color: 'var(--green)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Manage all in Company Repository</span> <LuArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* 4B. My Documents Section with Table (For regular employees only) */}
      {!isAdmin && (
        <section className="dashboard-section">
          <div className="section-heading-row">
            <h2 className="section-heading">My documents</h2>
            <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
              {displayedDocs.length} {displayedDocs.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          <div className="card">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" size="sm" />
              </div>
            ) : displayedDocs.length === 0 ? (
              <div className="text-center py-5">
                <LuFolderOpen size={44} style={{ color: 'rgba(124, 134, 245, 0.60)', marginBottom: '12px' }} />
                <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>
                  {activeCategory === 'All' ? 'No documents yet' : `No documents in ${activeCategory}`}
                </div>
                <Link to="/upload" className="btn-outline-custom text-decoration-none">Upload Document</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Date</th>
                      <th>Name</th>
                      <th style={{ width: '150px' }}>Category</th>
                      <th style={{ width: '90px' }}>Files</th>
                      <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedDocs.map((doc) => {
                      const catMeta = getCategoryMeta(doc.category);
                      const fileObj = doc.files?.[0] || doc.filePaths?.[0] || doc.title;
                      const fileCount = doc.files?.length || doc.filePaths?.length || 1;

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
                              <span style={{ fontWeight: 500, color: 'var(--text)' }}>{doc.title}</span>
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
        </section>
      )}

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

export default Dashboard;
