// ===================================================================
// HBnB - Index Page JavaScript
// Task 2: List of Places Functionality
// ===================================================================

/**
 * This file handles the main page functionality including:
 * - Fetching places from API
 * - Displaying places dynamically
 * - Filtering places by price
 * - Authentication check
 * - User info display
 * - Logout functionality
 */

// ===================================================================
// Configuration
// ===================================================================

const API_BASE_URL = 'http://localhost:5001/api/v1';
const PLACES_ENDPOINT = `${API_BASE_URL}/places/`;

// Global variable to store all places for filtering
let allPlaces = [];

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
// Authentication Functions
// ===================================================================

/**
 * Check if user is authenticated and update UI accordingly
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginButton = document.getElementById('loginButton');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (!token) {
        // User not authenticated - show login button
        if (loginButton) loginButton.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userInfo) userInfo.classList.add('hidden');
        
        // Still fetch places (public access)
        fetchPlaces();
    } else {
        // User authenticated - hide login, show logout
        if (loginButton) loginButton.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        // Display user info
        displayUserInfo();
        
        // Fetch places with authentication
        fetchPlaces(token);
    }
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
    // Delete token cookie
    deleteCookie('token');
    
    // Clear localStorage
    localStorage.removeItem('user_info');
    
    // Show success message
    alert('You have been logged out successfully');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// ===================================================================
// Places Data Fetching
// ===================================================================

/**
 * Fetch places from API
 * @param {string} token - Optional JWT token for authenticated requests
 */
async function fetchPlaces(token = null) {
    const placesSection = document.getElementById('placesSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    
    // Show loading spinner
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    
    try {
        // Prepare request headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add authorization header if token provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Make API request
        const response = await fetch(PLACES_ENDPOINT, {
            method: 'GET',
            headers: headers
        });
        
        // Handle response
        if (!response.ok) {
            if (response.status === 401) {
                // Token invalid or expired - clear and redirect
                deleteCookie('token');
                localStorage.removeItem('user_info');
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(`Failed to fetch places: ${response.status} ${response.statusText}`);
        }
        
        // Parse response data
        const places = await response.json();
        
        // Store places globally for filtering
        allPlaces = places;
        
        // Display places
        displayPlaces(places);
        
    } catch (error) {
        console.error('Error fetching places:', error);
        
        // Show error message
        if (errorMessage) {
            errorMessage.textContent = error.message || 'Failed to load places. Please try again later.';
            errorMessage.classList.remove('hidden');
        }
        
        // Hide places section
        if (placesSection) {
            placesSection.innerHTML = '';
        }
    } finally {
        // Hide loading spinner
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
}

// ===================================================================
// Display Functions
// ===================================================================

/**
 * Display places in the grid
 * @param {Array} places - Array of place objects
 */
function displayPlaces(places) {
    const placesSection = document.getElementById('placesSection');
    
    if (!placesSection) {
        console.error('Places section not found');
        return;
    }
    
    // Clear existing content
    placesSection.innerHTML = '';
    
    // Check if places array is empty
    if (!places || places.length === 0) {
        placesSection.innerHTML = '<p class="no-results">No places found. Check back later!</p>';
        return;
    }
    
    // Create and append place cards
    places.forEach(place => {
        const placeCard = createPlaceCard(place);
        placesSection.appendChild(placeCard);
    });
}

/**
 * Create a place card element
 * @param {Object} place - Place data object
 * @returns {HTMLElement} The place card element
 */
function createPlaceCard(place) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'place-card';
    card.setAttribute('data-price', place.price || place.price_per_night || 0);
    card.onclick = () => window.location.href = `place.html?id=${place.id}`;
    
    // Extract place data with fallbacks
    const title = place.title || place.name || 'Unnamed Place';
    const price = parseFloat(place.price || place.price_per_night || 0).toFixed(2);
    const description = place.description || 'No description available';
    const location = place.city || place.location || place.country || 'Location not specified';
    const placeId = place.id || '';
    
    // Choose emoji based on price or random
    const emojis = ['🏠', '🏡', '🏢', '🏖️', '🏔️', '🏰', '🏝️', '🏕️'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Build card HTML
    card.innerHTML = `
        <div class="place-card-image">
            ${emoji}
        </div>
        <h3>${escapeHtml(title)}</h3>
        <div class="price">
            $${price} <span class="price-label">/ night</span>
        </div>
        <p class="description">
            ${escapeHtml(description.substring(0, 150))}${description.length > 150 ? '...' : ''}
        </p>
        <p class="location">📍 ${escapeHtml(location)}</p>
        <a href="place.html?id=${placeId}" class="details-button" onclick="event.stopPropagation()">View Details</a>
    `;
    
    return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================================================
// Filtering Functions
// ===================================================================

/**
 * Filter places by price
 * @param {string} maxPrice - Maximum price ('all', '10', '50', '100')
 */
function filterPlacesByPrice(maxPrice) {
    const placesSection = document.getElementById('placesSection');
    
    if (!placesSection) return;
    
    // Get all place cards
    const placeCards = placesSection.querySelectorAll('.place-card');
    
    if (maxPrice === 'all') {
        // Show all places
        placeCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Filter by price
        const maxPriceValue = parseFloat(maxPrice);
        
        placeCards.forEach(card => {
            const cardPrice = parseFloat(card.getAttribute('data-price'));
            
            if (cardPrice <= maxPriceValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Check if any places are visible
    const visibleCards = Array.from(placeCards).filter(card => card.style.display !== 'none');
    
    // Remove existing "no results" messages first
    const existingNoResults = placesSection.querySelectorAll('.no-results');
    existingNoResults.forEach(msg => msg.remove());
    
    if (visibleCards.length === 0 && placeCards.length > 0) {
        // Only show message if there are places but none match filter
        const noResultsMsg = document.createElement('p');
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No places found matching your filter.';
        placesSection.appendChild(noResultsMsg);
    }
}

/**
 * Setup price filter event listener
 */
function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            filterPlacesByPrice(selectedPrice);
        });
    }
}

// ===================================================================
// Page Initialization
// ===================================================================

/**
 * Initialize the page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Index page loaded - Task 2 implemented');
    
    // Check authentication and load places
    checkAuthentication();
    
    // Setup price filter
    setupPriceFilter();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
