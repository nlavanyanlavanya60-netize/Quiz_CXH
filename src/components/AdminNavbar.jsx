import React from 'react';
import { ShieldAlert, LogOut, RefreshCw, UserCheck, Terminal } from 'lucide-react';

export default function AdminNavbar({ adminUsername, onLogout, onRefresh, isRefreshing }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(6, 8, 14, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00D2FF 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)',
            }}
          >
            <ShieldAlert size={22} color="#041017" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>CYBER_CTF</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '3px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                }}
              >
                ADMIN COMMAND
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
              CENTRAL COMPETITION CONTROLLER // CONFIDENTIAL
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-admin-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            title="Refresh competition telemetry"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'SYNCING...' : 'REFRESH DATA'}</span>
          </button>

          {adminUsername && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(14, 20, 32, 0.8)',
                border: '1px solid var(--border-glass)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
              }}
            >
              <UserCheck size={15} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-cyan)', fontWeight: 700 }}>
                {adminUsername}
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="btn-admin-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            title="Terminate administrator session"
          >
            <LogOut size={14} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
