import React, { useState } from 'react';
import { Shield, Users, Radio, Power, RotateCcw, CheckCircle, Clock } from 'lucide-react';

export default function TeamsTable({
  teams = [],
  onTerminateSession,
  onAuthorizeLogin
}) {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = teams.filter((t) =>
    t.team_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.member1_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (t.member2_name && t.member2_name.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users size={20} color="var(--accent-cyan)" />
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            REGISTERED TEAMS &amp; ACTIVE SESSION CONTROLLER
          </h3>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search teams or members..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            background: 'rgba(8, 12, 20, 0.5)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          No registered teams match the current query.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Team Name</th>
                <th>Members</th>
                <th>Registered At</th>
                <th>Session State</th>
                <th>Quiz Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const hasActive = t.has_active_session === 1;
                const isSubmitted = Boolean(t.quiz_submitted_at);
                const isStarted = Boolean(t.quiz_started_at) && !isSubmitted;

                return (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      #{t.id}
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {t.team_name}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div>{t.member1_name}</div>
                      {t.member2_name && <div style={{ color: 'var(--text-muted)' }}>{t.member2_name}</div>}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(t.registered_at).toLocaleString()}
                    </td>
                    <td>
                      {hasActive ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(0, 242, 166, 0.15)',
                            color: 'var(--accent-emerald)',
                            border: '1px solid rgba(0, 242, 166, 0.3)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          <Radio size={12} className="animate-pulse" />
                          LOGGED IN
                        </span>
                      ) : (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                          }}
                        >
                          OFFLINE
                        </span>
                      )}
                    </td>
                    <td>
                      {isSubmitted ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--accent-emerald)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle size={14} /> SUBMITTED ({t.submission_reason || 'manual'})
                        </span>
                      ) : isStarted ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--accent-warning)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          <Clock size={14} /> IN PROGRESS
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                          NOT STARTED
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {hasActive && (
                          <button
                            onClick={() => onTerminateSession(t.id, t.team_name)}
                            className="btn-admin-danger"
                            title="Force terminate active session"
                          >
                            <Power size={13} />
                            <span>TERMINATE</span>
                          </button>
                        )}

                        <button
                          onClick={() => onAuthorizeLogin(t.id, t.team_name, false)}
                          className="btn-admin-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          title="Authorize team to log in again"
                        >
                          <span>ALLOW LOGIN</span>
                        </button>

                        <button
                          onClick={() => onAuthorizeLogin(t.id, t.team_name, true)}
                          className="btn-admin-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--accent-warning)', borderColor: 'rgba(255, 165, 2, 0.3)' }}
                          title="Reset quiz attempt and clear previous answers"
                        >
                          <RotateCcw size={12} />
                          <span>RESET QUIZ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
