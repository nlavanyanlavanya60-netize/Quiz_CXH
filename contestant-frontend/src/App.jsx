import React, { useState, useEffect } from 'react';
import { api, tokenStorage } from './services/api';
import LiveWallpaper from './components/LiveWallpaper';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import SubmittedPage from './pages/SubmittedPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [session, setSession] = useState(null);
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

  // Validate session on boot
  useEffect(() => {
    const checkAuth = async () => {
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

  const handleQuizSubmitted = (info) => {
    setSubmissionInfo(info);
    navigate('/submitted');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Continuous Live Wallpaper Background */}
      <LiveWallpaper />

      {/* 2. Top Navigation */}
      <Navbar
        session={session}
        onLogout={handleLogout}
        currentRoute={currentRoute}
        onNavigate={navigate}
      />

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
      </main>

      {/* 4. Footer */}
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
        }}
      >
        CYBERSECURITY CAPTURE THE FLAG // DEFENSE PROTOCOL 2026 • STRICT SERVER AUTHORITATIVE SYSTEM
      </footer>
    </div>
  );
}
