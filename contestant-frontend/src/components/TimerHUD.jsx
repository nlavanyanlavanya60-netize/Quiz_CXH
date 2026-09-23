import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimerHUD({ initialSeconds = 1800, onTimeout }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeout) onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeout) onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeout]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = Math.floor(secondsLeft % 60);
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Color dynamics
  const isCritical = secondsLeft <= 120; // under 2 mins
  const isWarning = secondsLeft > 120 && secondsLeft <= 300; // 2 to 5 mins

  const timerColor = isCritical
    ? 'var(--accent-danger)'
    : isWarning
    ? 'var(--accent-warning)'
    : 'var(--accent-emerald)';

  const percentage = Math.max(0, Math.min(100, (secondsLeft / 1800) * 100));

  return (
    <div
      className="glass-card"
      style={{
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: `1px solid ${timerColor}`,
        boxShadow: isCritical ? '0 0 16px rgba(255, 71, 87, 0.35)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: `rgba(${isCritical ? '255, 71, 87' : isWarning ? '255, 165, 2' : '0, 242, 166'}, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: timerColor,
        }}
      >
        {isCritical ? <AlertTriangle size={20} /> : <Clock size={20} />}
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: timerColor,
              letterSpacing: '0.05em',
            }}
          >
            {formattedTime}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            REMAINING
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '120px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            marginTop: '0.2rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: timerColor,
              borderRadius: '2px',
              transition: 'width 1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
