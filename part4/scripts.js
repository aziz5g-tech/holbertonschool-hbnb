// API Base URL - Update this with your API URL
const API_BASE_URL = 'http://127.0.0.1:5001/api/v1';

// Utility function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Utility function to set cookie
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Utility function to delete cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Check if user is authenticated
function checkAuthentication() {
    const token = getCookie('token');
    return token;
}

// Logout function
function logout() {
    deleteCookie('token');
    window.location.href = 'login.html';
}

// ==================== LOGIN PAGE ====================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

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
                    setCookie('token', data.access_token);
                    window.location.href = 'index.html';
                } else {
                    const error = await response.json();
                    alert('Login failed: ' + (error.message || response.statusText));
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }

    // ==================== INDEX PAGE ====================
    const placesList = document.getElementById('places-list');
    const priceFilter = document.getElementById('price-filter');

    if (placesList) {
        const loginLink = document.getElementById('login-link');
        const token = checkAuthentication();
        
        // Show or hide login link based on authentication
        if (loginLink) {
            if (token) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
        }

        // Fetch and display places
        fetchPlaces(token);

        // Price filter event listener
        if (priceFilter) {
            priceFilter.addEventListener('change', (event) => {
                const maxPrice = event.target.value;
                filterPlacesByPrice(maxPrice);
            });
        }
    }

    // ==================== PLACE DETAILS PAGE ====================
    const placeDetails = document.getElementById('place-details');

    if (placeDetails) {
        const token = checkAuthentication();
        const placeId = getPlaceIdFromURL();
        const loginLink = document.getElementById('login-link');

        // Show or hide login link based on authentication
        if (loginLink) {
            if (token) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
        }

        if (placeId) {
            fetchPlaceDetails(token, placeId);
        } else {
            placeDetails.innerHTML = '<p>Place ID not found in URL.</p>';
        }

        // Add review form submission
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (!token) {
                    alert('You must be logged in to submit a review.');
                    return;
                }

                const reviewText = document.getElementById('review-text').value;
                const rating = document.getElementById('rating').value;

                await submitReview(token, placeId, reviewText, rating);
            });
        }
    }

    // ==================== ADD REVIEW PAGE ====================
    const addReviewForm = document.querySelector('#review-form');
    const isAddReviewPage = document.getElementById('place-name') !== null;
    
    if (addReviewForm && isAddReviewPage) {
        const token = checkAuthentication();

        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const placeId = getPlaceIdFromURL();
        
        if (placeId) {
            // Fetch place name to display
            fetchPlaceName(token, placeId);
        }

        addReviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;

            await submitReview(token, placeId, reviewText, rating);
        });
    }
});

// ==================== FETCH FUNCTIONS ====================

// Fetch all places
async function fetchPlaces(token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
            document.getElementById('places-list').innerHTML = '<p>Failed to load places.</p>';
        }
    } catch (error) {
        console.error('Error fetching places:', error);
        document.getElementById('places-list').innerHTML = '<p>Error loading places.</p>';
    }
}

// Display places
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    if (!places || places.length === 0) {
        placesList.innerHTML = '<p>No places available.</p>';
        return;
    }

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.dataset.price = place.price_per_night || place.price || 0;

        placeCard.innerHTML = `
            <img src="images/place_${Math.floor(Math.random() * 11) + 1}.jpg" alt="${place.title || place.name}" onerror="this.src='images/logo.png'">
            <h3>${place.title || place.name}</h3>
            <p class="price">$${place.price || place.price_per_night || 'N/A'} per night</p>
            <p>${place.description ? place.description.substring(0, 100) + '...' : 'No description available'}</p>
            <button class="details-button" onclick="viewPlaceDetails('${place.id}')">View Details</button>
        `;

        placesList.appendChild(placeCard);
    });
}

// Filter places by price
function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        const price = parseFloat(card.dataset.price);
        
        if (maxPrice === 'all') {
            card.style.display = 'block';
        } else {
            const maxPriceNum = parseFloat(maxPrice);
            if (price <= maxPriceNum) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// View place details
function viewPlaceDetails(placeId) {
    window.location.href = `place.html?place_id=${placeId}`;
}

// Get place ID from URL
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id');
}

// Fetch place details
async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place, token);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
            document.getElementById('place-details').innerHTML = '<p>Failed to load place details.</p>';
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        document.getElementById('place-details').innerHTML = '<p>Error loading place details.</p>';
    }
}

// Display place details
async function displayPlaceDetails(place, token) {
    const placeDetails = document.getElementById('place-details');
    
    placeDetails.innerHTML = `
        <div class="place-info">
            <h1>${place.title || place.name}</h1>
            <p><strong>Host:</strong> ${place.owner ? (place.owner.first_name + ' ' + place.owner.last_name) : 'Unknown'}</p>
            <p class="price">$${place.price || place.price_per_night || 'N/A'} per night</p>
            <p><strong>Description:</strong> ${place.description || 'No description available'}</p>
            <p><strong>Location:</strong> ${place.latitude}, ${place.longitude || 'Unknown'}</p>
            ${place.amenities && place.amenities.length > 0 ? `
                <p><strong>Amenities:</strong></p>
                <ul class="amenities-list">
                    ${place.amenities.map(amenity => `<li>${amenity.name || amenity}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `;

    // Display reviews (now async)
    await displayReviews(place.reviews || []);

    // Show add review section if authenticated
    const addReviewSection = document.getElementById('add-review');
    if (addReviewSection) {
        if (token) {
            addReviewSection.style.display = 'block';
        } else {
            addReviewSection.style.display = 'none';
        }
    }
}

// Display reviews
async function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    
    if (!reviewsList) return;

    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    reviewsList.innerHTML = '';
    const token = getCookie('token');
    
    for (const review of reviews) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        // Fetch user information
        let userName = 'Anonymous';
        if (review.user_id) {
            try {
                const userResponse = await fetch(`${API_BASE_URL}/users/${review.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (userResponse.ok) {
                    const user = await userResponse.json();
                    userName = `${user.first_name} ${user.last_name}`;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${userName}</span>
                <span class="rating">${'⭐'.repeat(review.rating || 0)} (${review.rating || 0}/5)</span>
            </div>
            <p class="review-text">${review.text || review.comment || 'No comment'}</p>
        `;
        
        reviewsList.appendChild(reviewCard);
    }
}

// Submit review
async function submitReview(token, placeId, reviewText, rating) {
    try {
        let userId = null;
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                userId = payload.sub; 
            }
        } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
        }

        if (!userId) {
            alert('Error: Unable to get user information. Please login again.');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                place_id: placeId,
                user_id: userId,
                text: reviewText,
                rating: parseInt(rating)
            })
        });

        if (response.ok) {
            alert('Review submitted successfully!');
            
            const isAddReviewPage = document.getElementById('place-name') !== null;
            if (isAddReviewPage) {
                window.location.href = `place.html?place_id=${placeId}`;
            } else {
                location.reload();
            }
        } else {
            const error = await response.json();
            alert('Failed to submit review: ' + (error.message || response.statusText));
        }
    } catch (error) {
        alert('Error submitting review: ' + error.message);
    }
}

// Fetch place name for add review page
async function fetchPlaceName(token, placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const place = await response.json();
            const placeNameElement = document.getElementById('place-name');
            if (placeNameElement) {
                placeNameElement.textContent = `Add Review for ${place.name || place.title}`;
            }
        }
    } catch (error) {
        console.error('Error fetching place name:', error);
    }
}