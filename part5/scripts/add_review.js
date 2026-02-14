// ===================================================================
// HBnB - Add Review Page JavaScript
// Task 4: Add Review Functionality Implementation
// ===================================================================

/**
 * This file handles add review functionality including:
 * - Authentication verification (redirect if not logged in)
 * - Form submission handling
 * - API review creation request
 * - Form validation
 * - Error handling
 * - Redirect after successful submission
 * - Place title fetching
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api/v1';

// ===================================================================
// Cookie Management Functions
// ===================================================================

/**
 * Get cookie value by name
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
 * Delete cookie by name
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ===================================================================
// URL Parameter Extraction
// ===================================================================

/**
 * Extract place_id from URL query parameters
 * @returns {string|null} Place ID or null if not found
 */
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('place_id');
}

// ===================================================================
// Authentication Management
// ===================================================================

/**
 * Check if user is authenticated
 * Redirects to index.html if not authenticated
 * @returns {string|null} JWT token if authenticated, redirects otherwise
 */
function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        // Not authenticated, redirect to index page
        console.log('User not authenticated, redirecting to index.html');
        window.location.href = 'index.html';
        return null;
    }
    return token;
}

/**
 * Display user information in the header
 */
function displayUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    const userInfoElement = document.getElementById('userInfo');
    
    if (userInfo && userInfoElement) {
        try {
            const user = JSON.parse(userInfo);
            userInfoElement.textContent = `Welcome, ${user.first_name || 'User'}!`;
        } catch (error) {
            console.error('Error parsing user info:', error);
            userInfoElement.textContent = 'Welcome, User!';
        }
    }
}

/**
 * Get user ID from localStorage
 * @returns {string|null} User ID or null if not found
 */
function getUserId() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            const user = JSON.parse(userInfo);
            return user.id;
        } catch (error) {
            console.error('Error parsing user info:', error);
            return null;
        }
    }
    return null;
}

// ===================================================================
// API Functions
// ===================================================================

/**
 * Fetch place title from API
 * @param {string} placeId - Place ID
 * @param {string} token - JWT token
 * @returns {Promise<string|null>} Place title or null if failed
 */
async function fetchPlaceTitle(placeId, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const place = await response.json();
            return place.title || place.name || 'this place';
        } else {
            console.error('Failed to fetch place title:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching place title:', error);
        return null;
    }
}

/**
 * Submit review to API
 * @param {string} token - JWT token
 * @param {string} placeId - Place ID
 * @param {string} userId - User ID
 * @param {number} rating - Rating (1-5)
 * @param {string} reviewText - Review text
 * @returns {Promise<Object>} Response object with success status and message
 */
async function submitReview(token, placeId, userId, rating, reviewText) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                place_id: placeId,
                user_id: userId,
                rating: parseInt(rating),
                text: reviewText
            })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: 'Review submitted successfully!',
                data: data
            };
        } else {
            // Handle specific error cases
            let errorMessage = 'Failed to submit review. ';
            
            if (response.status === 401) {
                errorMessage += 'Your session has expired. Please log in again.';
            } else if (response.status === 403) {
                errorMessage += data.message || 'You cannot review your own place or you have already reviewed this place.';
            } else if (response.status === 404) {
                errorMessage += 'Place not found.';
            } else if (response.status === 400) {
                errorMessage += data.message || 'Invalid input data.';
            } else {
                errorMessage += data.message || 'Please try again.';
            }

            return {
                success: false,
                message: errorMessage,
                status: response.status
            };
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection and try again.'
        };
    }
}

// ===================================================================
// UI Functions
// ===================================================================

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    if (successElement) {
        successElement.classList.add('hidden');
    }
    
    // Scroll to error message
    errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
    }
    
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
    
    // Scroll to success message
    successElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Hide all messages
 */
function hideMessages() {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    errorElement?.classList.add('hidden');
    successElement?.classList.add('hidden');
}

/**
 * Set loading state for submit button
 * @param {boolean} loading - Loading state
 */
function setLoadingState(loading) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    
    if (submitBtn) {
        submitBtn.disabled = loading;
    }
    
    if (loading) {
        btnText?.classList.add('hidden');
        btnSpinner?.classList.remove('hidden');
    } else {
        btnText?.classList.remove('hidden');
        btnSpinner?.classList.add('hidden');
    }
}

// ===================================================================
// Form Validation
// ===================================================================

