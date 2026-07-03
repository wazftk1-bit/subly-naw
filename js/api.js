// js/api.js - Subly API Client
const API_URL = 'https://subly-api-production-2b44.up.railway.app';

class SublyAPI {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

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

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(name, email, password) {
    return this.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

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

  async getMe() {
    return this.fetch('/api/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }

  // Dashboard
  async getDashboardStats() {
    return this.fetch('/api/subscriptions/stats/dashboard');
  }

  // Subscriptions
  async getSubscriptions() {
    return this.fetch('/api/subscriptions');
  }

  async createSubscription(subscription) {
    return this.fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  // Alerts
  async getAlerts() {
    return this.fetch('/api/alerts');
  }

  // Health check
  async checkHealth() {
    return this.fetch('/api/health');
  }
}

// Create global instance
const api = new SublyAPI();

// Auto-check auth on protected pages
const protectedPages = ['dashboard.html', 'subscriptions.html', 'analysis.html', 'settings.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage)) {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
}

// Export for use in other scripts
window.api = api;
