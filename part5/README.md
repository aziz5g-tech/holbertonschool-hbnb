# HBnB - Part 4: Simple Web Client

## 📋 Project Overview

This is the frontend web client for the HBnB (Holberton BnB) application, built with HTML5, CSS3, and vanilla JavaScript ES6. The client provides a user-friendly interface for browsing places, viewing details, and managing reviews.

## 🎯 Task 0: Design - COMPLETED

This implementation completes Task 0 requirements:
- ✅ Login Form page
- ✅ List of Places page  
- ✅ Place Details page
- ✅ Add Review Form page
- ✅ Semantic HTML5 structure
- ✅ All required CSS classes implemented
- ✅ Fixed CSS parameters applied
- ✅ Responsive design
- ✅ W3C Validator compliant

## 📁 Project Structure

```
part4/
├── index.html              # Main page - List of all places
├── login.html              # User login page
├── place.html              # Detailed view of a single place
├── add_review.html         # Form to add a review (authenticated users)
├── styles.css              # Main stylesheet with all styling
├── README.md               # This file
├── scripts/                # JavaScript files (to be implemented in Tasks 2-5)
│   ├── index.js           # (Placeholder - Task 3)
│   ├── login.js           # (Placeholder - Task 2)
│   ├── place.js           # (Placeholder - Task 4)
│   └── add_review.js      # (Placeholder - Task 5)
└── images/                 # Image assets directory
    ├── icon.png           # (To be added - Favicon)
    └── logo.png           # (To be added - Logo image)
```

## 🎨 Design Specifications

### Color Palette
- **Primary Color**: `#FF5A5F` (Red - for main actions)
- **Secondary Color**: `#00A699` (Teal - for accents)
- **Dark Color**: `#484848` (Charcoal - for text)
- **Light Gray**: `#F7F7F7` (Background)
- **Border Color**: `#DDDDDD` (Borders)
- **Success Color**: `#008489` (Success messages)
- **Error Color**: `#C13515` (Error messages)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Base Font Size**: 16px
- **Line Height**: 1.6

### Fixed CSS Parameters (As Required)
All place cards and review cards follow these specifications:
```css
margin: 20px;
padding: 10px;
border: 1px solid #ddd;
border-radius: 10px;
```

## 🔑 Required CSS Classes

### Header Elements
- `.logo` - Application logo/brand name
- `.login-button` - Login button in navigation

### Place Cards (index.html)
- `.place-card` - Container for each place listing
- `.details-button` - "View Details" button on each card

### Place Details (place.html)
- `.place-details` - Container for place detail view
- `.place-info` - Place information section
- `.review-card` - Container for each review

### Forms
- `.add-review` - Add review form container
- `.form` - Form styling class

## 📄 Pages Description

### 1. Login Page (`login.html`)
**Purpose**: User authentication interface

**Features**:
- Email and password input fields
- Form validation attributes (required, minlength)
- Error message container
- Gradient background design
- Responsive layout
- Link back to home page

**Required Elements**:
- Email input (type="email", required)
- Password input (type="password", required, minlength="6")
- Submit button
- Error message display area

---

### 2. Index Page (`index.html`)
**Purpose**: Browse and filter available places

**Features**:
- Header with logo and login button
- Country filter dropdown
- Grid layout of place cards
- Sample place cards with mock data
- Responsive grid (adjusts to screen size)
- Loading spinner placeholder
- Error message container

**Place Card Contents**:
- Place name (h3)
- Price per night
- Description (truncated)
- Location
- "View Details" button

**Sample Data**: 5 sample places included for visual reference

---

### 3. Place Details Page (`place.html`)
**Purpose**: Display complete information about a specific place

**Features**:
- Breadcrumb navigation (back to places)
- Place header with title and price
- Description section
- Host information card
- Location coordinates
- Amenities list with tags
- Reviews section with sample reviews
- "Add Review" button (hidden by default, shown for authenticated users)

**Information Displayed**:
- Title and price
- Full description
- Host name and email
- Latitude and longitude
- List of amenities
- Guest reviews with ratings
- Review dates

**Sample Data**: Includes 3 sample reviews for visual reference

---

### 4. Add Review Page (`add_review.html`)
**Purpose**: Allow authenticated users to submit reviews

**Features**:
- Rating dropdown (1-5 stars with visual indicators)
- Review textarea with character counter
- Real-time character counting
- Form validation (minlength: 10, maxlength: 1000)
- Review guidelines section
- Cancel and Submit buttons
- Error/Success message containers

**Form Fields**:
- Rating: Required dropdown with star ratings
- Review text: Required textarea (10-1000 characters)

**Validation**:
- Client-side validation with HTML5 attributes
- Character counter with color feedback
- Minimum 10 characters enforced

---

## 🎯 Design Features

### Responsive Design
The layout adapts to three breakpoints:
- **Desktop**: 1200px+ (full grid layout)
- **Tablet**: 768px (adjusted grid, stacked navigation)
- **Mobile**: 480px and below (single column, full-width buttons)

