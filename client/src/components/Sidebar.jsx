import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { LuLayoutDashboard, LuUpload, LuFolders, LuLogOut } from 'react-icons/lu';

// Side navigation bar for all logged-in views with user dropdown
const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Handles logging out the user and redirecting to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      {/* 1. App name & logo mark */}
      <Link to="/dashboard" className="sidebar-brand">
        <span className="logo-mark">D</span>
        <span>DocuVault</span>
      </Link>

      {/* 2. Menu label */}
      <div className="sidebar-label">MENU</div>

      {/* 3. Navigation Links */}
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

      {/* 4. User Section with Avatar Dropdown */}
      <div className="sidebar-footer">
        <Dropdown drop="up" align="start">
          <Dropdown.Toggle as="div" className="avatar-dropdown-toggle">
            <div className="avatar-circle" title={user?.name || 'User'}>
              {initial}
            </div>
            <div className="avatar-meta d-none d-md-block">
              <div className="avatar-name text-truncate">{user?.name}</div>
              <div className="avatar-role text-truncate">{user?.role}</div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="user-dropdown-card">
            <div className="user-dropdown-header">
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>
                {user?.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
            <Dropdown.Item onClick={handleLogout} className="user-dropdown-logout">
              <LuLogOut size={16} />
              <span>Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </aside>
  );
};

export default Sidebar;
