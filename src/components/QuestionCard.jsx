import React from 'react';
import { ChevronLeft, ChevronRight, Check, Send } from 'lucide-react';

export default function QuestionCard({
  question,
  displayIndex,
  totalQuestions = 50,
  selectedAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onSubmitClick,
  isSubmitting = false
}) {
  if (!question) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Loading challenge payload...
        </p>
      </div>
    );
  }

  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  const getTierBadge = (section) => {
    switch (section) {
      case 'Easy':
        return <span className="badge-tier-easy">TIER A // EASY (2 MARKS)</span>;
      case 'Medium':
        return <span className="badge-tier-medium">TIER B // MEDIUM (2 MARKS)</span>;
      case 'Hard':
        return <span className="badge-tier-hard">TIER C // HARD (2 MARKS)</span>;
      default:
        return <span className="badge-tier-easy">{section}</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--accent-emerald)',
              letterSpacing: '0.05em',
            }}
          >
            QUESTION {String(displayIndex + 1).padStart(2, '0')} / {totalQuestions}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>•</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            ID: Q{question.question_number}
          </span>
        </div>

        <div>{getTierBadge(question.section)}</div>
      </div>

      {/* Question Prompt */}
      <div style={{ minHeight: '80px' }}>
        <h2
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            lineHeight: 1.6,
            color: 'var(--text-primary)',
          }}
        >
          {question.question_text}
        </h2>
      </div>

      {/* 4 Choices Grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSelectAnswer(opt.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: isSelected ? 'rgba(0, 242, 166, 0.12)' : 'rgba(14, 20, 32, 0.65)',
                border: `1px solid ${isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: isSelected ? '0 0 14px rgba(0, 242, 166, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Option Key Badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#04100B' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.key}
              </div>

              {/* Option Text */}
              <div
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                  flexGrow: 1,
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {opt.text}
              </div>

              {/* Checkmark when selected */}
              {isSelected && (
                <div style={{ color: 'var(--accent-emerald)', flexShrink: 0 }}>
                  <Check size={18} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-glass)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="btn-cyber-secondary"
            style={{
              opacity: hasPrev ? 1 : 0.4,
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              padding: '0.65rem 1.25rem',
            }}
          >
            <ChevronLeft size={16} />
            <span>PREVIOUS</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="btn-cyber-secondary"
            style={{
              opacity: hasNext ? 1 : 0.4,
              cursor: hasNext ? 'pointer' : 'not-allowed',
              padding: '0.65rem 1.25rem',
            }}
          >
            <span>NEXT</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={onSubmitClick}
          disabled={isSubmitting}
          className="btn-cyber-primary"
          style={{
            padding: '0.65rem 1.5rem',
          }}
        >
          <Send size={15} />
          <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT QUIZ'}</span>
        </button>
      </div>
    </div>
  );
}
