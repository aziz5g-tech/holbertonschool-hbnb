# HBnB - Part 4: Simple Web Client

## Description
This is the front-end implementation of the HBnB application using HTML5, CSS3, and JavaScript ES6.

## Features
- User authentication with JWT tokens
- Display list of places with filtering by price
- View detailed information about places
- Add reviews for places (authenticated users only)
- Responsive design

## Files Structure
- `index.html` - Main page displaying list of places
- `login.html` - User login page
- `place.html` - Detailed view of a specific place
- `add_review.html` - Form to add a review for a place
- `styles.css` - All styling for the application
- `scripts.js` - All JavaScript functionality
- `images/` - Directory containing images and logo

## Required Classes and IDs

### HTML Elements
- `logo` - Application logo in header
- `login-button` - Login button/link
- `place-card` - Container for each place in the list
- `details-button` - Button to view place details
- `place-details` - Container for place detail information
- `place-info` - Detailed information section
- `review-card` - Container for each review
- `add-review` - Section for adding reviews
- `form` - Form elements

### Design Requirements
- Margins: 20px for place and review cards
- Padding: 10px within place and review cards
- Border: 1px solid #ddd for place and review cards
- Border Radius: 10px for place and review cards

## Configuration
Before using the application, update the API base URL in `scripts.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
```

## Usage

### 1. Login
- Navigate to `login.html`
- Enter email and password
- Upon successful login, JWT token is stored in cookies
- User is redirected to the main page

### 2. Browse Places
- View all available places on the main page
- Filter places by maximum price using the dropdown
- Click "View Details" to see more information about a place

### 3. View Place Details
- See detailed information including host, price, description, and amenities
- View all reviews for the place
- Add a review if logged in

### 4. Add Review
- Must be logged in to add a review
- Rate the place from 1-5 stars
- Write your review text
- Submit to add your review

## API Endpoints Used
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/places/` - Get all places
- `GET /api/v1/places/{id}` - Get specific place details
- `POST /api/v1/reviews/` - Submit a new review

## Authentication
The application uses JWT (JSON Web Tokens) for authentication:
- Token is received upon successful login
- Token is stored in browser cookies
- Token is sent in Authorization header for authenticated requests
- Token persists for 7 days by default

## Notes
- All HTML pages are W3C compliant
- The application uses semantic HTML5 elements
- Client-side filtering is implemented for better performance
- Responsive design works on mobile and desktop devices
- Place images (place_1.jpg, place_2.jpg, place_3.jpg) should be added to the images/ directory for better display. The application will fall back to logo.png if images are not found.
