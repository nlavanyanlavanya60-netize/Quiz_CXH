import React from 'react';
import { CheckCircle, Clock, EyeOff, ShieldCheck, Home } from 'lucide-react';

export default function SubmittedPage({ submissionInfo, onNavigate }) {
  const reason = submissionInfo?.reason || 'manual';
  const customMessage = submissionInfo?.message;

  let title = 'QUIZ SUBMITTED';
  let message = 'Your answers have been submitted successfully.';
  let icon = <CheckCircle size={36} color="var(--accent-emerald)" />;
  let badgeColor = 'var(--accent-emerald)';

  if (reason === 'timeout') {
    title = 'TIME EXPIRED';
    message = 'Time expired. Your quiz has been automatically submitted.';
    icon = <Clock size={36} color="var(--accent-warning)" />;
    badgeColor = 'var(--accent-warning)';
  } else if (reason === 'visibility_change' || reason === 'window_blur') {
    title = 'AUTOMATIC SUBMISSION TRIGGERED';
    message = 'Your quiz was automatically submitted because the quiz window was left.';
    icon = <EyeOff size={36} color="var(--accent-danger)" />;
    badgeColor = 'var(--accent-danger)';
  }

  if (customMessage) {
    message = customMessage;
  }

  const nowString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '4rem auto 6rem auto',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          border: `1px solid ${badgeColor}`,
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {message}
        </p>

        {/* Verification Card */}
        <div
          style={{
            background: 'rgba(10, 15, 25, 0.85)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', marginBottom: '0.75rem', fontWeight: 700 }}>
            <ShieldCheck size={18} />
            <span>SUBMISSION PROTOCOL LOCKED</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>Status:</span>
            <span style={{ color: 'var(--text-primary)' }}>Recorded in SQLite Database</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>Submission Reason:</span>
            <span style={{ color: badgeColor, textTransform: 'uppercase' }}>{reason}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Timestamp:</span>
            <span style={{ color: 'var(--text-primary)' }}>{nowString} UTC</span>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '2rem',
          }}
        >
          In accordance with competition rules, participant scores and rankings remain confidential and will be compiled exclusively by the competition judges.
        </p>

        <button
          onClick={() => onNavigate('/')}
          className="btn-cyber-secondary"
          style={{ padding: '0.75rem 2rem' }}
        >
          <Home size={16} />
          <span>RETURN TO HOME</span>
        </button>
      </div>
    </div>
  );
}
