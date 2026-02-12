// ===================================================================
// HBnB - Place Details Page JavaScript
// Task 3: Place Details Functionality
// ===================================================================

/**
 * This file handles place details page functionality including:
 * - Fetching place details by ID
 * - Displaying place information
 * - Displaying host information
 * - Displaying amenities
 * - Displaying reviews
 * - Authentication check for add review button
 * - URL parameter parsing
 */

// ===================================================================
// Configuration
// ===================================================================

const API_BASE_URL = 'http://localhost:5001/api/v1';

// Global variable to store place ID
let currentPlaceId = null;

// ===================================================================
// Cookie Management Functions
// ===================================================================

/**
 * Get cookie value by name
 * @param {string} name - The cookie name
 * @returns {string|null} The cookie value or null if not found
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
 * @param {string} name - The cookie name
 */
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

// ===================================================================
// URL Parameter Functions
// ===================================================================

/**
 * Get place ID from URL query parameters
 * @returns {string|null} The place ID or null if not found
 */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ===================================================================
// Authentication Functions
// ===================================================================

/**
 * Check if user is authenticated and update UI accordingly
 * @returns {string|null} JWT token if authenticated, null otherwise
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginButton = document.getElementById('loginButton');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const addReviewBtn = document.getElementById('addReviewBtn');
    
    if (!token) {
        // User not authenticated
        if (loginButton) loginButton.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userInfo) userInfo.classList.add('hidden');
        if (addReviewBtn) addReviewBtn.classList.add('hidden');
    } else {
        // User authenticated
        if (loginButton) loginButton.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (addReviewBtn) addReviewBtn.classList.remove('hidden');
        
        // Display user info
        displayUserInfo();
    }
    
    return token;
}

/**
 * Display user information from localStorage
 */
function displayUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const userDataStr = localStorage.getItem('user_info');
    
    if (userDataStr && userInfo) {
        try {
            const userData = JSON.parse(userDataStr);
            const firstName = userData.first_name || userData.email.split('@')[0];
            userInfo.textContent = `Welcome, ${firstName}!`;
            userInfo.classList.remove('hidden');
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
    }
}

/**
 * Logout function - clear token and user info
 */
function logout() {
    deleteCookie('token');
    localStorage.removeItem('user_info');
    alert('You have been logged out successfully');
    window.location.href = 'login.html';
}

// ===================================================================
// API Data Fetching
// ===================================================================

/**
 * Fetch place details from API
 * @param {string} placeId - The place ID
 * @param {string|null} token - Optional JWT token
 */
async function fetchPlaceDetails(placeId, token = null) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const placeDetails = document.getElementById('placeDetails');
    
    // Show loading spinner
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    if (placeDetails) placeDetails.style.display = 'none';
    
    try {
        // Prepare request headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add authorization header if token provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch place details
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Place not found');
            }
            if (response.status === 401) {
                deleteCookie('token');
                localStorage.removeItem('user_info');
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(`Failed to fetch place details: ${response.status}`);
        }
        
        const place = await response.json();
        
        // Display place details
        displayPlaceDetails(place);
        
        // Fetch reviews separately
        await fetchPlaceReviews(placeId, token);
        
        // Show place details section
        if (placeDetails) placeDetails.style.display = 'block';
        
    } catch (error) {
        console.error('Error fetching place details:', error);
        
        // Show error message
        if (errorMessage) {
            errorMessage.textContent = error.message || 'Failed to load place details. Please try again later.';
            errorMessage.classList.remove('hidden');
        }
        
        // Hide place details
        if (placeDetails) placeDetails.style.display = 'none';
    } finally {
        // Hide loading spinner
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
}

/**
 * Fetch reviews for a place
 * @param {string} placeId - The place ID
 * @param {string|null} token - Optional JWT token
 */
async function fetchPlaceReviews(placeId, token = null) {
    try {
        // Prepare request headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch reviews
        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
            method: 'GET',
            headers: headers
        });
        
        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        } else {
            // If endpoint doesn't exist or returns error, show no reviews
            console.warn('Could not fetch reviews:', response.status);
            displayReviews([]);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        displayReviews([]);
    }
}

// ===================================================================
// Display Functions
// ===================================================================

/**
 * Display place details on the page
 * @param {Object} place - Place data object
 */
