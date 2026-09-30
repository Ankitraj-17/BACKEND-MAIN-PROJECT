import React from 'react';
import { LuFolder } from 'react-icons/lu';
import { getCategoryMeta } from './CategoryTag';
import { formatRelativeTime } from '../utils/dateUtils';

// Grid of 4 tall folder cards with large 52px icon, counts, and last upload timestamp
const StatsSummary = ({ documents = [], activeCategory = 'All', onSelectCategory }) => {
  const categories = ['All', 'ID Proof', 'Certificate', 'Other'];

  // Finds the newest upload date for a given category
  const getLastUpload = (cat) => {
    const list = cat === 'All'
      ? documents
      : documents.filter((d) => d.category === cat);
    if (!list.length) return null;
    const sorted = [...list].sort(
      (a, b) => new Date(b.uploadDate || b.createdAt) - new Date(a.uploadDate || a.createdAt)
    );
    return sorted[0]?.uploadDate || sorted[0]?.createdAt;
  };

  return (
    <div className="cards-grid-4">
      {categories.map((cat) => {
        const meta = getCategoryMeta(cat);
        const isActive = activeCategory === cat;
        const count = cat === 'All'
          ? documents.length
          : documents.filter((d) => d.category === cat).length;
        const lastDate = getLastUpload(cat);
        const label = cat === 'All' ? 'All documents' : cat;

        return (
          <button
            key={cat}
            type="button"
            className={`folder-tall-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.borderColor = meta.hoverBorder;
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.borderColor = 'var(--border)';
            }}
            style={{
              borderColor: isActive ? meta.color : 'var(--border)',
              backgroundColor: isActive ? 'var(--raised)' : 'var(--card)'
            }}
          >
            <LuFolder size={52} fill={meta.color} stroke={meta.color} />
            <div style={{ height: '28px' }} />
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '2px' }}>
              {count} {count === 1 ? 'document' : 'documents'}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
              {lastDate ? `Last upload ${formatRelativeTime(lastDate)}` : 'No uploads yet'}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsSummary;
