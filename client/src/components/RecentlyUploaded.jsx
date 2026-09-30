import React from 'react';
import { Link } from 'react-router-dom';
import CategoryTag, { getCategoryMeta } from './CategoryTag';
import { getFileIcon } from '../utils/fileIcons';
import { formatRelativeTime } from '../utils/dateUtils';

// Grid of up to 4 newest documents shown in tall card style
const RecentlyUploaded = ({ documents = [] }) => {
  // Sort documents newest first, up to 4 items
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.uploadDate || b.createdAt) - new Date(a.uploadDate || a.createdAt))
    .slice(0, 4);

  if (recentDocs.length === 0) {
    return (
      <div className="card p-4 text-center" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Nothing uploaded yet</span>
      </div>
    );
  }

  return (
    <div className="cards-grid-4">
      {recentDocs.map((doc) => {
        const meta = getCategoryMeta(doc.category);
        const fileObj = doc.files?.[0] || doc.filePaths?.[0] || doc.title;
        const fileCount = doc.files?.length || doc.filePaths?.length || 1;

        return (
          <Link
            key={doc._id}
            to={`/documents/${doc._id}`}
            className="recent-tall-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = meta.hoverBorder;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <div
              className="recent-icon-tile-48"
              style={{
                backgroundColor: meta.tint,
                color: meta.color
              }}
            >
              {getFileIcon(fileObj, 24)}
            </div>

            <div
              className="text-truncate w-100"
              style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}
              title={doc.title}
            >
              {doc.title}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <CategoryTag category={doc.category} />
            </div>

            <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: 'auto' }}>
              Uploaded {formatRelativeTime(doc.uploadDate || doc.createdAt)}
            </div>

            {fileCount > 1 && (
              <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '2px' }}>
                {fileCount} files
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default RecentlyUploaded;
