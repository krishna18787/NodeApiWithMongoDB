const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginButton = document.getElementById('show-login');
const showRegisterButton = document.getElementById('show-register');
const authStatus = document.getElementById('auth-status');

function setAuthStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.classList.toggle('error', isError);
}

function setMode(mode) {
  const loginMode = mode === 'login';
  loginForm.classList.toggle('hidden', !loginMode);
  registerForm.classList.toggle('hidden', loginMode);
  showLoginButton.className = loginMode ? 'secondary' : 'ghost';
  showRegisterButton.className = loginMode ? 'ghost' : 'secondary';
  setAuthStatus(
    loginMode ? 'Please login to continue.' : 'Create an account to continue.'
  );
}

function saveToken(token) {
  localStorage.setItem('authToken', token);
}

async function checkExistingSession() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return;
  }

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      window.location.replace('/tasks.html');
      return;
    }
  } catch (error) {
  }

  localStorage.removeItem('authToken');
}

async function submitLogin(event) {
  event.preventDefault();

  const payload = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value,
  };

  try {
    setAuthStatus('Logging in...');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    saveToken(result.token);
    window.location.replace('/tasks.html');
  } catch (error) {
    setAuthStatus(error.message, true);
  }
}

async function submitRegister(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById('register-name').value,
    email: document.getElementById('register-email').value,
    password: document.getElementById('register-password').value,
  };

  try {
    setAuthStatus('Creating account...');
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    saveToken(result.token);
    window.location.replace('/tasks.html');
  } catch (error) {
    setAuthStatus(error.message, true);
  }
}

showLoginButton.addEventListener('click', () => setMode('login'));
showRegisterButton.addEventListener('click', () => setMode('register'));
loginForm.addEventListener('submit', submitLogin);
registerForm.addEventListener('submit', submitRegister);

checkExistingSession();
