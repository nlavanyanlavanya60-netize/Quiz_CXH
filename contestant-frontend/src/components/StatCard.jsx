import React from 'react';

export default function StatCard({ title, value, subtext, icon, accentColor = 'var(--accent-cyan)' }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${accentColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: `rgba(255, 255, 255, 0.05)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
