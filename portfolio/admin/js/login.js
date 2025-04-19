// Admin Login JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication (in a real app, this would be server-side)
            // For demo purposes, we're using a hardcoded admin/admin123
            if (username === 'admin' && password === 'admin123') {
                // Set session storage to indicate logged in state
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error message
                loginError.textContent = 'Invalid username or password';
                
                // Clear password field
                document.getElementById('password').value = '';
            }
        });
    }
    
    // Check if user is already logged in
    const checkAuth = () => {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        // If on login page but already logged in, redirect to dashboard
        if (isLoggedIn && window.location.pathname.includes('index.html')) {
            window.location.href = 'dashboard.html';
        }
        
        // If on any admin page but not logged in, redirect to login
        if (!isLoggedIn && !window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    };
    
    // Call auth check
    checkAuth();
}); 