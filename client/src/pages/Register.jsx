import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthTopBar from '../components/AuthTopBar';
import { LuLayoutDashboard, LuUpload, LuFolders } from 'react-icons/lu';

// Two-step registration page
const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated user
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const firstName = name.trim().split(' ')[0] || 'there';

  // Submit registration at the end of step 2
  const handleRegister = async () => {
    if (!role) return;
    setSubmitting(true);
    setError('');

    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  // STEP 1: Light Theme
  if (step === 1) {
    return (
      <div className="auth-page-light">
        <AuthTopBar rightText="Already have an account?" linkText="Sign in" linkTo="/login" />

        <div className="auth-card-light">
          <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 600, marginBottom: '2rem' }}>
            Create your account
          </h1>

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>
                Full name
              </label>
              <input
                type="text"
                required
                className="auth-input-light"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                required
                className="auth-input-light"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="auth-input-light"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-pill-btn"
              disabled={!name.trim() || !email.trim() || password.length < 6}
            >
              Continue
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/login" style={{ color: '#111111', fontSize: '0.9rem', textDecoration: 'underline' }}>
              Sign in to existing account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Dark Split Screen
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#16181B', color: '#E8E8E8', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar Dark */}
      <div style={{ borderBottom: '1px solid #2E3136', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-light">
          <span className="logo-mark">D</span>
          <span style={{ fontWeight: 600 }}>DocuVault</span>
        </Link>
        <div className="d-flex align-items-center gap-3">
          <span style={{ color: '#9A9EA5', fontSize: '0.85rem' }}>{email}</span>
          <button
            type="button"
            className="btn-outline-dark-theme"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="container-fluid flex-grow-1 d-flex" style={{ maxWidth: '1100px', margin: 'auto', padding: '2rem 1.5rem' }}>
        <div className="row w-100 align-items-center">
          {/* Left Form */}
          <div className="col-lg-6 mx-auto" style={{ maxWidth: '460px' }}>
            {/* Progress Dots */}
            <div className="d-flex gap-2 mb-4 align-items-center">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6B6B6B' }} />
              <span style={{ width: '24px', height: '8px', borderRadius: '999px', backgroundColor: '#FFFFFF' }} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '0.4rem' }}>
              Hi <span style={{ color: '#46B04A' }}>{firstName}</span>,<br />choose your role
            </h1>
            <p style={{ color: '#9A9EA5', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This decides what you can see in the app.
            </p>

            <div className="mb-4">
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9A9EA5', marginBottom: '0.65rem' }}>
                Role
              </label>
              <div className="d-flex gap-3">
                {['employee', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1,
                      padding: '14px 22px',
                      borderRadius: '8px',
                      border: `1px solid ${role === r ? '#46B04A' : '#2E3136'}`,
                      backgroundColor: role === r ? '#2A2D33' : '#1F2125',
                      color: '#E8E8E8',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div style={{ color: '#9A9EA5', fontSize: '0.8rem', marginTop: '0.6rem' }}>
                Admins can view and delete every document.
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              type="button"
              className="btn-pill"
              onClick={handleRegister}
              disabled={!role || submitting}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: role ? '#46B04A' : '#333333',
                color: role ? '#FFFFFF' : '#888888',
                cursor: role ? 'pointer' : 'not-allowed',
                border: 'none',
                fontWeight: 600
              }}
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          {/* Right Preview Panel (Hidden on small screens) */}
          <div className="col-lg-6 d-none d-lg-block ps-lg-5">
            <div style={{ backgroundColor: '#1F2125', border: '1px solid #2E3136', borderRadius: '12px', padding: '1.75rem' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <span className="logo-mark">D</span>
                <span style={{ fontWeight: 600 }}>DocuVault</span>
                <span style={{ color: '#9A9EA5', fontSize: '0.8rem', marginLeft: '0.25rem' }}>Workspace</span>
              </div>

              <div className="d-flex flex-column gap-2 mb-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', backgroundColor: '#2A2D33', borderLeft: '3px solid #46B04A', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <LuLayoutDashboard size={16} /> Dashboard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', color: '#9A9EA5', fontSize: '0.85rem' }}>
                  <LuUpload size={16} /> Upload Document
                </div>
                {role === 'admin' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', color: '#9A9EA5', fontSize: '0.85rem' }}>
                    <LuFolders size={16} /> All Documents
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#9A9EA5' }}>
              Your workspace with documents and categories
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
