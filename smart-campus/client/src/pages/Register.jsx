import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    batch: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
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
            NEW ENROLLMENT // REGISTRATION
          </span>
        </div>

        <h1 style={{ marginTop: 'var(--space-4)' }}>
          Create <span>Account</span>
        </h1>
        <p className="subtitle">Join the Smart Campus Ecosystem</p>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">// Full Legal Name</label>
            <input
              id="reg-name"
              name="name"
              className="input-field"
              placeholder="e.g. Alex Morgan"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">// Academic Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="input-field"
              placeholder="alex@university.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">// Access Password (Min 6 chars)</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="input-field"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-role">// Account Privilege Level</label>
            <select
              id="reg-role"
              name="role"
              className="input-field"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student (Scholar)</option>
              <option value="faculty">Faculty (Professor / Instructor)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reg-department">// Department / Faculty</label>
            <input
              id="reg-department"
              name="department"
              className="input-field"
              placeholder="Computer Science & Engineering"
              value={form.department}
              onChange={handleChange}
            />
          </div>

          {form.role === 'student' && (
            <div className="form-group">
              <label htmlFor="reg-batch">// Academic Cohort / Batch</label>
              <input
                id="reg-batch"
                name="batch"
                className="input-field"
                placeholder="2023-2027"
                value={form.batch}
                onChange={handleChange}
              />
            </div>
          )}

          {form.role === 'faculty' && (
            <div className="form-group">
              <label htmlFor="reg-designation">// Academic Designation</label>
              <input
                id="reg-designation"
                name="designation"
                className="input-field"
                placeholder="Associate Professor"
                value={form.designation}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'PROCESSING ENROLLMENT...' : 'ENROLL IDENTITY →'}
          </button>
        </form>

        <div className="auth-footer">
          EXISTING CREDENTIALS? <Link to="/login" style={{ fontWeight: 800 }}>SIGN IN ↵</Link>
        </div>
      </div>
    </div>
  );
}
