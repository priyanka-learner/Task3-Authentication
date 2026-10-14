const API_URL = '/api';

// Display messages safely
function showMessage(element, message, type = 'error') {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`;
}

// Login Form
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const message = document.getElementById('loginMessage');
        const button = document.getElementById('loginButton');

        showMessage(message, '');

        button.disabled = true;
        button.textContent = 'Logging in...';

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            // Store token for this browser session
            sessionStorage.setItem('authToken', data.token);

            showMessage(message, 'Login successful!', 'success');

            window.location.href = 'dashboard.html';

        } catch (error) {
            showMessage(message, error.message);
        } finally {
            button.disabled = false;
            button.textContent = 'Login';
        }
    });
}

// Registration Form
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        const message = document.getElementById('registerMessage');
        const button = document.getElementById('registerButton');

        showMessage(message, '');

        button.disabled = true;
        button.textContent = 'Creating account...';

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            showMessage(message, data.message, 'success');

            registerForm.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            showMessage(message, error.message);
        } finally {
            button.disabled = false;
            button.textContent = 'Create Account';
        }
    });
}

// Protected Dashboard
const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        window.location.replace('index.html');
    } else {
        loadDashboard(token);
    }

    async function loadDashboard(token) {
        const message = document.getElementById('dashboardMessage');

        try {
            const response = await fetch(`${API_URL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                sessionStorage.removeItem('authToken');
                window.location.replace('index.html');
                return;
            }

            document.getElementById('dashboardUsername').textContent =
                data.user.username;

            document.getElementById('profileUsername').textContent =
                data.user.username;

            document.getElementById('profileEmail').textContent =
                data.user.email;

            document.getElementById('profileId').textContent =
                data.user.id;

            showMessage(message, data.message, 'success');

        } catch (error) {
            showMessage(
                message,
                'Unable to connect to the server. Please try again.'
            );
        }
    }

    // Logout
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('authToken');
        window.location.replace('index.html');
    });
}