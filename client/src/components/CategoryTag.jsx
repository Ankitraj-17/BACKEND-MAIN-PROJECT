import React from 'react';

// Single source of truth for category color system
export const categoryColorMap = {
  All: {
    color: 'var(--c-green)',
    tint: 'var(--c-green-tint)',
    border: 'rgba(92, 191, 69, 0.35)',
    hoverBorder: 'rgba(92, 191, 69, 0.50)'
  },
  'ID Proof': {
    color: 'var(--c-periwinkle)',
    tint: 'var(--c-periwinkle-tint)',
    border: 'rgba(124, 134, 245, 0.35)',
    hoverBorder: 'rgba(124, 134, 245, 0.50)'
  },
  Certificate: {
    color: 'var(--c-yellow)',
    tint: 'var(--c-yellow-tint)',
    border: 'rgba(242, 184, 36, 0.35)',
    hoverBorder: 'rgba(242, 184, 36, 0.50)'
  },
  Other: {
    color: 'var(--c-coral)',
    tint: 'var(--c-coral-tint)',
    border: 'rgba(240, 138, 107, 0.35)',
    hoverBorder: 'rgba(240, 138, 107, 0.50)'
  }
};

// Returns metadata (color, tint, border) for a category
export const getCategoryMeta = (category) => {
  if (category === 'ID Proof') return categoryColorMap['ID Proof'];
  if (category === 'Certificate') return categoryColorMap['Certificate'];
  if (category === 'Other') return categoryColorMap['Other'];
  return categoryColorMap['All'];
};

// Category label with dot in category color, tint background, and 1px border at 35% opacity
const CategoryTag = ({ category }) => {
  const meta = getCategoryMeta(category);
  return (
    <span
      className="category-tag"
      style={{
        backgroundColor: meta.tint,
        border: `1px solid ${meta.border}`,
        color: '#FFFFFF'
      }}
    >
      <span
        className="category-dot"
        style={{ backgroundColor: meta.color }}
      />
      <span>{category}</span>
    </span>
  );
};

export default CategoryTag;
