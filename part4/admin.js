// API Base URL - Make sure this matches your backend
const API_BASE_URL = 'http://127.0.0.1:5001/api/v1';

// Admin token storage
let adminToken = null;
let currentUserId = null;
let isAdmin = false;

// Cookie utility functions
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Decode JWT to get user info
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// Show alert message
function showAlert(elementId, message, type = 'success') {
    // Handle tab-specific alerts
    let alertElement = null;
    if (elementId === 'reviews-tab') {
        alertElement = document.getElementById('reviews-alerts');
    } else {
        alertElement = document.getElementById(elementId);
    }
    
    if (!alertElement) {
        // Fallback: try to insert at the beginning of the tab
        const tab = document.getElementById(elementId);
        if (tab) {
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            tab.insertBefore(alertDiv, tab.firstChild);
            setTimeout(() => alertDiv.remove(), 5000);
        }
        return;
    }
    
    alertElement.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alertElement.innerHTML = '';
    }, 5000);
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('admin_token');
    if (token) {
        adminToken = token;
        const decoded = parseJwt(token);
        if (decoded) {
            currentUserId = decoded.sub;
            isAdmin = decoded.is_admin || false;
            
            // Check if user is actually an admin
            if (!isAdmin) {
                alert('Access denied: Admin privileges required');
                deleteCookie('admin_token');
                return;
            }
            showAdminPanel();
        }
    }

    // Admin login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    // Create user form
    const createUserForm = document.getElementById('create-user-form');
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleCreateUser);
    }

    // Create amenity form
    const createAmenityForm = document.getElementById('create-amenity-form');
    if (createAmenityForm) {
        createAmenityForm.addEventListener('submit', handleCreateAmenity);
    }

    // Create place form
    const createPlaceForm = document.getElementById('create-place-form');
    if (createPlaceForm) {
        createPlaceForm.addEventListener('submit', handleCreatePlace);
    }
});

// Handle admin login
async function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            adminToken = data.access_token;
            
            // Decode token to check if user is admin
            const decoded = parseJwt(adminToken);
            if (decoded) {
                currentUserId = decoded.sub;
                isAdmin = decoded.is_admin || false;
                
                if (!isAdmin) {
                    showAlert('login-message', 'Access denied: Admin privileges required', 'error');
                    return;
                }
                
                setCookie('admin_token', adminToken);
                showAdminPanel();
            }
        } else {
            const error = await response.json();
            showAlert('login-message', error.message || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('login-message', 'Connection error: ' + error.message, 'error');
    }
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    
    // Load initial data
    loadUsers();
    loadAmenities();
    loadPlaces();
    loadReviews();
    loadUsersForSelect();
    loadAmenitiesForSelect();
}

// Admin logout
function adminLogout() {
    deleteCookie('admin_token');
    adminToken = null;
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-login-form').reset();
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ==================== USERS ====================

// Load all users
async function loadUsers() {
    const listElement = document.getElementById('users-list');
    listElement.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            listElement.innerHTML = '<p>Failed to load users</p>';
        }
    } catch (error) {
        listElement.innerHTML = '<p>Error loading users</p>';
    }
}

// Display users
function displayUsers(users) {
    const listElement = document.getElementById('users-list');
    
    if (!users || users.length === 0) {
        listElement.innerHTML = '<p>No users found</p>';
        return;
    }

    listElement.innerHTML = '';
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>${user.first_name} ${user.last_name} ${user.is_admin ? '👑' : ''}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.is_admin ? 'Admin' : 'User'}</p>
            <p class="item-id">ID: ${user.id}</p>
        `;
        listElement.appendChild(card);
    });
}

// Handle create user
async function handleCreateUser(event) {
    event.preventDefault();
    
    const userData = {
        first_name: document.getElementById('user-first-name').value,
        last_name: document.getElementById('user-last-name').value,
        email: document.getElementById('user-email').value,
        password: document.getElementById('user-password').value,
        is_admin: document.getElementById('user-is-admin').checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showAlert('users-tab', 'User created successfully!', 'success');
            event.target.reset();
            loadUsers();
            loadUsersForSelect();
        } else {
            const error = await response.json();
            showAlert('users-tab', 'Error: ' + (error.message || 'Failed to create user'), 'error');
        }
    } catch (error) {
        showAlert('users-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Load users for select dropdown
async function loadUsersForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            const select = document.getElementById('place-owner');
            select.innerHTML = '<option value="">Select owner...</option>';
            
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.first_name} ${user.last_name} (${user.email})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading users for select:', error);
    }
}

// ==================== AMENITIES ====================

// Load all amenities
async function loadAmenities() {
    const listElement = document.getElementById('amenities-list');
    listElement.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/amenities/`);

        if (response.ok) {
            const amenities = await response.json();
            displayAmenities(amenities);
        } else {
            listElement.innerHTML = '<p>Failed to load amenities</p>';
        }
    } catch (error) {
        listElement.innerHTML = '<p>Error loading amenities</p>';
    }
}

