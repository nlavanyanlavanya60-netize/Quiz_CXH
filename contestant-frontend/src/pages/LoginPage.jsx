import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, Shield, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!teamName.trim() || !password.trim()) {
      setError('Please provide both team name and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await api.login(teamName.trim(), password.trim());
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '3rem auto 5rem auto',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border-medium)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00D2FF 0%, #0077B6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#04100B',
              marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
            }}
          >
            <Lock size={24} strokeWidth={2.5} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            CONTESTANT LOGIN
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Authenticate with your registered team name and password
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.85rem 1rem',
              background: 'rgba(255, 71, 87, 0.12)',
              border: '1px solid var(--accent-danger)',
              borderRadius: 'var(--radius-sm)',
              color: '#FF6B81',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.4,
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              TEAM NAME <span style={{ color: 'var(--accent-emerald)' }}>*</span>
            </label>
            <input
              type="text"
              className="cyber-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder=""
              required
              autoFocus
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              GENERATED PASSWORD <span style={{ color: 'var(--accent-emerald)' }}>*</span>
            </label>
            <input
              type="password"
              className="cyber-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cyber-primary"
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <UserCheck size={16} />
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'ENTER COMPETITION'}</span>
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-glass)',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          Need to register a new team?{' '}
          <button
            onClick={() => onNavigate('/register')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-emerald)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}
