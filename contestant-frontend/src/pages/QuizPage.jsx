import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import TimerHUD from '../components/TimerHUD';
import QuestionNav from '../components/QuestionNav';
import QuestionCard from '../components/QuestionCard';
import ConfirmModal from '../components/ConfirmModal';
import { Shield, Eye, AlertTriangle } from 'lucide-react';

export default function QuizPage({ session, onQuizSubmitted, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizMeta, setQuizMeta] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent multiple auto-submit executions
  const autoSubmittedRef = useRef(false);

  // Load initial quiz state
  const loadQuizState = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getQuiz();

      if (data.quiz_submitted) {
        onQuizSubmitted({
          message: 'This team has already completed the quiz.',
          reason: data.submission_reason || 'already_submitted'
        });
        return;
      }

      setQuizMeta(data);
      setAnswers(data.answers || {});

      // Fetch first question detail
      if (data.questions && data.questions.length > 0) {
        const firstQNum = data.questions[0].question_number;
        const qDetail = await api.getQuestion(firstQNum);
        setCurrentQuestion(qDetail);
      }
    } catch (err) {
      if (err.status === 401) {
        onNavigate('/login');
      } else {
        setError(err.message || 'Failed to initialize quiz session.');
      }
    } finally {
      setLoading(false);
    }
  }, [onQuizSubmitted, onNavigate]);

  const [warningState, setWarningState] = useState({
    isOpen: false,
    count: 0,
    remaining: 3,
    message: ''
  });

  // Debounce ref to prevent multi-event duplicate reports on client
  const lastViolationReportTime = useRef(0);

  const reportViolationEvent = useCallback(async (eventType) => {
    if (autoSubmittedRef.current) return;
    const now = Date.now();
    if (now - lastViolationReportTime.current < 1500) return;
    lastViolationReportTime.current = now;

    const eventId = 'evt_' + now + '_' + Math.random().toString(36).substring(2, 9);
    try {
      const res = await api.reportViolation(eventId, eventType);
      if (res.status === 'terminated' || res.violation_count >= 4) {
        autoSubmittedRef.current = true;
        onQuizSubmitted({
          message: res.message || 'Quiz session terminated due to maximum violations exceeded.',
          reason: 'violation_limit'
        });
      } else if (res.status === 'warning') {
        setWarningState({
          isOpen: true,
          count: res.violation_count,
          remaining: res.remaining_warnings,
          message: res.message
        });
      }
    } catch (err) {
      if (err.status === 403 || err.status === 401) {
        autoSubmittedRef.current = true;
        onQuizSubmitted({
          message: err.message || 'Session terminated due to violation limits.',
          reason: 'violation_limit'
        });
      }
    }
  }, [onQuizSubmitted]);

  useEffect(() => {
    loadQuizState();

    // Heartbeat interval to monitor session and single-tab validity
    const heartbeatInterval = setInterval(async () => {
      if (autoSubmittedRef.current) return;
      try {
        const hb = await api.getHeartbeat();
        if (hb.quiz_submitted) {
          autoSubmittedRef.current = true;
          onQuizSubmitted({
            message: 'Quiz session completed or submitted.',
            reason: hb.submission_reason || 'submitted'
          });
        }
      } catch (err) {
        if (err.status === 403 || err.status === 401) {
          autoSubmittedRef.current = true;
          onQuizSubmitted({
            message: err.message || 'Session invalidated or multiple active tabs detected.',
            reason: 'multiple_tabs'
          });
        }
      }
    }, 5000);

    // Event listeners for tab/window focus loss
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportViolationEvent('visibility_change');
      }
    };

    const handleWindowBlur = () => {
      reportViolationEvent('window_blur');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [loadQuizState, onQuizSubmitted, reportViolationEvent]);

  // Load specific question details when index changes
  const handleSelectQuestion = async (index) => {
    if (!quizMeta || !quizMeta.questions || !quizMeta.questions[index]) return;
    const targetQNum = quizMeta.questions[index].question_number;

    try {
      const qDetail = await api.getQuestion(targetQNum);
      setCurrentIndex(index);
      setCurrentQuestion(qDetail);
    } catch (err) {
      console.error('Error fetching question:', err);
    }
  };

  // Answer selection and immediate backend persistence
  const handleSelectAnswer = async (selectedOption) => {
    if (!currentQuestion) return;
    const qNum = currentQuestion.question_number;

    // Optimistic UI update
    setAnswers((prev) => ({
      ...prev,
      [qNum]: selectedOption
    }));

    try {
      await api.submitAnswer(qNum, selectedOption);
    } catch (err) {
      console.error('Error saving answer:', err);
      // If quiz expired or locked
      if (err.status === 403 || err.status === 401) {
        onQuizSubmitted({
          message: err.message,
          reason: 'timeout'
        });
      }
    }
  };

  // Manual Submission handler
  const handleManualSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.submitQuiz();
      setIsSubmitModalOpen(false);
      onQuizSubmitted({
        message: res.message || 'Your answers have been submitted successfully.',
        reason: 'manual'
      });
    } catch (err) {
      setError(err.message || 'Submission failed. Please retry.');
      setIsSubmitting(false);
    }
  };

  // Anti-Cheat & Timeout Auto-Submit trigger
  const triggerAutoSubmit = useCallback(async (reason) => {
    if (autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;

    try {
      const res = await api.autoSubmitQuiz(reason);
      onQuizSubmitted({
        message: res.message,
        reason: reason
      });
    } catch (err) {
      onQuizSubmitted({
        message: 'Quiz session terminated.',
        reason: reason
      });
    }
  }, [onQuizSubmitted]);



  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <Shield size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            SYNCHRONIZING CHALLENGE PAYLOAD
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Establishing server-authoritative quiz session...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', border: '1px solid var(--accent-danger)' }}>
          <AlertTriangle size={36} color="var(--accent-danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontFamily: 'var(--font-mono)', color: '#FF6B81', marginBottom: '0.5rem' }}>
            CONNECTION ERROR
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setError('');
                loadQuizState();
              }}
              className="btn-cyber-primary"
            >
              RETRY CONNECTION
            </button>
            <button onClick={() => onNavigate('/')} className="btn-cyber-secondary">
              RETURN TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionsList = quizMeta?.questions || [];
  const currentQNum = currentQuestion?.question_number;
  const currentSelectedAnswer = currentQNum ? answers[currentQNum] : null;

  return (
    <div
      style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 4rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Banner HUD: Team info, Anti-Cheat Notice, Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Session status indicator */}
        <div
          className="glass-card"
          style={{
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '1px solid rgba(0, 242, 166, 0.2)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              boxShadow: '0 0 10px var(--accent-emerald)',
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              SERVER-AUTHORITATIVE SESSION ACTIVE
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Session remains active until final submission or timer expiration.
            </div>
          </div>
        </div>

        {/* 30-Minute Timer HUD */}
        <TimerHUD
          initialSeconds={quizMeta?.remaining_seconds || 1800}
          onTimeout={() => triggerAutoSubmit('timeout')}
        />
      </div>

      {/* Main Quiz Layout: Left Navigator (300px), Right Question Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Side: 50 Questions Navigator */}
        <div style={{ gridColumn: 'span 1' }}>
          <QuestionNav
            questions={questionsList}
            currentIndex={currentIndex}
            onSelectQuestion={handleSelectQuestion}
            answers={answers}
          />
        </div>

        {/* Right Side: Active Question Card */}
        <div style={{ gridColumn: 'span 2' }}>
          <QuestionCard
            question={currentQuestion}
            displayIndex={currentIndex}
            totalQuestions={50}
            selectedAnswer={currentSelectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            onPrev={() => handleSelectQuestion(currentIndex - 1)}
            onNext={() => handleSelectQuestion(currentIndex + 1)}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < questionsList.length - 1}
            onSubmitClick={() => setIsSubmitModalOpen(true)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <ConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleManualSubmit}
        answeredCount={Object.keys(answers).length}
        totalQuestions={50}
        isLoading={isSubmitting}
      />

      {/* Tab / Window Violation Warning Modal */}
      {warningState.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.5rem',
              border: '1px solid var(--accent-danger)',
              boxShadow: '0 0 30px rgba(255, 107, 129, 0.3)',
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={52} color="#FF6B81" style={{ margin: '0 auto 1.25rem auto' }} />
            <h3 style={{ color: '#FF6B81', fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '1px' }}>
              WARNING {warningState.count} OF 3
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {warningState.message}
            </p>
            <div style={{ background: 'rgba(255,107,129,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.75rem', fontSize: '0.85rem', color: '#FF6B81', fontWeight: 600 }}>
              Remaining Warnings Before Automatic Termination: {warningState.remaining}
            </div>
            <button
              onClick={() => setWarningState((prev) => ({ ...prev, isOpen: false }))}
              className="btn-cyber-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              ACKNOWLEDGE & RETURN TO QUIZ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
