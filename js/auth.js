/* ============================================================
   Subly Auth Module - Login & Register Handler
   ============================================================ */

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
      el.style.display = 'block';
    }
    console.error('Auth Error:', message);
  },

  // Hide error message
  hideError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = 'none';
      el.textContent = '';
    }
  },

  // Show success message
  showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
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
        btn.innerHTML = '<span class="loading-spinner"></span>' + loadingText;
      } else {
        btn.textContent = btn.dataset.originalText || 'Submit';
      }
    }
  },

  // Validate email format
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Handle login form submission
  async handleLogin(event) {
    event.preventDefault();
    console.log('=== LOGIN STARTED ===');

    const errorEl = 'loginError';
    const successEl = 'loginSuccess';
    const submitBtn = 'loginSubmitBtn';

    this.hideError(errorEl);
    this.hideError(successEl);

    const email = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;
    const remember = document.getElementById('rememberMe')?.checked;

    console.log('Login values:', { email, password: password ? '***' : 'empty' });

    if (!email) {
      this.showError(errorEl, 'Please enter your email address');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError(errorEl, 'Please enter a valid email address');
      return;
    }

    if (!password) {
      this.showError(errorEl, 'Please enter your password');
      return;
    }

    this.setLoading(submitBtn, true, 'Signing in...');

    try {
      console.log('Calling API login...');
      
      // Direct fetch instead of api.login
      const response = await fetch('https://subly-api-production-2b44.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        this.saveAuth(data.token, data.user);

        if (remember) {
          localStorage.setItem('rememberEmail', email);
        }

        this.showSuccess(successEl, 'Login successful! Redirecting...');

        setTimeout(() => {
          this.redirectToDashboard();
        }, 1000);
      } else {
        this.showError(errorEl, data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showError(errorEl, 'Network error. Please try again.');
    } finally {
      this.setLoading(submitBtn, false);
    }
  },

  // Handle register form submission
  async handleRegister(event) {
    event.preventDefault();
    console.log('=== REGISTER STARTED ===');

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

    console.log('Register values:', { firstName, lastName, email });

    if (!firstName || !lastName) {
      this.showError(errorEl, 'Please enter your full name');
      return;
    }

    if (!email || !this.isValidEmail(email)) {
      this.showError(errorEl, 'Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      this.showError(errorEl, 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      this.showError(errorEl, 'Passwords do not match');
      return;
    }

    if (!terms) {
      this.showError(errorEl, 'Please agree to the Terms of Service');
      return;
    }

    this.setLoading(submitBtn, true, 'Creating account...');

    try {
      const fullName = firstName + ' ' + lastName;
      console.log('Calling API register...');

      // Direct fetch instead of api.register
      const response = await fetch('https://subly-api-production-2b44.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password })
      });
      
      const data = await response.json();
      console.log('Register response:', data);

      if (data.success) {
        this.saveAuth(data.token, data.user);
        this.showSuccess(successEl, 'Account created! Redirecting...');

        setTimeout(() => {
          this.redirectToDashboard();
        }, 1500);
      } else {
        this.showError(errorEl, data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Register error:', error);
      this.showError(errorEl, 'Network error. Please try again.');
    } finally {
      this.setLoading(submitBtn, false);
    }
  },

  // Handle logout
  handleLogout() {
    console.log('=== LOGOUT ===');
    this.clearAuth();
    this.redirectToLogin();
  },

  // Initialize auth module
  init() {
    console.log('=== AUTH MODULE INITIALIZED ===');

    // Auto-fill remembered email
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      const emailInput = document.getElementById('loginEmail');
      if (emailInput) {
        emailInput.value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
      }
    }

    // Check if already logged in on auth pages
    const currentPage = window.location.pathname.split('/').pop();
    if ((currentPage === 'login.html' || currentPage === 'register.html') && this.isLoggedIn()) {
      console.log('Already logged in, redirecting...');
      this.redirectToDashboard();
      return;
    }

    // Attach event listeners
    this.attachEventListeners();
  },

  // Attach event listeners
  attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      console.log('Login form found');
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      console.log('Register form found');
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Auth.init());
} else {
  Auth.init();
}

window.Auth = Auth;
