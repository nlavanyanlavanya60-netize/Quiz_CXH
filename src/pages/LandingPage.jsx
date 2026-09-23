import React from 'react';
import { Shield, Clock, EyeOff, Zap, Lock, Award, CheckCircle, Terminal, ArrowRight } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '4rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            background: 'rgba(0, 242, 166, 0.1)',
            border: '1px solid rgba(0, 242, 166, 0.3)',
            color: 'var(--accent-emerald)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            letterSpacing: '0.08em',
          }}
        >
          <Terminal size={14} />
          <span>CYBERSECURITY CTF QUIZ COMPETITION 2026</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(180deg, #FFFFFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TEST YOUR OFFENSIVE &amp; DEFENSIVE CYBERSECURITY SKILLS
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}
        >
          Compete in a 50-challenge server-timed Capture The Flag quiz covering Web Exploitation, Cryptography, Binary Analysis, Forensics, and Smart Contract Security.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => onNavigate('/register')}
            className="btn-cyber-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            <span>REGISTER TEAM</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className="btn-cyber-secondary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            <Lock size={16} />
            <span>CONTESTANT LOGIN</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: Structure & Rules */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        {/* Card 1: Structure */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 242, 166, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)',
              marginBottom: '1.25rem',
            }}
          >
            <Award size={24} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            50 CHALLENGES // 100 MARKS
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            Authoritative 3-tier difficulty distribution designed by cybersecurity specialists:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(0, 242, 166, 0.08)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>TIER A: Q01 - Q15 (Easy)</span>
              <span>15 Qs • 30 Marks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(0, 210, 255, 0.08)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>TIER B: Q16 - Q30 (Medium)</span>
              <span>15 Qs • 30 Marks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255, 71, 87, 0.08)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--accent-danger)' }}>TIER C: Q31 - Q50 (Hard)</span>
              <span>20 Qs • 40 Marks</span>
            </div>
          </div>
        </div>

        {/* Card 2: Server Authoritative Timer */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 210, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: '1.25rem',
            }}
          >
            <Clock size={24} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            30-MINUTE SERVER TIMER
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            The quiz timer is strictly controlled server-side. Refreshing, closing, or reopening the browser does not reset or pause your time.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-emerald)" />
              Automatic timeout submission at 00:00
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-emerald)" />
              Immediate answer synchronization on every click
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-emerald)" />
              Unique server-randomized question order per team
            </li>
          </ul>
        </div>

        {/* Card 3: Anti-Cheat & Visibility Protection */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 71, 87, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-danger)',
              marginBottom: '1.25rem',
            }}
          >
            <EyeOff size={24} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            WINDOW VISIBILITY PROTECTION
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            The platform monitors window focus and tab visibility. Leaving the active quiz window triggers an automatic submission lock.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={15} color="var(--accent-warning)" />
              Auto-submission on tab switch or window minimize
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={15} color="var(--accent-warning)" />
              Single active session enforced per team
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={15} color="var(--accent-warning)" />
              Strictly confidential post-submission evaluation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
