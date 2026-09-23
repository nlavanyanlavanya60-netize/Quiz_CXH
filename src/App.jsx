import React, { useState, useEffect } from 'react';
import { api, adminApi, tokenStorage, adminTokenStorage } from './services/api';
import LiveWallpaper from './components/LiveWallpaper';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import SubmittedPage from './pages/SubmittedPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [session, setSession] = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [submissionInfo, setSubmissionInfo] = useState(null);

  // Synchronize route with browser history
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Validate sessions on route change / boot
  useEffect(() => {
    const checkAuth = async () => {
      // 1. If navigating to admin routes
      if (currentRoute === '/admin/login') {
        // Always require credentials on login screen - never auto-login
        setAdminSession(null);
        return;
      }
      if (currentRoute === '/admin') {
        try {
          const data = await adminApi.getSession();
          if (data && data.authenticated) {
            setAdminSession(data);
          } else {
            setAdminSession(null);
            navigate('/admin/login');
          }
        } catch {
          setAdminSession(null);
          navigate('/admin/login');
        }
        return;
      }

      // 2. Contestant session check
      try {
        const data = await api.getSession();
        setSession(data);

        // Route guard
        if (data.quiz_submitted) {
          if (currentRoute === '/quiz') {
            navigate('/submitted');
          }
        }
      } catch (err) {
        setSession(null);
        if (currentRoute === '/quiz') {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [currentRoute]);

  const handleLoginSuccess = async () => {
    try {
      const data = await api.getSession();
      setSession(data);
      if (data.quiz_submitted) {
        navigate('/submitted');
      } else {
        navigate('/quiz');
      }
    } catch {
      navigate('/quiz');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    setSession(null);
    navigate('/');
  };

  const handleAdminLoginSuccess = async () => {
    try {
      const data = await adminApi.getSession();
      setAdminSession(data);
      navigate('/admin');
    } catch {
      navigate('/admin');
    }
  };

  const handleAdminLogout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {
      console.error(e);
    }
    setAdminSession(null);
    navigate('/login');
  };

  const handleQuizSubmitted = (info) => {
    setSubmissionInfo(info);
    navigate('/submitted');
  };

  const isAdminView = currentRoute === '/admin' && adminSession?.authenticated;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Continuous Live Wallpaper Background */}
      <LiveWallpaper />

      {/* 2. Top Navigation */}
      {isAdminView ? (
        <AdminNavbar
          adminUsername={adminSession.username}
          onLogout={handleAdminLogout}
          onRefresh={() => window.location.reload()}
          isRefreshing={false}
        />
      ) : (
        <Navbar
          session={session}
          onLogout={handleLogout}
          currentRoute={currentRoute}
          onNavigate={navigate}
        />
      )}

      {/* 3. Main Route Content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {currentRoute === '/' && <LandingPage onNavigate={navigate} />}
        {currentRoute === '/register' && <RegisterPage onNavigate={navigate} />}
        {currentRoute === '/login' && (
          <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
        )}
        {currentRoute === '/quiz' && (
          <QuizPage
            session={session}
            onQuizSubmitted={handleQuizSubmitted}
            onNavigate={navigate}
          />
        )}
        {currentRoute === '/submitted' && (
          <SubmittedPage submissionInfo={submissionInfo} onNavigate={navigate} />
        )}

        {/* 4. Unified Admin Pages */}
        {currentRoute === '/admin/login' && (
          <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} onNavigate={navigate} />
        )}
        {currentRoute === '/admin' && (
          adminSession?.authenticated ? (
            <AdminDashboard onLogout={handleAdminLogout} onNavigate={navigate} />
          ) : (
            <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} onNavigate={navigate} />
          )
        )}
      </main>

      {/* 5. Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(8, 10, 16, 0.7)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <span>CYBERSECURITY CAPTURE THE FLAG // DEFENSE PROTOCOL 2026 • STRICT SERVER AUTHORITATIVE SYSTEM</span>
      </footer>
    </div>
  );
}
