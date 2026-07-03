// Subly API Client
const API_URL = 'https://your-backend-url.vercel.app'; // غير هذا للرابط الحقيقي

class SublyAPI {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  // Helper: Fetch with auth
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    
    return data;
  }

  // Auth
  async login(email, password) {
    const data = await this.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async register(name, email, password) {
    return this.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getMe() {
    return this.fetch('/api/auth/me');
  }

  // Subscriptions
  async getSubscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.fetch(`/api/subscriptions?${query}`);
  }

  async getDashboardStats() {
    return this.fetch('/api/subscriptions/stats/dashboard');
  }

  async createSubscription(subscription) {
    return this.fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  async updateSubscription(id, data) {
    return this.fetch(`/api/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscription(id) {
    return this.fetch(`/api/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Alerts
  async getAlerts() {
    return this.fetch('/api/alerts');
  }

  async markAlertRead(id) {
    return this.fetch(`/api/alerts/${id}/read`, { method: 'PUT' });
  }

  // Analysis
  async getAnalysis() {
    return this.fetch('/api/subscriptions/analysis');
  }
}

// Export singleton
const api = new SublyAPI();

// Usage in your dashboard:
// const stats = await api.getDashboardStats();
// const subs = await api.getSubscriptions();