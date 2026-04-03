


// login.js
// Handles frontend login logic, including form validation and session management.

document.addEventListener('DOMContentLoaded', () => {
  const AUTH_KEY = 'pet_auth_v1';

  const params = new URLSearchParams(window.location.search);
  const forceLogin = params.get('force') === '1';
  const doLogout = params.get('logout') === '1';

  // If user explicitly logs out, clear any session first
  if (doLogout) {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }

  // Only redirect if explicitly requested (prevents auto-bounce while testing)
  const existing = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  const allowRedirect = params.get('redirect') === '1';

  if (existing && allowRedirect && !forceLogin && !doLogout) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.querySelector('#loginForm');
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const rememberMe = document.querySelector('#rememberMe');
  const formError = document.querySelector('#formError');
  const forgotLink = document.querySelector('#forgotLink');

  if (!form) return;

  function showError(msg) {
    formError.style.display = 'block';
    formError.textContent = msg;
  }

  function hideError() {
    formError.style.display = 'none';
    formError.textContent = '';
  }

  forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset is not implemented yet. (Frontend prototype)');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      showError('Email is required.');
      return;
    }

    // Basic email check
    if (!email.includes('@') || !email.includes('.')) {
      showError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      showError('Password is required.');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters.');
      return;
    }

    const session = {
      email,
      remember: rememberMe.checked,
      loginTime: new Date().toISOString()
    };

    // If remember me is checked, persist. Otherwise keep session-only.
    if (rememberMe.checked) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      localStorage.removeItem(AUTH_KEY);
    }

    window.location.href = 'dashboard.html';
  });
});