import React from 'react';
import { Link } from 'react-router-dom';

// Simple top bar for auth pages
const AuthTopBar = ({ rightText, linkText, linkTo }) => {
  return (
    <div className="auth-topbar d-flex justify-content-between align-items-center">
      <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
        <span className="logo-mark">D</span>
        <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>DocuVault</span>
      </Link>
      <div style={{ fontSize: '0.875rem' }}>
        <span style={{ color: '#6B6B6B', marginRight: '0.4rem' }}>{rightText}</span>
        <Link to={linkTo} style={{ color: '#111111', fontWeight: 600, textDecoration: 'underline' }}>
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default AuthTopBar;