### Accessibility
- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- ARIA labels and attributes where needed
- Proper form labels associated with inputs
- Color contrast ratios meet WCAG guidelines
- Focus states on interactive elements

### User Experience
- Hover effects on cards and buttons
- Smooth transitions (0.3s ease)
- Loading spinner for async operations
- Clear error and success messages
- Breadcrumb navigation
- Sticky header on scroll

## 🚀 Getting Started

### Viewing the Pages

1. **Option 1: Python HTTP Server (Recommended)**
   ```bash
   cd part4
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

2. **Option 2: Node.js HTTP Server**
   ```bash
   npm install -g http-server
   cd part4
   http-server -p 8000
   ```
   Then open: `http://localhost:8000`

3. **Option 3: VS Code Live Server**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

### Navigation Flow
```
index.html (Main Page)
    ↓
    ├→ login.html (Login Page)
    │
    ├→ place.html?id=1 (Place Details)
    │   ↓
    │   └→ add_review.html?place_id=1 (Add Review - Auth Required)
    │
    └→ Other place cards...
```

## ✅ W3C Validation

All HTML pages are designed to pass W3C validation:

1. Visit: https://validator.w3.org/
2. Upload or paste each HTML file
3. Ensure 0 errors and 0 warnings

**To validate**:
```bash
# For each HTML file:
- index.html
- login.html  
- place.html
- add_review.html
```

## 🎨 Image Placeholders

Currently, the design uses emoji and colored div placeholders for images:

### Required Images (To be added):
1. **logo.png** - Application logo for header
   - Recommended size: 200x50px or similar
   - Format: PNG with transparency
   - Location: `images/logo.png`

2. **icon.png** - Favicon
   - Size: 32x32px and 16x16px
   - Format: PNG or ICO
   - Location: `images/icon.png`

3. **Place Images** (Optional)
   - Sample images for place cards
   - Recommended size: 400x300px
   - Format: JPG or PNG

### Current Placeholder Strategy:
- **Logo**: Text-based "HBnB" with CSS styling
- **Place Images**: Colored gradient divs with emoji icons
- **Favicon**: Linked but not required for functionality

## 🔧 Customization

### Changing Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #FF5A5F;    /* Change to your primary color */
    --secondary-color: #00A699;  /* Change to your secondary color */
    /* ... more variables ... */
}
```

### Changing Fonts
Update the font-family in `styles.css`:
```css
:root {
    --font-family: 'Your Font', sans-serif;
}
```

### Modifying Card Layout
The places grid uses CSS Grid with auto-fill:
```css
.places-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```
Adjust `minmax(300px, 1fr)` to change card width.

## 📱 Browser Compatibility

Tested and compatible with:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

**Note**: Internet Explorer is not supported (uses modern CSS features).

## 🔜 Next Steps (Tasks 2-5)

The JavaScript functionality will be implemented in subsequent tasks:

### Task 2: Login (scripts/login.js)
- Implement login form submission
- API integration for authentication
- JWT token storage in cookies
- Error handling and validation

### Task 3: List of Places (scripts/index.js)
- Fetch places from API
- Dynamic place card generation
- Country filtering functionality
- Authentication check and redirect

### Task 4: Place Details (scripts/place.js)
- Fetch place details by ID
- Dynamic content rendering
- Review display
- Authentication-based button visibility

### Task 5: Add Review (scripts/add_review.js)
- Review form submission
- API integration with authentication
- Form validation
- Redirect after submission

## 🐛 Known Design Considerations

- **Sample Data**: Current pages show mock data for visual reference. This will be replaced with dynamic API data in later tasks.
- **JavaScript Links**: All `<script>` tags point to files that will be created in subsequent tasks.
- **Authentication**: Login/logout buttons are present but non-functional until Task 2.
- **Dynamic Content**: All content is currently static HTML and will become dynamic with JavaScript implementation.

## 📚 Resources

- [HTML5 Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS3 Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [W3C Validator](https://validator.w3.org/)
- [Semantic HTML Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements)

## 📝 Design Checklist

- ✅ All 4 pages created (login, index, place, add_review)
- ✅ Semantic HTML5 structure
- ✅ All required CSS classes implemented
- ✅ Fixed parameters applied (margin, padding, border, border-radius)
- ✅ Responsive design with media queries
- ✅ Header with logo and login button
- ✅ Footer with copyright
- ✅ Navigation links between pages
- ✅ Place cards with required content
- ✅ Details button on each card
- ✅ Place details page with all sections
- ✅ Review cards with proper styling
- ✅ Add review form with validation
- ✅ Color scheme applied consistently
- ✅ Typography defined and applied
- ✅ Accessibility features included
- ✅ Sample/mock data for visual reference

## 👥 Credits

**Project**: HBnB (Holberton BnB) - Part 4: Simple Web Client  
**Task**: Task 0 - Design  
**Institution**: Holberton School  
**Year**: 2026

## 📄 License

This project is part of the Holberton School curriculum.

---

**Note**: This README covers Task 0 (Design). Documentation will be updated as JavaScript functionality is added in Tasks 2-5.
