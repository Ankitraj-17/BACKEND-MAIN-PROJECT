import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuFiles, LuLayers, LuLock, LuFolders, LuShieldCheck, LuTrash2, LuCheck } from 'react-icons/lu';
import '../landing.css';

// Public static landing page
const Landing = () => {
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users directly to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      {/* 1. Navbar */}
      <header className="landing-nav">
        <div className="landing-container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-4">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
              <span className="logo-mark">D</span>
              <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>DocuVault</span>
            </Link>
            <div className="d-none d-md-flex gap-3">
              <a href="#features" className="text-decoration-none" style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                Features
              </a>
              <a href="#how" className="text-decoration-none" style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                How it works
              </a>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="text-decoration-none text-dark" style={{ fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn-pill btn-pill-dark" style={{ fontSize: '0.85rem' }}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="hero-title">Keep your company documents in one place</h1>
              <p style={{ color: '#6B6B6B', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Upload ID proofs and certificates, tag them by category, and keep them private to you and your admin.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn-pill btn-pill-dark">
                  Get started
                </Link>
                <Link to="/login" className="btn-pill btn-pill-dark">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-mock-panel">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>Recent Documents</div>
                <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E6E4DF' }}>
                      <td style={{ padding: '8px 0', color: '#6B6B6B' }}>2026-09-28</td>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Passport Copy</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        <span style={{ border: '1px solid #E6E4DF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>ID Proof</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E6E4DF' }}>
                      <td style={{ padding: '8px 0', color: '#6B6B6B' }}>2026-09-25</td>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>B.Tech Degree Certificate</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        <span style={{ border: '1px solid #E6E4DF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Certificate</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#6B6B6B' }}>2026-09-20</td>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>Address Verification</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        <span style={{ border: '1px solid #E6E4DF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Other</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section id="features" style={{ padding: '4rem 0' }}>
        <div className="landing-container">
          <div className="features-grid">
            {[
              { icon: LuFiles, title: 'Multiple uploads', desc: 'Add several files in a single submission.' },
              { icon: LuLayers, title: 'Categories', desc: 'Tag every document as ID Proof, Certificate or Other.' },
              { icon: LuLock, title: 'Private by default', desc: 'Only the owner or an admin can view a document.' },
              { icon: LuFolders, title: 'Admin view', desc: 'Admins can see and manage every document.' },
              { icon: LuShieldCheck, title: 'Secure sign-in', desc: 'Accounts are protected with JWT authentication.' },
              { icon: LuTrash2, title: 'Easy cleanup', desc: 'Delete a document and its files in one click.' }
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <f.icon size={22} style={{ marginBottom: '1rem', color: '#111111' }} />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{f.title}</h2>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how" style={{ padding: '2rem 0 4rem' }}>
        <div className="landing-container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="how-card h-100 p-4 p-lg-5 d-flex flex-column justify-content-between">
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.25rem' }}>For employees</h2>
                  <div className="d-flex flex-column gap-2 mb-4" style={{ color: '#6B6B6B', fontSize: '0.95rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> Register and sign in.
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> Upload documents with a category.
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> View or delete your own files.
                    </div>
                  </div>
                </div>
                <div>
                  <Link to="/register" className="btn-pill btn-pill-dark">
                    Get started
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="how-card h-100 p-4 p-lg-5 d-flex flex-column justify-content-between">
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.25rem' }}>For admins</h2>
                  <div className="d-flex flex-column gap-2 mb-4" style={{ color: '#6B6B6B', fontSize: '0.95rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> See every employee's documents.
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> Filter by category.
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <LuCheck color="#46B04A" size={18} /> Delete any document when needed.
                    </div>
                  </div>
                </div>
                <div>
                  <Link to="/login" className="btn-pill btn-pill-dark">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Black band */}
      <section className="black-band">
        <div className="landing-container">
          <h2 style={{ fontSize: '2.25rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Ready to organize your documents?
          </h2>
          <p style={{ color: '#9EA4AD', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
            Upload, categorize, and securely manage your company records with role-based access for your whole team.
          </p>
          <Link to="/register" className="btn-pill btn-pill-white">
            Get started
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="row g-4 mb-5">
            <div className="col-lg-5 col-md-12">
              <div className="d-flex align-items-center gap-2 text-white mb-3">
                <span className="logo-mark">D</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>DocuVault</span>
              </div>
              <p style={{ color: '#9EA4AD', fontSize: '0.9rem', maxWidth: '360px', lineHeight: '1.6', margin: 0 }}>
                A modern, lightweight document management platform for employees and administrators to securely archive official files.
              </p>
              <div className="d-flex align-items-center gap-3 mt-3" style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>
                <span>• Role-based Access</span>
                <span>• Multiple Uploads</span>
                <span>• Categorized Storage</span>
              </div>
            </div>

            <div className="col-6 col-lg-2 offset-lg-1 col-md-4">
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Product</div>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
                <a href="#features" className="text-decoration-none" style={{ color: '#9EA4AD' }}>Features</a>
                <a href="#how" className="text-decoration-none" style={{ color: '#9EA4AD' }}>How it works</a>
                <Link to="/upload" className="text-decoration-none" style={{ color: '#9EA4AD' }}>Upload Document</Link>
              </div>
            </div>

            <div className="col-6 col-lg-2 col-md-4">
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Account</div>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
                <Link to="/login" className="text-decoration-none" style={{ color: '#9EA4AD' }}>Login</Link>
                <Link to="/register" className="text-decoration-none" style={{ color: '#9EA4AD' }}>Get started</Link>
                <Link to="/dashboard" className="text-decoration-none" style={{ color: '#9EA4AD' }}>Dashboard</Link>
              </div>
            </div>

            <div className="col-12 col-lg-2 col-md-4">
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Categories</div>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.9rem', color: '#9EA4AD' }}>
                <span>• ID Proofs</span>
                <span>• Certificates</span>
                <span>• Other Records</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-4" style={{ borderTop: '1px solid #222222', fontSize: '0.85rem', color: '#6B6B6B', gap: '1rem' }}>
            <span>© 2026 DocuVault. All rights reserved.</span>
            <span>Document Management System • B.Tech Final Year Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
