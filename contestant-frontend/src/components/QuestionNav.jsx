import React from 'react';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';

export default function QuestionNav({
  questions = [],
  currentIndex = 0,
  onSelectQuestion,
  answers = {}
}) {
  const total = 50;
  const completed = Object.keys(answers).length;
  const remaining = total - completed;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header & Stats */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            QUESTION NAVIGATOR
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-cyan)',
              background: 'rgba(0, 210, 255, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(0, 210, 255, 0.25)',
            }}
          >
            50 CHALLENGES
          </span>
        </div>

        {/* Progress statistics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: 'rgba(10, 15, 25, 0.7)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glass)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)' }}>COMPLETED</div>
            <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.95rem' }}>
              {completed} / {total}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>REMAINING</div>
            <div style={{ color: 'var(--accent-warning)', fontWeight: 700, fontSize: '0.95rem' }}>
              {remaining} / {total}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>TOTAL</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
              {total}
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            marginTop: '0.6rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(completed / total) * 100}%`,
              background: 'linear-gradient(90deg, #00D2FF 0%, #00F2A6 100%)',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* 50-Question Navigation Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.45rem',
          maxHeight: '440px',
          overflowY: 'auto',
          paddingRight: '0.25rem',
        }}
      >
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = q.question_number in answers;

          let btnBg = 'rgba(14, 20, 32, 0.7)';
          let btnBorder = 'rgba(255, 255, 255, 0.08)';
          let btnColor = 'var(--text-secondary)';

          if (isCurrent) {
            btnBg = 'rgba(0, 242, 166, 0.2)';
            btnBorder = 'var(--accent-emerald)';
            btnColor = 'var(--accent-emerald)';
          } else if (isAnswered) {
            btnBg = 'rgba(0, 210, 255, 0.15)';
            btnBorder = 'rgba(0, 210, 255, 0.4)';
            btnColor = 'var(--accent-cyan)';
          }

          return (
            <button
              key={q.question_number}
              onClick={() => onSelectQuestion(idx)}
              style={{
                background: btnBg,
                border: `1px solid ${btnBorder}`,
                color: btnColor,
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: isCurrent || isAnswered ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: isCurrent ? '0 0 10px rgba(0, 242, 166, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
              title={`Question ${idx + 1} (${q.section}) - ${isAnswered ? 'Answered: ' + answers[q.question_number] : 'Unanswered'}`}
            >
              <span>{String(idx + 1).padStart(2, '0')}</span>
              {isAnswered && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    color: isCurrent ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                    marginTop: '1px',
                  }}
                >
                  [{answers[q.question_number]}]
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-glass)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-emerald)' }} />
          Current
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-cyan)' }} />
          Answered
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
          Pending
        </span>
      </div>
    </div>
  );
}
