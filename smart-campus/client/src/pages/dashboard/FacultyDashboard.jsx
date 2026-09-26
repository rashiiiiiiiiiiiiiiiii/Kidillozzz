import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeModal, setActiveModal] = useState(null); // 'rollcall', 'broadcast'
  const [sessionCode, setSessionCode] = useState('749201');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [petitions, setPetitions] = useState([
    {
      id: 'p1',
      student: 'Alex Rivera (STU-0421)',
      reason: 'Medical Leave - ACM Hackathon Participation',
      date: 'Sep 26 - Sep 28',
      course: 'CS-402 Distributed Systems',
    },
    {
      id: 'p2',
      student: 'Elena Rostov (STU-0899)',
      reason: 'Course Lab Exemption - IEEE Presentation',
      date: 'Oct 01',
      course: 'CS-408 Deep Learning Lab',
    },
  ]);

  function handleStartRollCall() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionCode(code);
    setActiveModal('rollcall');
    addToast(`Roll Call session started with code: ${code}`, 'success');
  }

  function handleBroadcast(e) {
    e.preventDefault();
    if (!broadcastSubject || !broadcastBody) return;
    addToast(`Broadcast "${broadcastSubject}" transmitted to enrolled scholars!`, 'success');
    setBroadcastSubject('');
    setBroadcastBody('');
    setActiveModal(null);
  }

  function handleApprovePetition(id, student) {
    setPetitions((prev) => prev.filter((p) => p.id !== id));
    addToast(`Petition approved for ${student}`, 'success');
  }

  function handleRejectPetition(id, student) {
    setPetitions((prev) => prev.filter((p) => p.id !== id));
    addToast(`Petition rejected for ${student}`, 'warning');
  }

  return (
    <div className="page-container fade-in">
      {/* ── Top Hero Banner ─────────────────────────────────── */}
      <div className="hero-banner">
        <div>
          <div className="hero-meta">
            <span>FACULTY INSTRUCTOR CONSOLE</span>
            <span>•</span>
            <span style={{ color: 'var(--color-yellow)', fontWeight: 800 }}>
              {user?.designation?.toUpperCase() || 'ASSOCIATE PROFESSOR'}
            </span>
          </div>

          <h1 className="hero-heading">
            Instructor Console: <span className="yellow">{user?.name || 'Faculty Member'}</span>
          </h1>

          <p className="hero-sub">
            {user?.department || 'Department of Computer Science & Engineering'} • Faculty ID #FAC-{user?.id?.slice(0, 8).toUpperCase() || '1042'}
          </p>
        </div>

        <div className="hero-actions">
          <button className="btn-primary" onClick={handleStartRollCall}>
            ⚡ Launch Live Roll Call
          </button>
          <button className="btn-secondary" onClick={() => setActiveModal('broadcast')}>
            📢 Broadcast Batch Notice
          </button>
        </div>
      </div>

      {/* ── Metric Stat Cards Row ──────────────────────────── */}
      <div className="bento-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: 'var(--color-yellow)' }}>184</div>
              <div className="stat-label">Scholars Taught</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Across 3 Cohorts
              </div>
            </div>
            <span className="badge badge-faculty">ACTIVE</span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value">89.6%</div>
              <div className="stat-label">Average Roll Call</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                ▲ +3.2% vs last term
              </div>
            </div>
            <span className="badge badge-success">OPTIMAL</span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: petitions.length > 0 ? 'var(--color-warning)' : 'inherit' }}>
                {petitions.length}
              </div>
              <div className="stat-label">Pending Petitions</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Requires Review
              </div>
            </div>
            <span className="badge badge-warning">ACTION</span>
          </div>
        </div>

        <div className="bento-col-3">
          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#10b981' }}>03:00 PM</div>
              <div className="stat-label">Office Hours Today</div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Cabin 304, East Wing
              </div>
            </div>
            <span className="badge badge-success">OPEN</span>
          </div>
        </div>
      </div>

      {/* ── Main Bento Grid ─────────────────────────────────── */}
      <div className="bento-grid">
        {/* Today's Lectures Schedule (Span 7) */}
        <div className="bento-col-7">
          <div className="bento-card bento-card-featured" style={{ height: '100%' }}>
            <div className="card-header-bar">
              <div className="card-title">
                <span>📋</span>
                <span>Today's Instructional Schedule</span>
              </div>
              <span className="badge badge-faculty">2 LECTURES REMAINING</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                {
                  code: 'CS-402',
                  course: 'Distributed Systems Architecture',
                  time: '10:00 - 11:30 AM',
                  hall: 'Auditorium 402',
                  enrolled: '62 Students',
                  status: 'NEXT SESSION',
                },
                {
                  code: 'CS-408',
                  course: 'Deep Learning & Neural Systems Lab',
                  time: '02:00 - 04:00 PM',
                  hall: 'AI Lab 3',
                  enrolled: '48 Students',
                  status: 'SCHEDULED',
                },
              ].map((lec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="badge badge-student">{lec.code}</span>
                      <span style={{ fontWeight: 800, color: '#ffffff' }}>{lec.course}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      🕒 {lec.time} • 📍 {lec.hall} • 👥 {lec.enrolled}
                    </div>
                  </div>

                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={handleStartRollCall}>
                    Launch Roll Call ⚡
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Petitions Queue (Span 5) */}
        <div className="bento-col-5">
          <div className="bento-card" style={{ height: '100%' }}>
            <div className="card-header-bar">
              <div className="card-title">
                <span>🛡️</span>
                <span>Student Leave & Waivers</span>
              </div>
              <span className="badge badge-warning">{petitions.length} PENDING</span>
            </div>

            {petitions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                ✓ All student petitions have been resolved.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {petitions.map((pet) => (
                  <div
                    key={pet.id}
                    style={{
                      padding: 'var(--space-3)',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '13px' }}>{pet.student}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-yellow)', fontFamily: 'var(--font-mono)' }}>
                        {pet.date}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {pet.reason}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      Module: {pet.course}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => handleApprovePetition(pet.id, pet.student)}
                      >
                        Approve ✓
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => handleRejectPetition(pet.id, pet.student)}
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Interactive Modals ──────────────────────────────── */}
      {/* 1. Live Roll Call Display Modal */}
      {activeModal === 'rollcall' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--font-size-md)', textTransform: 'uppercase' }}>
                ⚡ Live Roll Call Session Active
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-icon" style={{ width: 28, height: 28 }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                Project this dynamic pin on the lecture display. Students can enter this in their portal.
              </p>
              <div
                style={{
                  background: '#000000',
                  border: '2px solid var(--color-yellow)',
                  boxShadow: '0 0 30px rgba(254, 229, 0, 0.25)',
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  letterSpacing: '12px',
                  color: 'var(--color-yellow)',
                  display: 'inline-block',
                  margin: 'var(--space-2) auto var(--space-4)',
                }}
              >
                {sessionCode}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-success)' }}>
                ● 48 / 62 Students Verified (Real-Time GPS Check Validated)
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => setActiveModal(null)}>
                Conclude & Finalize Roll Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Broadcast Notice Modal */}
      {activeModal === 'broadcast' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--font-size-md)', textTransform: 'uppercase' }}>
                📢 Dispatch Batch Announcement
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-icon" style={{ width: 28, height: 28 }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleBroadcast}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="broadcast-subject">// Subject Line</label>
                  <input
                    id="broadcast-subject"
                    className="input-field"
                    placeholder="e.g. Lab 4 Assignment Deadline Extension"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="broadcast-body">// Announcement Message</label>
                  <textarea
                    id="broadcast-body"
                    className="input-field"
                    rows={4}
                    placeholder="Write detailed instructions or circular text..."
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Transmit Notice →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