function displayPlaceDetails(place) {
    // Update page title
    document.title = `HBnB - ${place.title || place.name || 'Place Details'}`;
    
    // Display place title
    const placeTitle = document.getElementById('placeTitle');
    if (placeTitle) {
        placeTitle.textContent = place.title || place.name || 'Unnamed Place';
    }
    
    // Display price
    const placePrice = document.querySelector('.place-price');
    if (placePrice && place.price !== undefined) {
        const price = parseFloat(place.price || place.price_per_night || 0).toFixed(2);
        placePrice.innerHTML = `$${price} <span class="place-price-label">/ night</span>`;
    }
    
    // Display description
    const placeDescription = document.getElementById('placeDescription');
    if (placeDescription) {
        placeDescription.textContent = place.description || 'No description available.';
    }
    
    // Display location
    const placeLocation = document.getElementById('placeLocation');
    if (placeLocation) {
        const lat = place.latitude || 'N/A';
        const lon = place.longitude || 'N/A';
        const city = place.city || '';
        const country = place.country || '';
        
        placeLocation.innerHTML = `
            <strong>Coordinates:</strong><br>
            Latitude: ${lat}<br>
            Longitude: ${lon}
            ${city ? `<p style="margin-top: 1rem;"><strong>📍 City:</strong> ${escapeHtml(city)}</p>` : ''}
            ${country ? `<p><strong>Country:</strong> ${escapeHtml(country)}</p>` : ''}
        `;
    }
    
    // Display host information
    const hostInfo = document.getElementById('hostInfo');
    if (hostInfo && place.owner) {
        const host = place.owner;
        const memberSince = host.created_at ? new Date(host.created_at).getFullYear() : 'N/A';
        
        hostInfo.innerHTML = `
            <p><strong>Host:</strong> ${escapeHtml(host.first_name)} ${escapeHtml(host.last_name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(host.email)}</p>
            <p><strong>Member since:</strong> ${memberSince}</p>
        `;
    }
    
    // Display amenities
    const amenitiesList = document.getElementById('amenitiesList');
    if (amenitiesList) {
        if (place.amenities && place.amenities.length > 0) {
            amenitiesList.innerHTML = '';
            place.amenities.forEach(amenity => {
                const amenityTag = document.createElement('span');
                amenityTag.className = 'amenity-tag';
                amenityTag.textContent = amenity.name || amenity;
                amenitiesList.appendChild(amenityTag);
            });
        } else {
            amenitiesList.innerHTML = '<p>No amenities listed.</p>';
        }
    }
}

/**
 * Display reviews on the page
 * @param {Array} reviews - Array of review objects
 */
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');
    
    if (!reviewsList) return;
    
    // Clear existing reviews
    reviewsList.innerHTML = '';
    
    if (!reviews || reviews.length === 0) {
        // Show no reviews message
        if (noReviews) noReviews.classList.remove('hidden');
    } else {
        // Hide no reviews message
        if (noReviews) noReviews.classList.add('hidden');
        
        // Create review cards
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsList.appendChild(reviewCard);
        });
    }
}

/**
 * Create a review card element
 * @param {Object} review - Review data object
 * @returns {HTMLElement} The review card element
 */
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    // Format rating as stars
    const rating = review.rating || 0;
    const stars = '⭐'.repeat(Math.min(Math.max(rating, 0), 5));
    
    // Format date
    let dateStr = 'N/A';
    if (review.created_at) {
        try {
            const date = new Date(review.created_at);
            dateStr = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error('Error parsing date:', e);
        }
    }
    
    // Get reviewer name
    const reviewerName = review.user ? 
        `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim() || 
        review.user.email || 'Anonymous' : 
        'Anonymous';
    
    card.innerHTML = `
        <div class="review-header">
            <span class="review-author">${escapeHtml(reviewerName)}</span>
            <span class="review-rating">${stars}</span>
        </div>
        <p class="review-text">
            ${escapeHtml(review.text || review.comment || 'No comment provided.')}
        </p>
        <p class="review-date">${dateStr}</p>
    `;
    
    return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// ===================================================================
// Navigation Functions
// ===================================================================

/**
 * Navigate to add review page
 */
function goToAddReview() {
    if (currentPlaceId) {
        window.location.href = `add_review.html?place_id=${currentPlaceId}`;
    }
}

// ===================================================================
// Page Initialization
// ===================================================================

/**
 * Initialize the page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Place details page loaded - Task 3 implemented');
    
    // Get place ID from URL
    currentPlaceId = getPlaceIdFromURL();
    
    if (!currentPlaceId) {
        // No place ID in URL - show error and redirect
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = 'No place ID provided. Redirecting to home page...';
            errorMessage.classList.remove('hidden');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Check authentication
    const token = checkAuthentication();
    
    // Fetch and display place details
    fetchPlaceDetails(currentPlaceId, token);
    
    // Setup event listeners
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add review button
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', goToAddReview);
    }
});
