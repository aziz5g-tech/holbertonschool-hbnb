# Image Assets Directory

This directory contains image assets for the HBnB web client.

## Required Images

### 1. Logo (logo.png)
- **Purpose**: Application logo displayed in header
- **Recommended Size**: 200x50px or 180x45px
- **Format**: PNG with transparent background
- **Usage**: Referenced in HTML but currently using CSS text

**Current Status**: Using CSS-styled text "HBnB" as placeholder

### 2. Favicon (icon.png)
- **Purpose**: Browser tab icon
- **Required Sizes**: 
  - 16x16px (icon-16.png)
  - 32x32px (icon-32.png)
  - Or use .ico format with multiple sizes
- **Format**: PNG or ICO
- **Usage**: Linked in all HTML pages `<link rel="icon">`

**Current Status**: Linked but file doesn't exist (browser will use default)

### 3. Place Images (Optional)
- **Purpose**: Images for place cards (instead of emoji placeholders)
- **Recommended Size**: 400x300px (4:3 ratio)
- **Format**: JPG or PNG
- **Naming Convention**: 
  - place-1.jpg
  - place-2.jpg
  - place-3.jpg
  - etc.

**Current Status**: Using colored gradient divs with emoji icons

## How to Add Images

### Option 1: Create Simple Placeholders

For quick testing, you can create simple colored PNG files:

1. **Online Tools**:
   - https://placeholder.com/
   - https://dummyimage.com/
   - https://via.placeholder.com/

2. **Example URLs** (for temporary use):
   ```
   Logo: https://via.placeholder.com/200x50/FF5A5F/FFFFFF?text=HBnB
   Icon: https://via.placeholder.com/32/FF5A5F/FFFFFF?text=H
   ```

### Option 2: Create Custom Images

#### Create a Simple Logo:
1. Use any image editor (GIMP, Photoshop, Canva, etc.)
2. Create a 200x50px canvas
3. Add "HBnB" text in your brand color (#FF5A5F)
4. Export as PNG with transparency
5. Save as `images/logo.png`

#### Create a Favicon:
1. Create a 32x32px image
2. Use a simple "H" or house icon
3. Save as PNG: `images/icon.png`

**Or use online favicon generators**:
- https://favicon.io/
- https://realfavicongenerator.net/

### Option 3: Use Free Stock Images

For place images, use royalty-free image sources:
- https://unsplash.com/ (apartments, homes, travel)
- https://pexels.com/ (real estate photos)
- https://pixabay.com/ (free images)

**Search terms**:
- "apartment interior"
- "luxury home"
- "beach house"
- "mountain cabin"
- "city loft"

## Current Implementation

The current design works without actual images:

- **Logo**: CSS-styled text in header (`.logo` class)
- **Favicon**: Browser default icon
- **Place Cards**: Gradient backgrounds with emoji icons (🏠, 🏡, 🏖️, 🏔️, 🏰)

This approach ensures the design is functional immediately without requiring external assets.

## Updating HTML to Use Images

When you add images, update the HTML:

### For Logo (in all HTML files):
**Current**:
```html
<a href="index.html" class="logo">HBnB</a>
```

**With Image**:
```html
<a href="index.html" class="logo">
    <img src="images/logo.png" alt="HBnB Logo">
</a>
```

### For Place Cards (in index.html):
**Current**:
```html
<div class="place-card-image">
    🏠
</div>
```

**With Image**:
```html
<div class="place-card-image">
    <img src="images/place-1.jpg" alt="Cozy Downtown Apartment">
</div>
```

And update CSS for `.place-card-image img`:
```css
.place-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}
```

## Notes

- Images are **optional** for Task 0 (Design)
- The current implementation is fully functional without images
- Images can be added anytime without breaking existing functionality
- For production, optimize all images (compress, proper formats, responsive sizes)
