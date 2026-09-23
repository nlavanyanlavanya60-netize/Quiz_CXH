// In production (Vercel), points to the Vercel backend.
const defaultBackend = 'https://quiz-cxh-backend.vercel.app';
let rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
if (!rawBase && !import.meta.env.DEV) {
  rawBase = defaultBackend;
}
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}
const API_BASE = rawBase ? `${rawBase}/api/admin` : '/api/admin';

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
