// Prefer same-origin '/api' to eliminate mobile CORS & 3rd-party cookie blocking
const PRIMARY_API_BASE = '/api';
const DIRECT_BACKEND = 'https://quiz-cxh-backend.vercel.app/api';

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

  let response;
  let lastErr;
  const baseUrls = [PRIMARY_API_BASE, DIRECT_BACKEND];

  for (const base of baseUrls) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await fetch(`${base}${endpoint}`, config);
        if (response) break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
    if (response) break;
  }

  if (!response) {
    throw new Error('Connection failed: Server is unreachable. Please verify network connectivity.');
  }

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

// ── Admin API Services ─────────────────────────────────────────────────────
const ADMIN_BASES = ['/api/admin', 'https://quiz-cxh-backend.vercel.app/api/admin'];

export const adminTokenStorage = {
  get: () => sessionStorage.getItem('ctf_admin_token'),
  set: (token) => sessionStorage.setItem('ctf_admin_token', token),
  clear: () => sessionStorage.removeItem('ctf_admin_token')
};

async function adminRequest(endpoint, options = {}) {
  const token = adminTokenStorage.get();
  const headers = {
    'Content-Type': 'application/json',
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

  let response;
  let lastErr;
  for (const base of ADMIN_BASES) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await fetch(`${base}${endpoint}`, config);
        if (response) break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
    if (response) break;
  }

  if (!response) {
    throw new Error('Connection failed: Server is unreachable. Please verify network connectivity.');
  }

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

export const adminApi = {
  login: async (username, password) => {
    const data = await adminRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.session_token) {
      adminTokenStorage.set(data.session_token);
    }
    return data;
  },

  logout: async () => {
    try {
      await adminRequest('/logout', { method: 'POST' });
    } finally {
      adminTokenStorage.clear();
    }
  },

  getSession: () => adminRequest('/session'),
  getStatistics: () => adminRequest('/statistics'),
  getRanking: () => adminRequest('/ranking'),
  getTeams: () => adminRequest('/teams'),
  getResults: () => adminRequest('/results'),

  terminateSession: (team_id) =>
    adminRequest('/terminate-session', {
      method: 'POST',
      body: JSON.stringify({ team_id })
    }),

  authorizeLogin: (team_id, reset_quiz = false) =>
    adminRequest('/authorize-login', {
      method: 'POST',
      body: JSON.stringify({ team_id, reset_quiz })
    })
};

