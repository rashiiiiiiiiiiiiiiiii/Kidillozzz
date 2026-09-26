import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Verify credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  function fillAdminDemo() {
    setEmail('admin@smartcampus.dev');
    setPassword('admin123');
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass fade-in">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 800,
              background: '#000000',
              color: 'var(--color-yellow)',
              padding: '3px 10px',
              border: '1.5px solid var(--color-yellow)',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.1em',
            }}
          >
            PORTAL ACCESS // SECURE
          </span>
        </div>

        <h1 style={{ marginTop: 'var(--space-4)' }}>
          Welcome <span>Back</span>
        </h1>
        <p className="subtitle">Sign in to your Smart Campus workspace</p>

        {/* Demo Fast-Fill Pill */}
        <div
          onClick={fillAdminDemo}
          style={{
            background: '#18181b',
            border: '1.5px dashed var(--color-yellow)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-yellow)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-yellow)';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#18181b';
            e.currentTarget.style.color = 'var(--color-yellow)';
          }}
          title="Click to auto-populate default admin credentials"
        >
          <span>⚡ AUTOFILL ADMIN DEMO</span>
          <span style={{ fontWeight: 800 }}>CLICK HERE ↵</span>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">// User Identifier (Email)</label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="e.g. admin@smartcampus.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">// Password</label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'AUTHENTICATING...' : 'AUTHORIZE & ENTER →'}
          </button>
        </form>

        <div className="auth-footer">
          NEW USER? <Link to="/register" style={{ fontWeight: 800 }}>CREATE ACCOUNT NOW ↗</Link>
        </div>
      </div>
    </div>
  );
}