/**
 * Validate review form
 * @param {number} rating - Rating value
 * @param {string} reviewText - Review text
 * @returns {Object} Validation result with valid flag and message
 */
function validateForm(rating, reviewText) {
    // Check rating
    if (!rating || rating < 1 || rating > 5) {
        return {
            valid: false,
            message: 'Please select a rating between 1 and 5 stars.'
        };
    }
    
    // Check review text
    if (!reviewText || reviewText.trim().length < 10) {
        return {
            valid: false,
            message: 'Review text must be at least 10 characters long.'
        };
    }
    
    if (reviewText.length > 1000) {
        return {
            valid: false,
            message: 'Review text must not exceed 1000 characters.'
        };
    }
    
    return { valid: true };
}

// ===================================================================
// Form Handling
// ===================================================================

/**
 * Handle review form submission
 * @param {Event} event - Form submit event
 * @param {string} token - JWT token
 * @param {string} placeId - Place ID
 * @param {string} userId - User ID
 */
async function handleReviewSubmit(event, token, placeId, userId) {
    event.preventDefault();
    
    // Hide previous messages
    hideMessages();
    
    // Get form values
    const rating = document.getElementById('rating')?.value;
    const reviewText = document.getElementById('reviewText')?.value;
    
    // Validate form
    const validation = validateForm(rating, reviewText);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Check if we have user ID
    if (!userId) {
        showError('User information not found. Please log in again.');
        setTimeout(() => {
            deleteCookie('token');
            localStorage.removeItem('userInfo');
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Set loading state
    setLoadingState(true);
    
    // Submit review
    const result = await submitReview(token, placeId, userId, rating, reviewText.trim());
    
    // Remove loading state
    setLoadingState(false);
    
    // Handle result
    if (result.success) {
        showSuccess(result.message);
        
        // Clear form
        document.getElementById('reviewForm')?.reset();
        document.getElementById('currentCount').textContent = '0';
        
        // Redirect to place details page after 2 seconds
        setTimeout(() => {
            window.location.href = `place.html?id=${placeId}`;
        }, 2000);
    } else {
        showError(result.message);
        
        // If unauthorized, redirect to login after 3 seconds
        if (result.status === 401) {
            setTimeout(() => {
                deleteCookie('token');
                localStorage.removeItem('userInfo');
                window.location.href = 'login.html';
            }, 3000);
        }
    }
}

/**
 * Handle cancel button click
 */
function handleCancel() {
    const placeId = getPlaceIdFromURL();
    if (placeId) {
        window.location.href = `place.html?id=${placeId}`;
    } else {
        window.location.href = 'index.html';
    }
}

// ===================================================================
// Page Initialization
// ===================================================================

/**
 * Initialize the add review page
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Add review page initialized');
    
    // Check authentication (will redirect if not authenticated)
    const token = checkAuthentication();
    if (!token) {
        return; // Will redirect, so stop execution
    }
    
    // Get place ID from URL
    const placeId = getPlaceIdFromURL();
    if (!placeId) {
        showError('Place ID not found in URL. Redirecting to home page...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Get user ID
    const userId = getUserId();
    if (!userId) {
        showError('User information not found. Please log in again.');
        setTimeout(() => {
            deleteCookie('token');
            localStorage.removeItem('userInfo');
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Display user info
    displayUserInfo();
    
    // Fetch and display place title
    const placeTitle = await fetchPlaceTitle(placeId, token);
    if (placeTitle) {
        const placeTitleElement = document.getElementById('placeTitle');
        if (placeTitleElement) {
            placeTitleElement.textContent = `Share your experience at ${placeTitle}`;
        }
    }
    
    // Setup form event listener
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            handleReviewSubmit(event, token, placeId, userId);
        });
    }
    
    // Setup cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }
    
    // Add real-time validation feedback
    const ratingSelect = document.getElementById('rating');
    const reviewTextarea = document.getElementById('reviewText');
    
    // Rating change handler
    if (ratingSelect) {
        ratingSelect.addEventListener('change', () => {
            if (ratingSelect.value) {
                ratingSelect.classList.remove('error');
            }
        });
    }
    
    // Review text input handler (for visual feedback)
    if (reviewTextarea) {
        reviewTextarea.addEventListener('input', () => {
            const length = reviewTextarea.value.length;
            if (length >= 10 && length <= 1000) {
                reviewTextarea.classList.remove('error');
            }
        });
    }
});
