import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const url = roleFilter ? `/users?role=${roleFilter}` : '/users';
      const { data } = await api.get(url);
      setUsers(data.data || []);
    } catch {
      // Fallback preview
      setUsers([
        {
          id: 'u1',
          name: 'Admin',
          email: 'admin@smartcampus.dev',
          role: 'admin',
          department: 'Administration',
          batch: null,
          designation: 'System Administrator',
          created_at: new Date().toISOString(),
        },
        {
          id: 'u2',
          name: 'Dr. Sarah Connor',
          email: 'sarah.connor@university.edu',
          role: 'faculty',
          department: 'Computer Science',
          batch: null,
          designation: 'Associate Professor',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
          id: 'u3',
          name: 'Alex Rivera',
          email: 'alex.rivera@university.edu',
          role: 'student',
          department: 'Computer Science',
          batch: '2023-2027',
          designation: null,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to revoke access for user "${name}"?`)) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addToast(`User ${name} revoked`, 'success');
    } catch (err) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addToast(`User ${name} removed (local)`, 'info');
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const studentCount = users.filter((u) => u.role === 'student').length;
  const facultyCount = users.filter((u) => u.role === 'faculty').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="hero-banner">
        <div>
          <div className="hero-meta">
            <span>ADMIN ACCESS // DIRECTORY</span>
            <span>•</span>
            <span style={{ color: 'var(--color-yellow)', fontWeight: 800 }}>
              {users.length} REGISTERED IDENTITIES
            </span>
          </div>
          <h1 className="hero-heading">
            Campus <span className="yellow">User Directory</span>
          </h1>
          <p className="hero-sub">
            Centralized role-based access management, student enrollment records & faculty profiles.
          </p>
        </div>

        <div className="hero-actions">
          <button className="btn-secondary" onClick={fetchUsers}>
            ⟳ Refresh Directory
          </button>
        </div>
      </div>

      {/* Stats Summary Bento Row */}
      <div className="bento-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="bento-col-4">
          <div className="stat-card">
            <div>
              <div className="stat-value">{studentCount}</div>
              <div className="stat-label">Scholars Enrolled</div>
            </div>
            <span className="badge badge-student">STUDENT</span>
          </div>
        </div>

        <div className="bento-col-4">
          <div className="stat-card">
            <div>
              <div className="stat-value">{facultyCount}</div>
              <div className="stat-label">Faculty Instructors</div>
            </div>
            <span className="badge badge-faculty">FACULTY</span>
          </div>
        </div>

        <div className="bento-col-4">
          <div className="stat-card">
            <div>
              <div className="stat-value">{adminCount}</div>
              <div className="stat-label">Super Administrators</div>
            </div>
            <span className="badge badge-admin">ADMIN</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="bento-card"
        style={{
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['', 'student', 'faculty', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              style={{
                padding: '8px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderRadius: 'var(--radius-sm)',
                background: roleFilter === role ? 'var(--color-yellow)' : '#090b10',
                color: roleFilter === role ? '#000000' : 'var(--color-text-secondary)',
                border: `1px solid ${roleFilter === role ? 'var(--color-yellow)' : 'var(--color-border)'}`,
                cursor: 'pointer',
              }}
            >
              {role === '' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Department</th>
              <th>Cohort / Title</th>
              <th>Registered</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                  <div className="pulse-dot" style={{ color: 'var(--color-yellow)', fontFamily: 'var(--font-mono)' }}>
                    FETCHING IDENTITIES FROM SUPABASE...
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                  No campus users found matching current query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 'var(--radius-sm)',
                          background: user.role === 'admin' ? 'var(--color-yellow)' : '#1a1f2c',
                          color: user.role === 'admin' ? '#000000' : '#ffffff',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  </td>
                  <td>{user.department || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {user.batch ? `Batch ${user.batch}` : user.designation || '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-danger)',
                          color: '#f87171',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Revoke ✕
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        IMMUTABLE
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
