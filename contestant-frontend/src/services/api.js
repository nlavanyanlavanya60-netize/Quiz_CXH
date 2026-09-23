// In production (Vercel), VITE_API_BASE_URL points to the Render backend.
// In local dev, the Vite proxy forwards /api → localhost:8000
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

export const tokenStorage = {
  get: () => sessionStorage.getItem('ctf_contestant_token'),
  set: (token) => sessionStorage.setItem('ctf_contestant_token', token),
  clear: () => sessionStorage.removeItem('ctf_contestant_token')
};

// Generate or retrieve per-tab unique identifier
export const getTabId = () => {
  let tabId = sessionStorage.getItem('ctf_tab_id');
  if (!tabId) {
    tabId = 'tab_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    sessionStorage.setItem('ctf_tab_id', tabId);
  }
  return tabId;
};

async function apiRequest(endpoint, options = {}) {
  const token = tokenStorage.get();
  const tabId = getTabId();
  const headers = {
    'Content-Type': 'application/json',
    'X-Tab-ID': tabId,
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  register: (team_name, member1_name, member2_name) =>
    apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ team_name, member1_name, member2_name })
    }),

  login: async (team_name, password) => {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ team_name, password })
    });
    if (data.session_token) {
      tokenStorage.set(data.session_token);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } finally {
      tokenStorage.clear();
    }
  },

  getSession: () => apiRequest('/session'),

  getQuiz: () => apiRequest('/quiz'),

  getQuestion: (questionNumber) => apiRequest(`/quiz/questions/${questionNumber}`),

  getHeartbeat: () => apiRequest('/quiz/heartbeat'),

  submitAnswer: (question_number, selected_answer) =>
    apiRequest('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ question_number, selected_answer })
    }),

  submitQuiz: async () => {
    const data = await apiRequest('/quiz/submit', { method: 'POST' });
    tokenStorage.clear();
    return data;
  },

  autoSubmitQuiz: async (reason) => {
    const data = await apiRequest('/quiz/auto-submit', {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    tokenStorage.clear();
    return data;
  },

  reportViolation: (event_id, event_type = 'visibility_change') =>
    apiRequest('/quiz/violation', {
      method: 'POST',
      body: JSON.stringify({ event_id, event_type })
    })
};

