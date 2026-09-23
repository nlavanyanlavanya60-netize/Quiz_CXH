import React from 'react';
import { Trophy, Medal, Clock, Award } from 'lucide-react';

export default function TopTeamsTable({ rankings = [] }) {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#FBBF24',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Trophy size={16} /> #1 GOLD
          </span>
        );
      case 2:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#E2E8F0',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Medal size={16} /> #2 SILVER
          </span>
        );
      case 3:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#F97316',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Medal size={16} /> #3 BRONZE
          </span>
        );
      default:
        return (
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            #{rank}
          </span>
        );
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Trophy size={20} color="#FBBF24" />
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            TOP 5 RANKING LEADERBOARD (TIEBREAKER: TIME)
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          CONFIDENTIAL ADMIN DATA
        </span>
      </div>

      {rankings.length === 0 ? (
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
          No teams have completed the quiz yet. Rankings will calculate automatically upon first submission.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Rank</th>
                <th>Team Name</th>
                <th>Contestants</th>
                <th style={{ textAlign: 'center' }}>Score / 100</th>
                <th style={{ textAlign: 'center' }}>Accuracy</th>
                <th>Duration</th>
                <th>Submission Time</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((team) => {
                const correct = team.correct_count || 0;
                const answered = 50 - (team.unanswered_count || 0);
                const subTime = team.quiz_submitted_at
                  ? new Date(team.quiz_submitted_at).toLocaleTimeString()
                  : '—';

                return (
                  <tr key={team.id}>
                    <td>{getRankBadge(team.rank)}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {team.team_name}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {team.member1_name}
                      {team.member2_name ? ` & ${team.member2_name}` : ''}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: team.score >= 70 ? 'var(--accent-emerald)' : 'var(--text-primary)',
                        }}
                      >
                        {team.score}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--accent-emerald)' }}>{correct}</span> / 50 correct
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDuration(team.duration_seconds)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {subTime}
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '3px',
                          textTransform: 'uppercase',
                          background: team.submission_reason === 'manual' ? 'rgba(0, 242, 166, 0.15)' : 'rgba(255, 71, 87, 0.15)',
                          color: team.submission_reason === 'manual' ? 'var(--accent-emerald)' : 'var(--accent-danger)',
                          border: `1px solid ${team.submission_reason === 'manual' ? 'rgba(0, 242, 166, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`,
                        }}
                      >
                        {team.submission_reason || 'MANUAL'}
                      </span>
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
