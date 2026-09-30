import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuLayoutDashboard, LuUpload, LuFolders, LuLogOut } from 'react-icons/lu';

// Dark fixed sidebar matching section 7
const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      {/* 1. App name & logo mark */}
      <Link to="/" className="sidebar-brand">
        <span className="logo-mark">D</span>
        <span>DocuVault</span>
      </Link>

      {/* 2. Menu label */}
      <div className="sidebar-label">MENU</div>

      {/* 3. Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LuLayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LuUpload size={18} />
          <span>Upload Document</span>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LuFolders size={18} />
            <span>All Documents</span>
          </NavLink>
        )}
      </nav>

      {/* 5. User avatar & Logout button */}
      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="avatar-circle">{initial}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-outline-custom w-100 justify-content-center"
          onClick={handleLogout}
        >
          <LuLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
