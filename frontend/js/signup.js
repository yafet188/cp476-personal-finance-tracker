// signup.js
// Handles frontend signup logic and registration via the backend API.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#signupForm');
  const nameInput = document.querySelector('#nameInput');
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const formError = document.querySelector('#formError');
  const formSuccess = document.querySelector('#formSuccess');

  if (!form) return;

  function showError(msg) {
    formError.style.display = 'block';
    formError.textContent = msg;
    formSuccess.style.display = 'none';
  }

  function hideError() {
    formError.style.display = 'none';
    formError.textContent = '';
  }

  function showSuccess(msg) {
    formSuccess.style.display = 'block';
    formSuccess.textContent = msg;
    formError.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Frontend validation
    if (!name) {
      showError('Full name is required.');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
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

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const payload = await res.json();

      if (payload.status === 'ok') {
        showSuccess('Account created, Redirecting to login');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        showError(payload.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      showError('Could not reach the server. Make sure the backend is running.');
    }
  });
});
