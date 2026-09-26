import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'checkin', 'grievance', 'idcard'
  const [checkinCode, setCheckinCode] = useState('');
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceCategory, setGrievanceCategory] = useState('academic');

  function handleCheckinSubmit(e) {
    e.preventDefault();
    if (!checkinCode) return;
    addToast(`Roll Call Verified! Attendance marked for session code: ${checkinCode}`, 'success');
    setCheckinCode('');
    setActiveModal(null);
  }

  function handleGrievanceSubmit(e) {
    e.preventDefault();
    if (!grievanceText) return;
    addToast('Grievance ticket #GR-' + Math.floor(1000 + Math.random() * 9000) + ' dispatched to Dean Office', 'info');
    setGrievanceText('');
    setActiveModal(null);
  }

  return (
    <div className="page-container fade-in">
      {/* ── Top Hero Banner ─────────────────────────────────── */}
      <div className="hero-banner">
        <div>
          <div className="hero-meta">
            <span>DIGITAL SCHOLAR WORKSPACE</span>
            <span>•</span>
            <span>SEMESTER 06</span>
            <span>•</span>
            <span style={{ color: 'var(--color-yellow)', fontWeight: 800 }}>
              BATCH {user?.batch || '2023-2027'}
            </span>
          </div>

          <h1 className="hero-heading">
            Welcome, <span className="yellow">{user?.name || 'Scholar'}</span>
          </h1>

          <p className="hero-sub">
            {user?.department || 'Department of Computer Science & Engineering'} • Student ID #STU-{user?.id?.slice(0, 8).toUpperCase() || '8841'}
          </p>
        </div>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setActiveModal('checkin')}>
            ⚡ Check-In Roll Call
          </button>
          <button className="btn-secondary" onClick={() => setActiveModal('idcard')}>
            💳 Digital ID
          </button>
          <button className="btn-ghost" onClick={() => setActiveModal('grievance')}>
            📝 File Grievance
          </button>
        </div>
      </div>

      {/* ── Metric Stat Cards Row ──────────────────────────── */}
      <div className="bento-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: 'var(--color-yellow)' }}>88.4%</div>
              <div className="stat-label">Term Attendance</div>
              <div style={{ marginTop: '6px', height: '4px', background: '#1e2433', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '88.4%', height: '100%', background: 'var(--color-yellow)' }}></div>
              </div>
            </div>
            <span className="badge badge-success">SAFE</span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value">3.84</div>
              <div className="stat-label">Cumulative CGPA</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                ▲ Top 5% of Cohort
              </div>
            </div>
            <span className="badge" style={{ background: '#1c1917', color: '#f59e0b', borderColor: '#f59e0b' }}>
              DISTINCTION
            </span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value">24 / 24</div>
              <div className="stat-label">Registered Credits</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                6 Active Modules
              </div>
            </div>
            <span className="badge badge-student">REGULAR</span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>0</div>
              <div className="stat-label">Disciplinary Holds</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                ● Good Standing
              </div>
            </div>
            <span className="badge badge-success">CLEARED</span>
          </div>
        </div>
      </div>

      {/* ── Main Bento Grid Layout ─────────────────────────── */}
      <div className="bento-grid">
        {/* Asymmetric Featured Schedule Card (Span 8) */}
        <div className="bento-col-8">
          <div className="bento-card bento-card-featured" style={{ height: '100%' }}>
            <div className="card-header-bar">
              <div className="card-title">
                <span>📅</span>
                <span>Today's Academic Schedule <span className="accent">// LIVE TIMETABLE</span></span>
              </div>
              <span className="badge badge-faculty">TODAY: FRIDAY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {[
                {
                  code: 'CS-402',
                  name: 'Distributed Systems & Cloud Computing',
                  time: '09:00 - 10:30 AM',
                  venue: 'Hall 402 (East Wing)',
                  faculty: 'Dr. Sarah Connor',
                  status: 'IN PROGRESS',
                  active: true,
                },
                {
                  code: 'CS-408',
                  name: 'Neural Networks & Deep Learning Lab',
                  time: '11:00 - 01:00 PM',
                  venue: 'Advanced AI Research Lab 3',
                  faculty: 'Prof. Marcus Vance',
                  status: 'UPCOMING',
                  active: false,
                },
                {
                  code: 'HUM-301',
                  name: 'Technology Ethics & Intellectual Property',
                  time: '02:30 - 04:00 PM',
                  venue: 'Seminar Auditorium B',
                  faculty: 'Dean R. Vasquez',
                  status: 'UPCOMING',
                  active: false,
                },
              ].map((lecture, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-4)',
                    background: lecture.active ? 'rgba(254, 229, 0, 0.05)' : 'var(--color-surface-2)',
                    border: `1px solid ${lecture.active ? 'var(--color-yellow)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        padding: '6px 10px',
                        background: '#090b10',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: lecture.active ? 'var(--color-yellow)' : '#cbd5e1',
                      }}
                    >
                      {lecture.code}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 'var(--font-size-sm)' }}>
                        {lecture.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        📍 {lecture.venue} • 👤 {lecture.faculty}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {lecture.time}
                    </span>

                    <span
                      className={`badge ${lecture.active ? 'badge-faculty' : 'badge-student'}`}
                    >
                      {lecture.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supporting Card: Campus Events & Innovation (Span 4) */}
        <div className="bento-col-4">
          <div className="bento-card" style={{ height: '100%' }}>
            <div className="card-header-bar">
              <div className="card-title">
                <span>🚀</span>
                <span>Campus Events & Sprints</span>
              </div>
              <span className="badge" style={{ background: '#082f49', color: '#38bdf8', borderColor: '#0284c7' }}>
                HAPPENING
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                {
                  title: 'IEDC Smart Campus Hackathon 2026',
                  date: 'Tomorrow, 09:00 AM',
                  type: 'INNOVATION',
                  prize: '$5,000 Pool',
                },
                {
                  title: 'Guest Lecture: Quantum Key Distribution',
                  date: 'Sep 28 • Aud-A',
                  type: 'RESEARCH',
                  prize: 'Open Entry',
                },
                {
                  title: 'ACM Coding Championship Round 1',
                  date: 'Oct 02 • Online',
                  type: 'CONTEST',
                  prize: 'Certificates',
                },
              ].map((ev, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-3)',
                    background: '#090c12',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-yellow)', fontWeight: 800 }}>
                      [{ev.type}]
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {ev.date}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>
                    🏆 {ev.prize}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
              <button
                className="btn-secondary"
                style={{ width: '100%', fontSize: '12px' }}
                onClick={() => addToast('Opening Campus Calendar & Event Registrations...', 'info')}
              >
                Browse All Campus Events →
              </button>
            </div>
          </div>
        </div>

        {/* Course Modules Grid (Span 12) */}
        <div className="bento-col-12">
          <div className="bento-card">
            <div className="card-header-bar">
              <div className="card-title">
                <span>📚</span>
                <span>Active Course Modules & Syllabus Progress</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-yellow)' }}>
                6 / 6 REGISTERED COURSES
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {[
                { code: 'CS-401', name: 'Advanced Algorithms', attendance: '92%', progress: 75, tag: 'CORE' },
                { code: 'CS-402', name: 'Distributed Systems', attendance: '88%', progress: 68, tag: 'CORE' },
                { code: 'CS-403', name: 'Full-Stack Web Architectures', attendance: '95%', progress: 85, tag: 'ELECTIVE' },
                { code: 'CS-408', name: 'Deep Learning & Vision', attendance: '84%', progress: 60, tag: 'LAB' },
              ].map((c) => (
                <div
                  key={c.code}
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-yellow)', fontWeight: 800 }}>
                      {c.code}
                    </span>
                    <span className="badge badge-student">{c.tag}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 'var(--font-size-sm)', minHeight: '38px' }}>
                    {c.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                    <span>Syllabus: {c.progress}%</span>
                    <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>Roll: {c.attendance}</span>
                  </div>
                  <div style={{ height: '4px', background: '#090b10', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--color-yellow)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Modals ──────────────────────────────── */}
      {/* 1. Roll Call Check-in Modal */}
      {activeModal === 'checkin' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--font-size-md)', textTransform: 'uppercase' }}>
                ⚡ Roll Call Session Check-In
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-icon" style={{ width: 28, height: 28 }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCheckinSubmit}>
              <div className="modal-body">
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                  Enter the 6-digit dynamic session code displayed on your lecture screen or projector.
                </p>
                <div className="form-group">
                  <label htmlFor="session-code">// Session Authentication Pin</label>
                  <input
                    id="session-code"
                    type="text"
                    className="input-field"
                    placeholder="e.g. 849201"
                    maxLength={6}
                    value={checkinCode}
                    onChange={(e) => setCheckinCode(e.target.value)}
                    required
                    autoFocus
                    style={{ fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center' }}
                  />
                </div>
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(254, 229, 0, 0.08)',
                    border: '1px solid var(--color-yellow)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-yellow)',
                  }}
                >
                  📍 Geofence GPS Active: Campus Hall 402 within range (12m).
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Verify & Log Attendance ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. File Grievance Modal */}
      {activeModal === 'grievance' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--font-size-md)', textTransform: 'uppercase' }}>
                📝 File Campus Grievance or Petition
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-icon" style={{ width: 28, height: 28 }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleGrievanceSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>// Department Category</label>
                  <select
                    className="input-field"
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                  >
                    <option value="academic">Academic & Examinations Desk</option>
                    <option value="hostel">Hostel & Housing Infrastructure</option>
                    <option value="finance">Accounts & Scholarship Cell</option>
                    <option value="library">Library & Digital Lab Access</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="grievance-details">// Statement of Grievance</label>
                  <textarea
                    id="grievance-details"
                    className="input-field"
                    rows={4}
                    placeholder="Describe the issue, location, or request with relevant details..."
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Discard
                </button>
                <button type="submit" className="btn-primary">
                  Transmit to Dean Desk →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Digital Student ID Card Modal */}
      {activeModal === 'idcard' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--font-size-md)', textTransform: 'uppercase' }}>
                💳 Smart Campus Digital Credential
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-icon" style={{ width: 28, height: 28 }}>
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #181d28 0%, #0a0d14 100%)',
                  border: '2px solid var(--color-yellow)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(254, 229, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-4)',
                    paddingBottom: 'var(--space-2)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-yellow)' }}>
                    SMART CAMPUS IDENTITY
                  </span>
                  <span className="badge badge-student">VALID 2026-27</span>
                </div>

                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-yellow)',
                    color: '#000000',
                    fontSize: '2rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-4)',
                    border: '2px solid #000000',
                    boxShadow: '3px 3px 0px #ffffff',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>

                <h3 style={{ fontSize: 'var(--font-size-xl)', color: '#ffffff', textTransform: 'uppercase' }}>
                  {user?.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-yellow)', marginTop: '2px' }}>
                  ID: #SC-{user?.id?.slice(0, 8).toUpperCase() || 'STU-9921'}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {user?.department || 'Computer Science & Engineering'} • Batch {user?.batch || '2023-2027'}
                </p>

                {/* Simulated Barcode */}
                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    padding: '8px',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    letterSpacing: '5px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#000000',
                    fontWeight: 900,
                  }}
                >
                  ||| | |||| | ||||| || |||||| | ||
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => addToast('Digital ID credentials verified with NFC scanner', 'success')}>
                Scan NFC Token ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
