import React, { useState } from 'react';
import { Award, Search, FileText } from 'lucide-react';

export default function ResultsTable({ results = [] }) {
  const [search, setSearch] = useState('');

  const filtered = results.filter((r) =>
    r.team_name.toLowerCase().includes(search.toLowerCase()) ||
    r.member1_name.toLowerCase().includes(search.toLowerCase()) ||
    (r.member2_name && r.member2_name.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Search */}
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
          <Award size={20} color="var(--accent-emerald)" />
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            MASTER RESULTS &amp; OFFICIAL SCORING AUDIT ({results.length} COMPLETED)
          </h3>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search teams in results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          No completed quiz submissions available for audit.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Rank</th>
                <th>Team Name</th>
                <th>Contestants</th>
                <th style={{ textAlign: 'center' }}>Score / 100</th>
                <th style={{ textAlign: 'center' }}>Correct</th>
                <th style={{ textAlign: 'center' }}>Wrong</th>
                <th style={{ textAlign: 'center' }}>Blank</th>
                <th>Duration</th>
                <th>Submission Time</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    #{r.rank}
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {r.team_name}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div>{r.member1_name}</div>
                    {r.member2_name && <div style={{ color: 'var(--text-muted)' }}>{r.member2_name}</div>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: r.score >= 70 ? 'var(--accent-emerald)' : 'var(--text-primary)',
                      }}
                    >
                      {r.score}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    {r.correct_count}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--accent-danger)' }}>
                    {r.wrong_count}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {r.unanswered_count}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDuration(r.duration_seconds)}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {r.quiz_submitted_at ? new Date(r.quiz_submitted_at).toLocaleTimeString() : '—'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        background:
                          r.submission_reason === 'manual'
                            ? 'rgba(0, 242, 166, 0.12)'
                            : r.submission_reason === 'timeout'
                            ? 'rgba(255, 165, 2, 0.12)'
                            : 'rgba(255, 71, 87, 0.12)',
                        color:
                          r.submission_reason === 'manual'
                            ? 'var(--accent-emerald)'
                            : r.submission_reason === 'timeout'
                            ? 'var(--accent-warning)'
                            : 'var(--accent-danger)',
                        border: `1px solid ${
                          r.submission_reason === 'manual'
                            ? 'rgba(0, 242, 166, 0.3)'
                            : r.submission_reason === 'timeout'
                            ? 'rgba(255, 165, 2, 0.3)'
                            : 'rgba(255, 71, 87, 0.3)'
                        }`,
                      }}
                    >
                      {r.submission_reason || 'MANUAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
