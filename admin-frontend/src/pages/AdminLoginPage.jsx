import React, { useState } from 'react';
import { adminApi } from '../services/api';
import { ShieldAlert, Key, AlertTriangle, UserCheck } from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide administrator username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await adminApi.login(username.trim(), password.trim());
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Administrator authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '460px',
        margin: '5rem auto',
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00D2FF 0%, #0077B6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#041017',
              marginBottom: '1rem',
              boxShadow: '0 0 24px rgba(0, 210, 255, 0.4)',
            }}
          >
            <ShieldAlert size={26} strokeWidth={2.5} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            ADMIN COMMAND CENTER
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            Authorized administrator credentials required
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.8rem 1rem',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              ADMINISTRATOR USERNAME <span style={{ color: '#00D2FF' }}>*</span>
            </label>
            <input
              type="text"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              ADMINISTRATOR PASSWORD <span style={{ color: '#00D2FF' }}>*</span>
            </label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-admin-primary"
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <UserCheck size={16} />
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'ACCESS COMMAND DASHBOARD'}</span>
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-glass)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          RESTRICTED ACCESS // ALL ATTEMPTS AUDITED IN SQLITE
        </div>
      </div>
    </div>
  );
}
