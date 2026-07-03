/* ============================================================
   Subly Auth Module - Login & Register Handler
   Handles authentication flow and redirects
   ============================================================ */

const API_URL = 'https://subly-api-production-2b44.up.railway.app';

const Auth = {
  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Save auth data
  saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data (logout)
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Redirect to dashboard
  redirectToDashboard() {
    window.location.href = 'dashboard.html';
  },

  // Redirect to login
  redirectToLogin() {
    window.location.href = 'login.html';
  },

  // Show error message
  showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.classList.add('show');
      el.style.display = 'block';
    }
    console.error('Auth Error:', message);
  },

  // Hide error message
  hideError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.remove('show');
      el.style.display = 'none';
      el.textContent = '';
    }
  },

  // Show success message
  showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.classList.add('show');
      el.style.display = 'block';
    }
    console.log('Auth Success:', message);
  },

  // Set loading state on button
  setLoading(buttonId, isLoading, loadingText = 'Loading...') {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.disabled = isLoading;
      if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.innerHTML = `<span class="loading-spinner"></span>${loadingText}`;
      } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
      }
    }
  },

  // Validate email format
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Validate password (min 6 chars)
  isValidPassword(password) {
    return password && password.length >= 6;
  },

  // Handle login form submission
  async handleLogin(event) {
    event.preventDefault();

    const errorEl = 'loginError';
    const successEl = 'loginSuccess';
    const submitBtn = 'loginSubmitBtn';

    this.hideError(errorEl);
    this.hideError(successEl);

    const email = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;
    const remember = document.getElementById('rememberMe')?.checked;

    if (!email) return this.showError(errorEl, 'Please enter your email');
    if (!this.isValidEmail(email)) return this.showError(errorEl, 'Invalid email');
    if (!password) return this.showError(errorEl, 'Please enter password');

    this.setLoading(submitBtn, true, 'Signing in...');

    try {
      const data = await api.login(email, password);

      if (data.success) {
        this.saveAuth(data.token, data.user);

        if (remember) {
          localStorage.setItem('rememberEmail', email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        this.showSuccess(successEl, 'Login successful!');
        setTimeout(() => this.redirectToDashboard(), 1000);
      } else {
        this.showError(errorEl, data.message || 'Login failed');
      }

    } catch (error) {
      this.showError(errorEl, error.message || 'Network error');
    } finally {
      this.setLoading(submitBtn, false);
    }
  },

  // Handle register form
  async handleRegister(event) {
    event.preventDefault();

    const errorEl = 'registerError';
    const successEl = 'registerSuccess';
    const submitBtn = 'registerSubmitBtn';

    this.hideError(errorEl);
    this.hideError(successEl);

    const firstName = document.getElementById('firstName')?.value?.trim();
    const lastName = document.getElementById('lastName')?.value?.trim();
    const email = document.getElementById('registerEmail')?.value?.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const terms = document.getElementById('terms')?.checked;

    if (!firstName || !lastName)
      return this.showError(errorEl, 'Enter full name');

    if (!email || !this.isValidEmail(email))
      return this.showError(errorEl, 'Invalid email');

    if (!this.isValidPassword(password))
      return this.showError(errorEl, 'Password must be 6+ chars');

    if (password !== confirmPassword)
      return this.showError(errorEl, 'Passwords do not match');

    if (!terms)
      return this.showError(errorEl, 'Accept terms first');

    this.setLoading(submitBtn, true, 'Creating account...');

    try {
      const data = await api.register(firstName + ' ' + lastName, email, password);

      if (data.success) {
        this.saveAuth(data.token, data.user);

        this.showSuccess(successEl, 'Account created!');
        setTimeout(() => this.redirectToDashboard(), 1500);
      } else {
        this.showError(errorEl, data.message || 'Register failed');
      }

    } catch (error) {
      this.showError(errorEl, error.message || 'Network error');
    } finally {
      this.setLoading(submitBtn, false);
    }
  },

  // Logout
  handleLogout() {
    this.clearAuth();
    this.redirectToLogin();
  },

  // Google Sign-In (FIXED)
  async handleGoogleSignIn(googleResponse) {
    const errorEl = 'loginError';
    const successEl = 'loginSuccess';

    this.hideError(errorEl);
    this.hideError(successEl);

    try {
      const token = googleResponse.credential;

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.success) {
        this.saveAuth(data.token, data.user);
        this.showSuccess(successEl, 'Google login successful!');

        setTimeout(() => this.redirectToDashboard(), 1000);
      } else {
        this.showError(errorEl, data.message || 'Google login failed');
      }

    } catch (error) {
      this.showError(errorEl, 'Google login failed: ' + error.message);
    }
  },

  // Auto-fill email
  autoFillRememberedEmail() {
    const email = localStorage.getItem('rememberEmail');
    if (email) {
      const input = document.getElementById('loginEmail');
      if (input) input.value = email;
    }
  },

  // Init
  init() {
    this.autoFillRememberedEmail();

    const page = window.location.pathname.split('/').pop();
    if ((page === 'login.html' || page === 'register.html') && this.isLoggedIn()) {
      this.redirectToDashboard();
      return;
    }

    this.attachEventListeners();
  },

  // Events
  attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', e => this.handleLogin(e));

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', e => this.handleRegister(e));

    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', () => this.handleLogout());
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());

window.Auth = Auth;
