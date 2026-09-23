import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';
import StatCard from '../components/StatCard';
import TopTeamsTable from '../components/TopTeamsTable';
import TeamsTable from '../components/TeamsTable';
import ResultsTable from '../components/ResultsTable';
import ActionConfirmModal from '../components/ActionConfirmModal';
import {
  Users,
  Radio,
  CheckCircle,
  Clock,
  Trophy,
  TrendingUp,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'teams' | 'results'

  // Action modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'CONFIRM',
    isDanger: false,
    onConfirm: null,
  });

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [sData, rData, tData, resData] = await Promise.all([
        adminApi.getStatistics(),
        adminApi.getRanking(),
        adminApi.getTeams(),
        adminApi.getResults()
      ]);

      setStats(sData);
      setRankings(rData || []);
      setTeams(tData || []);
      setResults(resData || []);
    } catch (err) {
      console.error('Error fetching admin telemetry:', err);
      if (err.status === 401) {
        try {
          await adminApi.getSession();
        } catch {
          onLogout();
        }
      }
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Terminate session action
  const handleTerminateSession = (teamId, teamName) => {
    setModalConfig({
      isOpen: true,
      title: 'TERMINATE ACTIVE SESSION',
      message: `Are you sure you want to force-disconnect the active session for team "${teamName}"? The team will be logged out immediately.`,
      confirmLabel: 'TERMINATE SESSION',
      isDanger: true,
      onConfirm: async () => {
        try {
          await adminApi.terminateSession(teamId);
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          await fetchData();
        } catch (err) {
          alert(`Failed to terminate session: ${err.message}`);
        }
      }
    });
  };

  // Authorize re-login action
  const handleAuthorizeLogin = (teamId, teamName, resetQuiz = false) => {
    const actionLabel = resetQuiz ? 'RESET QUIZ ATTEMPT' : 'AUTHORIZE RE-LOGIN';
    const msg = resetQuiz
      ? `WARNING: This will permanently reset quiz answers, score, and timer for team "${teamName}", permitting a completely fresh attempt. Are you sure?`
      : `Authorize team "${teamName}" to log in again with their password?`;

    setModalConfig({
      isOpen: true,
      title: actionLabel,
      message: msg,
      confirmLabel: resetQuiz ? 'RESET & AUTHORIZE' : 'AUTHORIZE LOGIN',
      isDanger: resetQuiz,
      onConfirm: async () => {
        try {
          await adminApi.authorizeLogin(teamId, resetQuiz);
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          await fetchData();
        } catch (err) {
          alert(`Action failed: ${err.message}`);
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <Activity size={36} color="var(--accent-cyan)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            SYNCHRONIZING COMMAND TELEMETRY
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Fetching real-time team states, scoring, and sessions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '2rem 1.5rem 5rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'btn-admin-primary' : 'btn-admin-secondary'}
          style={{ padding: '0.55rem 1.25rem' }}
        >
          <Trophy size={15} />
          <span>OVERVIEW &amp; LEADERBOARD</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={activeTab === 'teams' ? 'btn-admin-primary' : 'btn-admin-secondary'}
          style={{ padding: '0.55rem 1.25rem' }}
        >
          <Users size={15} />
          <span>TEAMS MANAGEMENT ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={activeTab === 'results' ? 'btn-admin-primary' : 'btn-admin-secondary'}
          style={{ padding: '0.55rem 1.25rem' }}
        >
          <FileSpreadsheet size={15} />
          <span>RESULTS AUDIT ({results.length})</span>
        </button>
      </div>

      {/* 7 Statistics Cards Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Total Registered"
          value={stats?.total_registered_teams ?? 0}
          subtext="Official teams"
          icon={<Users size={18} />}
          accentColor="var(--accent-cyan)"
        />
        <StatCard
          title="Active Sessions"
          value={stats?.active_teams ?? 0}
          subtext="Currently logged in"
          icon={<Radio size={18} />}
          accentColor="var(--accent-emerald)"
        />
        <StatCard
          title="Submitted"
          value={stats?.submitted_teams ?? 0}
          subtext="Completed quiz"
          icon={<CheckCircle size={18} />}
          accentColor="var(--accent-emerald)"
        />
        <StatCard
          title="In Progress"
          value={stats?.unsubmitted_teams ?? 0}
          subtext="Pending submission"
          icon={<Clock size={18} />}
          accentColor="var(--accent-warning)"
        />
        <StatCard
          title="Top Score"
          value={`${stats?.highest_score ?? 0} / 100`}
          subtext="Highest mark"
          icon={<Trophy size={18} />}
          accentColor="#FBBF24"
        />
        <StatCard
          title="Average Score"
          value={`${stats?.average_score ?? 0}`}
          subtext="Among submitted"
          icon={<TrendingUp size={18} />}
          accentColor="var(--accent-purple)"
        />
        <StatCard
          title="Completed"
          value={stats?.completed_attempts ?? 0}
          subtext="Final evaluations"
          icon={<Award size={18} />}
          accentColor="var(--text-cyan)"
        />
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <>
          <TopTeamsTable rankings={rankings} />
          <TeamsTable
            teams={teams}
            onTerminateSession={handleTerminateSession}
            onAuthorizeLogin={handleAuthorizeLogin}
          />
        </>
      )}

      {/* Tab 2: Teams Management */}
      {activeTab === 'teams' && (
        <TeamsTable
          teams={teams}
          onTerminateSession={handleTerminateSession}
          onAuthorizeLogin={handleAuthorizeLogin}
        />
      )}

      {/* Tab 3: Results Audit */}
      {activeTab === 'results' && <ResultsTable results={results} />}

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        isDanger={modalConfig.isDanger}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}
