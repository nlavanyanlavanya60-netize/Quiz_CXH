import React, { useState } from 'react';
import { api } from '../services/api';
import { Shield, Users, Lock, Key, Copy, Check, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const [teamName, setTeamName] = useState('');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [error, setError] = useState('');
  const [validationWarning, setValidationWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // One-time password modal state
  const [registeredData, setRegisteredData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Live client-side validation
  const handleTeamNameChange = (e) => {
    const val = e.target.value;
    setTeamName(val);

    if (val.includes(' ')) {
      setValidationWarning('Spaces are strictly forbidden in team names.');
    } else if (val && !/^[A-Za-z0-9!?@_]+$/.test(val)) {
      setValidationWarning('Disallowed character. Allowed: A-Z, a-z, 0-9, !, ?, @, _');
    } else {
      setValidationWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }
    if (teamName.includes(' ')) {
      setError('Team names cannot contain spaces.');
      return;
    }
    if (!/^[A-Za-z0-9!?@_]{1,30}$/.test(teamName)) {
      setError('Invalid team name. Only letters, numbers (0-9), !, ?, @, _ are allowed (max 30 chars).');
      return;
    }
    if (!member1.trim()) {
      setError('Member 1 name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await api.register(teamName.trim(), member1.trim(), member2.trim() || null);
      setRegisteredData(data);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check team name or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassword = () => {
    if (registeredData?.generated_password) {
      navigator.clipboard.writeText(registeredData.generated_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '2rem auto 5rem auto',
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
              background: 'linear-gradient(135deg, #00F2A6 0%, #00875A 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#04100B',
              marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(0, 242, 166, 0.3)',
            }}
          >
            <Shield size={24} strokeWidth={2.5} />
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
            TEAM REGISTRATION
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Register your team to receive your cryptographically generated password
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 71, 87, 0.12)',
              border: '1px solid var(--accent-danger)',
              borderRadius: 'var(--radius-sm)',
              color: '#FF6B81',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Team Name */}
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
              onChange={handleTeamNameChange}
              placeholder=""
              maxLength={30}
              required
            />
            {validationWarning && (
              <p style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                ⚠ {validationWarning}
              </p>
            )}
          </div>

          {/* Member 1 */}
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
              MEMBER 1 NAME <span style={{ color: 'var(--accent-emerald)' }}>*</span>
            </label>
            <input
              type="text"
              className="cyber-input"
              value={member1}
              onChange={(e) => setMember1(e.target.value)}
              placeholder=""
              maxLength={50}
              required
            />
          </div>

          {/* Member 2 */}
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
              MEMBER 2 NAME (OPTIONAL - MAX 2 MEMBERS)
            </label>
            <input
              type="text"
              className="cyber-input"
              value={member2}
              onChange={(e) => setMember2(e.target.value)}
              placeholder=""
              maxLength={50}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cyber-primary"
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <Key size={16} />
            <span>{isSubmitting ? 'GENERATING CREDENTIALS...' : 'REGISTER & GENERATE PASSWORD'}</span>
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
          Already have your team password?{' '}
          <button
            onClick={() => onNavigate('/login')}
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
            Login Here
          </button>
        </div>
      </div>

      {/* One-Time Generated Password Modal */}
      {registeredData && (
        <div className="modal-overlay">
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              border: '1px solid var(--accent-emerald)',
              boxShadow: '0 0 30px rgba(0, 242, 166, 0.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 166, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                marginBottom: '1rem',
              }}
            >
              <Check size={28} strokeWidth={3} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              CREDENTIALS GENERATED
            </h3>

            <p
              style={{
                color: 'var(--accent-warning)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                background: 'rgba(255, 165, 2, 0.1)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 165, 2, 0.25)',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              IMPORTANT: Save this password securely now! It was generated cryptographically and will NOT be displayed again.
            </p>

            {/* Team details */}
            <div
              style={{
                background: 'rgba(10, 15, 25, 0.9)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TEAM NAME:</span>
                <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 700 }}>
                  {registeredData.team_name}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>GENERATED PASSWORD:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-medium)',
                    marginTop: '0.25rem',
                  }}
                >
                  <code
                    style={{
                      color: 'var(--accent-emerald)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      userSelect: 'all',
                    }}
                  >
                    {registeredData.generated_password}
                  </code>
                  <button
                    onClick={handleCopyPassword}
                    className="btn-cyber-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    title="Copy password to clipboard"
                  >
                    {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/login')}
              className="btn-cyber-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>PROCEED TO CONTESTANT LOGIN</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
