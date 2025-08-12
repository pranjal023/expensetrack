import { apiPost } from './api.js';

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('signupMessage');
  messageDiv.textContent = '';
  messageDiv.style.color = 'red';

  if (!username || !email || !password) {
    messageDiv.textContent = 'Please fill all fields.';
    return;
  }

  try {
    const data = await apiPost('/api/auth/signup', { username, email, password });

    if (data.success) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Signup successful! Redirecting...';
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      messageDiv.textContent = data.message || 'Signup failed.';
    }
  } catch (error) {
    console.error('Signup error:', error);
    messageDiv.textContent = error.message || 'Network or server error occurred. Please try again.';
  }
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('loginMessage');
  messageDiv.textContent = '';
  messageDiv.style.color = 'red';

  if (!email || !password) {
    messageDiv.textContent = 'Please fill all fields.';
    return;
  }

  try {
    const data = await apiPost('/api/auth/login', { email, password });

    if (data.success) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Login successful! Redirecting...';
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      messageDiv.textContent = data.message || 'Login failed.';
    }
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.textContent = error.message || 'Network or server error occurred. Please try again.';
  }
}

// Attach event listeners
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