// Display amenities
function displayAmenities(amenities) {
    const listElement = document.getElementById('amenities-list');
    
    if (!amenities || amenities.length === 0) {
        listElement.innerHTML = '<p>No amenities found</p>';
        return;
    }

    listElement.innerHTML = '';
    amenities.forEach(amenity => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>${amenity.name}</h3>
            <p class="item-id">ID: ${amenity.id}</p>
            <button onclick="editAmenity('${amenity.id}', '${amenity.name}')" style="margin-top: 10px; padding: 5px 10px; background: #795548; color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
        `;
        listElement.appendChild(card);
    });
}

// Handle create amenity
async function handleCreateAmenity(event) {
    event.preventDefault();
    
    const amenityData = {
        name: document.getElementById('amenity-name').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/amenities/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(amenityData)
        });

        if (response.ok) {
            showAlert('amenities-tab', 'Amenity created successfully!', 'success');
            event.target.reset();
            loadAmenities();
            loadAmenitiesForSelect();
        } else {
            const error = await response.json();
            showAlert('amenities-tab', 'Error: ' + (error.message || 'Failed to create amenity'), 'error');
        }
    } catch (error) {
        showAlert('amenities-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Edit amenity
function editAmenity(amenityId, currentName) {
    const newName = prompt('Edit Amenity Name:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
        updateAmenity(amenityId, newName.trim());
    }
}

// Update amenity
async function updateAmenity(amenityId, newName) {
    try {
        const response = await fetch(`${API_BASE_URL}/amenities/${amenityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ name: newName })
        });

        if (response.ok) {
            showAlert('amenities-tab', 'Amenity updated successfully!', 'success');
            loadAmenities();
            loadAmenitiesForSelect();
        } else {
            const error = await response.json();
            showAlert('amenities-tab', 'Error: ' + (error.message || 'Failed to update amenity'), 'error');
        }
    } catch (error) {
        showAlert('amenities-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Load amenities for select dropdown
async function loadAmenitiesForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/amenities/`);

        if (response.ok) {
            const amenities = await response.json();
            const select = document.getElementById('place-amenities');
            select.innerHTML = '';
            
            amenities.forEach(amenity => {
                const option = document.createElement('option');
                option.value = amenity.id;
                option.textContent = amenity.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading amenities for select:', error);
    }
}

// ==================== PLACES ====================

// Load all places
async function loadPlaces() {
    const listElement = document.getElementById('places-list');
    listElement.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/places/`);

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            listElement.innerHTML = '<p>Failed to load places</p>';
        }
    } catch (error) {
        listElement.innerHTML = '<p>Error loading places</p>';
    }
}

// Display places
function displayPlaces(places) {
    const listElement = document.getElementById('places-list');
    
    if (!places || places.length === 0) {
        listElement.innerHTML = '<p>No places found</p>';
        return;
    }

    listElement.innerHTML = '';
    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'item-card';
        const amenitiesStr = place.amenities && place.amenities.length > 0 
            ? place.amenities.map(a => a.name).join(', ') 
            : 'None';
        card.innerHTML = `
            <h3>${place.title}</h3>
            <p>${place.description ? place.description.substring(0, 100) + '...' : 'No description'}</p>
            <p><strong>Location:</strong> ${place.latitude}, ${place.longitude}</p>
            <p><strong>Price:</strong> $${place.price}/night</p>
            <p><strong>Owner:</strong> ${place.owner ? place.owner.first_name + ' ' + place.owner.last_name : 'Unknown'}</p>
            <p><strong>Amenities:</strong> ${amenitiesStr}</p>
            <p class="item-id">ID: ${place.id}</p>
            <button onclick="editPlace('${place.id}')" style="margin-top: 10px; padding: 5px 10px; background: #795548; color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
            <button onclick="deletePlace('${place.id}')" style="margin-top: 10px; margin-left: 5px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
        `;
        listElement.appendChild(card);
    });
}

