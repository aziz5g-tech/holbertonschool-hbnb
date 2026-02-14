// ===================================================================
// HBnB - Login Page JavaScript
// Task 1: Login Functionality
// ===================================================================

/**
 * This file handles login functionality including:
 * - Form submission handling
 * - API authentication request
 * - JWT token storage in cookies
 * - Error handling and validation
 * - Redirect after successful login
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api/v1';

// ===================================================================
// Cookie Management Functions
// ===================================================================

/**
 * Set a cookie with name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    console.log(`Cookie set: ${name}`);
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
    console.log(`Cookie deleted: ${name}`);
}

// ===================================================================
// Authentication Functions
// ===================================================================

/**
 * Check if user is already logged in
 * If logged in, redirect to index page
 */
function checkIfLoggedIn() {
    const token = getCookie('token');
    if (token) {
        console.log('User already logged in, redirecting to index...');
        window.location.href = 'index.html';
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Get form elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('errorMessage');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    // Get values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous errors
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
    
    // Client-side validation
    if (!email || !password) {
        showError(errorMessageDiv, 'Please enter both email and password.');
        return;
    }
    
    if (!validateEmail(email)) {
        showError(errorMessageDiv, 'Please enter a valid email address.');
        return;
    }
    
    if (password.length < 6) {
        showError(errorMessageDiv, 'Password must be at least 6 characters long.');
        return;
    }
    
    // Show loading state
    setLoadingState(btnText, btnSpinner, submitBtn, true);
    
    try {
        // Make API request
        console.log('Attempting login for:', email);
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            }),
        });
        
        // Parse response
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            console.log('Login successful!');
            
            // Store JWT token in cookie (expires in 1 day)
            setCookie('token', data.access_token, 1);
            
            // Store user info in localStorage for easy access
            if (data.user) {
                localStorage.setItem('user_info', JSON.stringify({
                    id: data.user.id,
                    email: data.user.email,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    is_admin: data.user.is_admin
                }));
            }
            
            // Show success message briefly
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to main page after brief delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
            
        } else {
            // Login failed
            console.error('Login failed:', response.status, data);
            
            // Handle specific error messages
            let errorMessage = 'Login failed. Please check your credentials and try again.';
            
            if (response.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (response.status === 400) {
                errorMessage = data.message || 'Invalid request. Please check your input.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (data.message) {
                errorMessage = data.message;
            }
            
            showError(errorMessageDiv, errorMessage);
        }
        
    } catch (error) {
        // Network error or other exception
        console.error('Login error:', error);
        
        let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Cannot connect to the API server. Please ensure the backend is running on ' + API_BASE_URL;
        }
        
        showError(errorMessageDiv, errorMessage);
        
    } finally {
        // Reset loading state
        setLoadingState(btnText, btnSpinner, submitBtn, false);
    }
}

// ===================================================================
// UI Helper Functions
// ===================================================================

/**
 * Show error message
 * @param {HTMLElement} element - Error message container
 * @param {string} message - Error message to display
 */
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.classList.remove('hidden');
    
    // Scroll to error message
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const errorMessageDiv = document.getElementById('errorMessage');
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.classList.remove('hidden');
        errorMessageDiv.style.backgroundColor = '#E0F2F1';
        errorMessageDiv.style.color = '#008489';
        errorMessageDiv.style.borderLeftColor = '#008489';
    }
}

/**
 * Set loading state for submit button
 * @param {HTMLElement} btnText - Button text element
 * @param {HTMLElement} btnSpinner - Button spinner element
 * @param {HTMLElement} submitBtn - Submit button element
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(btnText, btnSpinner, submitBtn, isLoading) {
    if (isLoading) {
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        btnSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
        btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// ===================================================================
// Event Listeners & Initialization
// ===================================================================

/**
 * Initialize the login page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded');
    
    // Check if user is already logged in
    checkIfLoggedIn();
    
    // Get login form
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }
    
    // Add submit event listener
    loginForm.addEventListener('submit', handleLogin);
    
    console.log('Login form event listener attached');
    
    // Add Enter key support for form submission
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        [emailInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    loginForm.dispatchEvent(new Event('submit'));
                }
            });
        });
    }
    
    // Clear any existing error messages on input
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorMessageDiv = document.getElementById('errorMessage');
            if (errorMessageDiv && errorMessageDiv.style.display !== 'none') {
                errorMessageDiv.style.display = 'none';
            }
        });
    });
});

// Log API URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Login endpoint:', `${API_BASE_URL}/users/login`);
