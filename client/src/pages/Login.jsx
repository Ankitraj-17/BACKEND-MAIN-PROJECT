import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthTopBar from '../components/AuthTopBar';

// Login page with light theme
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle credentials submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-light">
      <AuthTopBar rightText="Don't have an account?" linkText="Sign up" linkTo="/register" />

      <div className="auth-card-light">
        <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 600, marginBottom: '2rem' }}>
          Welcome back
        </h1>

        <form onSubmit={handleSubmit}>
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
              className="auth-input-light"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button
            type="submit"
            className="auth-pill-btn"
            disabled={submitting || !email || !password}
          >
            {submitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/register" style={{ color: '#111111', fontSize: '0.9rem', textDecoration: 'underline' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
