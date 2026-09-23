import React, { useState, useEffect } from 'react';
import { adminApi, adminTokenStorage } from './services/api';
import LiveWallpaper from './components/LiveWallpaper';
import AdminNavbar from './components/AdminNavbar';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await adminApi.getSession();
      setSession(data);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSuccess = async () => {
    await checkAuth();
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (err) {
      console.error(err);
    }
    setSession(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Continuous Live Wallpaper Background */}
      <LiveWallpaper />

      {/* 2. Top Navigation */}
      {session?.authenticated && (
        <AdminNavbar
          adminUsername={session.username}
          onLogout={handleLogout}
          onRefresh={() => window.location.reload()}
          isRefreshing={false}
        />
      )}

      {/* 3. Content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            VALIDATING ADMINISTRATOR PRIVILEGES...
          </div>
        ) : session?.authenticated ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      {/* 4. Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(6, 8, 14, 0.75)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        CYBERSECURITY CTF ADMINISTRATOR COMMAND CENTER • HIGH-SECURITY LOCAL SYSTEM
      </footer>
    </div>
  );
}
