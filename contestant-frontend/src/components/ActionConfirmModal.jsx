import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ActionConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  isDanger = false,
  onClose,
  onConfirm,
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          border: `1px solid ${isDanger ? 'var(--accent-danger)' : 'var(--border-medium)'}`,
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: isDanger ? 'rgba(255, 71, 87, 0.15)' : 'rgba(0, 210, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDanger ? 'var(--accent-danger)' : 'var(--accent-cyan)',
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-admin-secondary"
            style={{ padding: '0.55rem 1.25rem' }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={isDanger ? 'btn-admin-danger' : 'btn-admin-primary'}
            style={{ padding: '0.55rem 1.5rem' }}
          >
            {isLoading ? 'PROCESSING...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
