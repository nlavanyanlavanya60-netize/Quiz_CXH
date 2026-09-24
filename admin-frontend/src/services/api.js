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
