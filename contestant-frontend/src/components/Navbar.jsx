import React from 'react';
import { Shield, Lock, Users, LogOut, Terminal } from 'lucide-react';

export default function Navbar({ session, onLogout, currentRoute, onNavigate }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(8, 10, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => onNavigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00F2A6 0%, #00875A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 242, 166, 0.35)',
            }}
          >
            <Shield size={20} color="#04100B" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>CYBER_CTF</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px',
                  background: 'rgba(0, 242, 166, 0.15)',
                  color: 'var(--accent-emerald)',
                  border: '1px solid rgba(0, 242, 166, 0.3)',
                }}
              >
                PROD-2026
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              OFFICIAL CONTESTANT PORTAL
            </div>
          </div>
        </div>

        {/* Center/Right Nav Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {session?.authenticated ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 24, 38, 0.75)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              >
                <Terminal size={15} color="var(--accent-emerald)" />
                <span style={{ color: 'var(--text-secondary)' }}>TEAM:</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  {session.team_name}
                </span>
              </div>

              {session.member1_name && (
                <div
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                  className="hidden md:flex"
                >
                  <Users size={14} />
                  <span>{session.member1_name}</span>
                  {session.member2_name && <span>& {session.member2_name}</span>}
                </div>
              )}

              <button
                onClick={onLogout}
                className="btn-cyber-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                title="Log out of session"
              >
                <LogOut size={14} />
                <span>LOGOUT</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => onNavigate('/register')}
                className="btn-cyber-secondary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  borderColor: currentRoute === '/register' ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                  color: currentRoute === '/register' ? 'var(--accent-emerald)' : 'var(--text-primary)',
                }}
              >
                REGISTER
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="btn-cyber-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}
              >
                <Lock size={13} />
                LOGIN
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
