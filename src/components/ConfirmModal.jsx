import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  answeredCount = 0,
  totalQuestions = 50,
  isLoading = false
}) {
  if (!isOpen) return null;

  const unanswered = totalQuestions - answeredCount;

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2rem',
          position: 'relative',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 242, 166, 0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 165, 2, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-warning)',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              CONFIRM SUBMISSION
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Final Quiz Submission Protocol
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
          }}
        >
          Are you sure you want to submit your quiz? You will <strong style={{ color: '#FFFFFF' }}>not be able to change your answers</strong> after submission.
        </p>

        {/* Progress Summary Card */}
        <div
          style={{
            background: 'rgba(10, 15, 25, 0.8)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glass)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Answered Questions:</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {answeredCount} / {totalQuestions}
            </span>
          </div>

          {unanswered > 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--accent-warning)',
                fontWeight: 600,
              }}
            >
              <span>Unanswered Questions:</span>
              <span>{unanswered} remaining</span>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--accent-emerald)',
                fontSize: '0.8rem',
              }}
            >
              <CheckCircle size={14} />
              <span>All 50 questions answered!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-cyber-secondary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-cyber-primary"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {isLoading ? 'SUBMITTING...' : 'YES, SUBMIT QUIZ'}
          </button>
        </div>
      </div>
    </div>
  );
}
