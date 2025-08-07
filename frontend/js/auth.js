

const BACKEND_URL = 'http://localhost:3000'; 


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
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include' 
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      messageDiv.textContent = errorData?.message || `Signup failed with status ${res.status}`;
      return;
    }

    const data = await res.json();

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
    messageDiv.textContent = 'Network or server error occurred. Please try again.';
  }
}


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
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      messageDiv.textContent = errorData?.message || `Login failed with status ${res.status}`;
      return;
    }

    const data = await res.json();

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
    messageDiv.textContent = 'Network or server error occurred. Please try again.';
  }
}


if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}
