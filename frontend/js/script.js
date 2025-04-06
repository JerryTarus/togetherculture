
// Toggle between Login and Register forms.
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const memberExtraFields = document.getElementById('memberExtraFields');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
});

// Show/hide extra member fields based on registration role.
const regRoleInputs = document.querySelectorAll('input[name="regRole"]');
regRoleInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (input.value === 'member' && input.checked) {
      memberExtraFields.style.display = 'block';
    } else {
      memberExtraFields.style.display = 'none';
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const selectedRole = document.querySelector('input[name="regRole"]:checked').value;
  memberExtraFields.style.display = selectedRole === 'member' ? 'block' : 'none';
});

// Handle login submission.
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const loginRole = document.querySelector('input[name="loginRole"]:checked').value;
  
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      if (data.user.role !== loginRole) {
        document.getElementById('loginMessage').textContent = `Please use the ${data.user.role} login portal.`;
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.role === 'admin' ? 'adminDashboard.html' : 'dashboard.html';
    } else {
      document.getElementById('loginMessage').textContent = data.message || 'Login failed';
    }
  } catch (error) {
    console.error('Login error:', error);
    document.getElementById('loginMessage').textContent = 'An error occurred: ' + error.message;
  }
});

// Handle registration submission.
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const regRole = document.querySelector('input[name="regRole"]:checked').value;
  
  let membershipType = null;
  let interests = {};
  if (regRole === 'member') {
    membershipType = document.getElementById('membershipType').value;
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    interestCheckboxes.forEach(checkbox => {
      interests[checkbox.value] = 1;
    });
    ['caring', 'sharing', 'creating', 'experiencing', 'working'].forEach(interest => {
      if (!(interest in interests)) {
        interests[interest] = 0;
      }
    });
  }
  
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: regRole, membershipType, interests })
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById('registerMessage').textContent = data.message;
    } else {
      document.getElementById('registerMessage').textContent = data.message || 'Registration failed';
    }
  } catch (error) {
    console.error('Registration error:', error);
    document.getElementById('registerMessage').textContent = 'An error occurred: ' + error.message;
  }
});
