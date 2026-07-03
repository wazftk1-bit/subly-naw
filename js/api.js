const API_URL = 'https://subly-api.up.railway.app'; // رابط Railway

const api = {
  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    });
    return res.json();
  },

  login: (email, password) => api.fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  register: (name, email, password) => api.fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),

  getDashboardStats: () => api.fetch('/api/subscriptions/stats/dashboard'),

  getHealth: () => api.fetch('/api/health')
};
