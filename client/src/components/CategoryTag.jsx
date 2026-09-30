import React from 'react';

// Returns dot color for each category
const getCategoryColor = (category) => {
  if (category === 'ID Proof') return 'var(--blue)';
  if (category === 'Certificate') return 'var(--amber)';
  return 'var(--muted)';
};

// Category label with 8px colored dot and muted text
const CategoryTag = ({ category }) => {
  return (
    <span className="category-tag">
      <span
        className="category-dot"
        style={{ backgroundColor: getCategoryColor(category) }}
      />
      <span>{category}</span>
    </span>
  );
};

export default CategoryTag;