// Handle create place
async function handleCreatePlace(event) {
    event.preventDefault();
    
    const selectedAmenities = Array.from(document.getElementById('place-amenities').selectedOptions)
        .map(option => option.value);
    
    const placeData = {
        title: document.getElementById('place-name').value,
        description: document.getElementById('place-description').value,
        latitude: parseFloat(document.getElementById('place-latitude').value) || 0.0,
        longitude: parseFloat(document.getElementById('place-longitude').value) || 0.0,
        price: parseFloat(document.getElementById('place-price').value),
        owner_id: document.getElementById('place-owner').value,
        amenities: selectedAmenities
    };

    try {
        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(placeData)
        });

        if (response.ok) {
            showAlert('places-tab', 'Place created successfully!', 'success');
            event.target.reset();
            loadPlaces();
        } else {
            const error = await response.json();
            showAlert('places-tab', 'Error: ' + (error.message || 'Failed to create place'), 'error');
        }
    } catch (error) {
        showAlert('places-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Edit place
async function editPlace(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`);
        if (!response.ok) {
            alert('Failed to load place details');
            return;
        }
        
        const place = await response.json();
        
        // Fill form with place data
        document.getElementById('place-name').value = place.title;
        document.getElementById('place-description').value = place.description || '';
        document.getElementById('place-latitude').value = place.latitude;
        document.getElementById('place-longitude').value = place.longitude;
        document.getElementById('place-price').value = place.price;
        document.getElementById('place-owner').value = place.owner_id;
        
        // Select amenities
        const amenitiesSelect = document.getElementById('place-amenities');
        Array.from(amenitiesSelect.options).forEach(option => {
            option.selected = place.amenities.some(a => a.id === option.value);
        });
        
        // Change form submit to update
        const form = document.getElementById('create-place-form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updatePlace(placeId);
        };
        
        // Add cancel button
        let cancelBtn = document.getElementById('cancel-edit-btn');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancel-edit-btn';
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel Edit';
            cancelBtn.style.cssText = 'background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 10px;';
            cancelBtn.onclick = () => {
                form.reset();
                form.onsubmit = handleCreatePlace;
                cancelBtn.remove();
                document.querySelector('#places-tab .form-section h2').textContent = 'Create New Place';
            };
            form.appendChild(cancelBtn);
        }
        
        document.querySelector('#places-tab .form-section h2').textContent = 'Edit Place';
        document.querySelector('#places-tab .form-section').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert('Error loading place: ' + error.message);
    }
}

// Update place
async function updatePlace(placeId) {
    const selectedAmenities = Array.from(document.getElementById('place-amenities').selectedOptions)
        .map(option => option.value);
    
    const placeData = {
        title: document.getElementById('place-name').value,
        description: document.getElementById('place-description').value,
        latitude: parseFloat(document.getElementById('place-latitude').value),
        longitude: parseFloat(document.getElementById('place-longitude').value),
        price: parseFloat(document.getElementById('place-price').value),
        owner_id: document.getElementById('place-owner').value,
        amenities: selectedAmenities
    };

    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(placeData)
        });

        if (response.ok) {
            showAlert('places-tab', 'Place updated successfully!', 'success');
            const form = document.getElementById('create-place-form');
            form.reset();
            form.onsubmit = handleCreatePlace;
            const cancelBtn = document.getElementById('cancel-edit-btn');
            if (cancelBtn) cancelBtn.remove();
            document.querySelector('#places-tab .form-section h2').textContent = 'Create New Place';
            loadPlaces();
        } else {
            const error = await response.json();
            showAlert('places-tab', 'Error: ' + (error.message || 'Failed to update place'), 'error');
        }
    } catch (error) {
        showAlert('places-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Delete place
async function deletePlace(placeId) {
    if (!confirm('Are you sure you want to delete this place?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            showAlert('places-tab', 'Place deleted successfully!', 'success');
            loadPlaces();
        } else {
            const error = await response.json();
            showAlert('places-tab', 'Error: ' + (error.message || 'Failed to delete place'), 'error');
        }
    } catch (error) {
        showAlert('places-tab', 'Connection error: ' + error.message, 'error');
    }
}

// ==================== REVIEWS ====================

// Load all reviews
async function loadReviews() {
    const listElement = document.getElementById('reviews-list');
    listElement.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        } else {
            listElement.innerHTML = '<p>Failed to load reviews</p>';
        }
    } catch (error) {
        listElement.innerHTML = '<p>Error loading reviews</p>';
    }
}

// Display reviews
function displayReviews(reviews) {
    const listElement = document.getElementById('reviews-list');
    
    if (!reviews || reviews.length === 0) {
        listElement.innerHTML = '<p>No reviews found</p>';
        return;
    }

    listElement.innerHTML = '';
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.position = 'relative';
        
        const userName = review.user 
            ? `${review.user.first_name} ${review.user.last_name}` 
            : 'Unknown User';
        
        const rating = '⭐'.repeat(review.rating || 0);
        
        // Escape quotes in text for onclick attribute
        const escapedText = (review.text || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        card.innerHTML = `
            <div style="margin-bottom: 10px;">
                <h3 style="color: #f39c12; margin-bottom: 5px;">${rating} (${review.rating}/5)</h3>
            </div>
            <p><strong>👤 Reviewer:</strong> ${userName}</p>
            <p><strong>💬 Review:</strong></p>
            <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">${review.text}</p>
            <p style="font-size: 0.85em; color: #999;"><strong>Place ID:</strong> ${review.place_id}</p>
            <p class="item-id">Review ID: ${review.id}</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button onclick="editReview('${review.id}', '${escapedText}', ${review.rating})" style="flex: 1; padding: 8px 15px; background: #795548; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">✏️ Edit</button>
                <button onclick="deleteReview('${review.id}')" style="flex: 1; padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">🗑️ Delete</button>
            </div>
        `;
        listElement.appendChild(card);
    });
}

// Edit review
function editReview(reviewId, currentText, currentRating) {
    // Decode escaped characters
    const decodedText = currentText.replace(/\\'/g, "'").replace(/&quot;/g, '"');
    
    const newText = prompt('Edit Review Text:', decodedText);
    if (newText === null) return; // User cancelled
    
    const newRating = prompt('Edit Rating (1-5):', currentRating);
    if (newRating === null) return; // User cancelled
    
    const rating = parseInt(newRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Invalid rating. Must be between 1 and 5.');
        return;
    }
    
    if (newText.trim() !== '') {
        updateReview(reviewId, newText.trim(), rating);
    } else {
        alert('Review text cannot be empty.');
    }
}

// Update review
async function updateReview(reviewId, text, rating) {
    try {
        // First, get the review to get user_id and place_id
        const getResponse = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (!getResponse.ok) {
            showAlert('reviews-tab', 'Error: Could not load review details', 'error');
            return;
        }

        const reviewData = await getResponse.json();

        // Now update with all required fields
        const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                text: text,
                rating: rating,
                user_id: reviewData.user_id,
                place_id: reviewData.place_id
            })
        });

        if (response.ok) {
            showAlert('reviews-tab', 'Review updated successfully!', 'success');
            loadReviews();
        } else {
            const error = await response.json();
            showAlert('reviews-tab', 'Error: ' + (error.message || 'Failed to update review'), 'error');
        }
    } catch (error) {
        showAlert('reviews-tab', 'Connection error: ' + error.message, 'error');
    }
}

// Delete review
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            showAlert('reviews-tab', 'Review deleted successfully!', 'success');
            loadReviews();
        } else {
            const error = await response.json();
            showAlert('reviews-tab', 'Error: ' + (error.message || 'Failed to delete review'), 'error');
        }
    } catch (error) {
        showAlert('reviews-tab', 'Connection error: ' + error.message, 'error');
    }
}
