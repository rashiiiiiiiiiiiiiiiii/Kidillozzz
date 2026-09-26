import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div
        className="glass fade-in"
        style={{
          padding: 'var(--space-10)',
          textAlign: 'center',
          maxWidth: 480,
          border: '3px solid var(--color-border)',
          boxShadow: '8px 8px 0px var(--color-yellow)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)' }}>⚠️</div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--color-yellow)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '0.1em',
          }}
        >
          // ERROR 404: RESOURCE_UNAVAILABLE
        </div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)', textTransform: 'uppercase' }}>
          ROUTE <span style={{ color: 'var(--color-yellow)' }}>NOT FOUND</span>
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--space-8)',
          }}
        >
          The requested coordinate does not exist in the Smart Campus schema.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ width: '100%' }}>
          RETURN TO COMMAND CENTER →
        </Link>
      </div>
    </div>
  );
}
